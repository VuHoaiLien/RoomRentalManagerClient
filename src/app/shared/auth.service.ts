import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, catchError, finalize } from 'rxjs/operators';
import { ServiceProxy, LoginResponseDto, RefreshRequestDto, LogoutDto } from './services';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private expiryTimer: any = null;
  private refreshInProgress = false;
  // expose current user info for UI (sidebar avatar/username)
  public currentUser$ = new BehaviorSubject<{ username?: string; avatarUrl?: string; userId?: number } | null>(null);

  constructor(private proxy: ServiceProxy, private router: Router) {
    // start countdown if there's already a token on service init
    this.startExpiryCountdown();
    // populate current user from any existing token
    this.setCurrentUserFromToken();
  }
  login(username: string, password: string, rememberMe: boolean): Observable<LoginResponseDto> {
    return this.proxy.login(username, password, rememberMe).pipe(
      tap(res => {
        if (res && res.accessToken) {
          this.saveTokens(res, rememberMe);
        }
      })
    );
  }

  logout(): void {
    const userId = this.getUserIdFromToken();
    const finish = () => {
      this.clearStorage();
      this.router.navigate(['/login']);
    }
    if (userId !== undefined) {
      const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        // notify backend and always finish cleanup (ignore errors)
        this.proxy.logout(userId).pipe(
          catchError(() => of(null)),
          finalize(() => finish())
        ).subscribe();
      } else {
        finish();
      }
    }
    else {
      finish();
    }
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
  }

  isTokenExpired(bufferSeconds = 60): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    const payload = this.parseJwt(token);
    if (!payload || !payload.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= (now + bufferSeconds);
  }

  ensureValidToken(): Observable<boolean> {
    const token = this.getAccessToken();
    if (!token) return of(false);
    if (!this.isTokenExpired()) return of(true);

    const remember = localStorage.getItem('remember_me') === 'true';
    if (!remember) {
      this.clearStorage();
      this.router.navigate(['/login']);
      return of(false);
    }

    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearStorage();
      this.router.navigate(['/login']);
      return of(false);
    }

    // Delegate to shared refresh logic (auto-logout on failure)
    return this.attemptRefresh(remember, true);
  }

  startExpiryCountdown() {
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }

    const expiresAt = localStorage.getItem('expires_at') || sessionStorage.getItem('expires_at');
    if (!expiresAt) return;

    const expDate = new Date(expiresAt);
    if (isNaN(expDate.getTime())) return;

    const msUntil = expDate.getTime() - Date.now();
    if (msUntil <= 0) {
      this.handleExpiry();
      return;
    }

    this.expiryTimer = setTimeout(() => this.handleExpiry(), msUntil);
  }

  private handleExpiry() {
    if (this.refreshInProgress) return;
    const remember = localStorage.getItem('remember_me') === 'true';
    if (!remember) {
      this.clearStorage();
      this.router.navigate(['/login']);
      return;
    }
    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearStorage();
      this.router.navigate(['/login']);
      return;
    }
    this.attemptRefresh(true, true).subscribe((ok) => {
    });
  }


  private attemptRefresh(remember: boolean, autoLogoutOnFail = true): Observable<boolean> {
    if (this.refreshInProgress) return of(false);

    const refreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
    if (!refreshToken) {
      if (autoLogoutOnFail) {
        this.clearStorage();
        this.router.navigate(['/login']);
      }
      return of(false);
    }

    this.refreshInProgress = true;
    const userId = this.getUserIdFromToken();
    const req = new RefreshRequestDto({ userId: (userId as any) || undefined as any, refreshToken, rememberMe: remember });
    return this.proxy.refresh(req).pipe(
      map((res: any) => {
        // If server returned new tokens in the response body, save them.
        if (res && (res.accessToken || res.refreshToken || res.expiresAt || res.expiresIn)) {
          this.saveTokens(res as any, remember);
          return true;
        }
        // If server did not return token in body, client must coordinate with backend (cookies, headers)
        const newTok = this.getAccessToken();
        if (newTok) {
          // restart countdown if needed
          this.startExpiryCountdown();
          return true;
        }
        if (autoLogoutOnFail) {
          this.clearStorage();
          this.router.navigate(['/login']);
        }
        return false;
      }),
      catchError((err) => {
        console.error('Refresh failed', err);
        if (autoLogoutOnFail) {
          this.clearStorage();
          this.router.navigate(['/login']);
        }
        return of(false);
      }),
      finalize(() => {
        this.refreshInProgress = false;
      })
    );
  }

  /** Set currentUser$ from the access token payload (if present) */
  private setCurrentUserFromToken() {
    const token = this.getAccessToken();
    if (!token) {
      this.currentUser$.next(null);
      return;
    }
    const payload = this.parseJwt(token) || {};
    // support WS claims produced by some backends (e.g. .NET):
    // name: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name
    // nameidentifier: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier
    const username =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    undefined;
    const avatarUrl = localStorage.getItem('avatar_url') || sessionStorage.getItem('avatar_url') || undefined;
    const rawId =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    undefined;
    let userId: number | undefined = undefined;
    if (rawId !== undefined && rawId !== null) {
      if (typeof rawId === 'number') userId = rawId;
      else if (typeof rawId === 'string' && /^[0-9]+$/.test(rawId)) userId = parseInt(rawId, 10);
    }
    this.currentUser$.next({ username, avatarUrl, userId });
  }

  /** Read numeric userId from current access token if available */
  getUserIdFromToken(): number | undefined {
    const token = this.getAccessToken();
    if (!token) return undefined;
    const payload = this.parseJwt(token) || {};
    const rawId =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
    undefined;
    if (rawId === undefined || rawId === null) return undefined;
    if (typeof rawId === 'number') return rawId;
    if (typeof rawId === 'string' && /^[0-9]+$/.test(rawId)) return parseInt(rawId, 10);
    return undefined;
  }

  // helpers
  private saveTokens(res: LoginResponseDto, remember: boolean) {
    if (res.accessToken) {
      if (remember) localStorage.setItem('access_token', res.accessToken);
      else sessionStorage.setItem('access_token', res.accessToken);
    }
    if (res.refreshToken) {
      if (remember) localStorage.setItem('refresh_token', res.refreshToken);
      else sessionStorage.setItem('refresh_token', res.refreshToken);
    }
    if (res.expiresAt) {
      const exp = new Date(res.expiresAt).toISOString();
      if (remember) localStorage.setItem('expires_at', exp);
      else sessionStorage.setItem('expires_at', exp);
    } else if (res.expiresIn) {
      const exp = new Date(Date.now() + res.expiresIn * 1000).toISOString();
      if (remember) localStorage.setItem('expires_at', exp);
      else sessionStorage.setItem('expires_at', exp);
    }
    if (remember) localStorage.setItem('remember_me', 'true');
    else localStorage.removeItem('remember_me');
    if (res.user?.avatar != null && res.user?.avatar != '') {
      localStorage.setItem('avatar_url', res.user.avatar);
    }
    // (re)start expiry countdown based on the new expires_at value
    this.startExpiryCountdown();
    // update current user observable from new token
    this.setCurrentUserFromToken();
  }

  private clearStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('remember_me');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('expires_at');
    // clear any pending expiry timer
    if (this.expiryTimer) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
    // clear current user observable
    this.currentUser$.next(null);
  }

  private parseJwt(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  }
}
