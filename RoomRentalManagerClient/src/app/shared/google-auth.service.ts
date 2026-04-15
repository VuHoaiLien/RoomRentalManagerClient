import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GOOGLE_CONFIG } from '../config/google.config';
import { ServiceProxy, LoginResponseDto, GoogleLoginRequestDto } from './services';

declare const google: any;

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  clientId?: string;
}

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  // Subject to emit Google credential when received
  private credentialSubject = new Subject<GoogleCredentialResponse>();
  public credential$ = this.credentialSubject.asObservable();

  constructor(
    private proxy: ServiceProxy,
    private router: Router,
    private ngZone: NgZone
  ) {}

  /**
   * Initialize Google Identity Services
   * Should be called once when the login component is loaded
   */
  initialize(): Promise<void> {
    if (this.initialized) {
      return Promise.resolve();
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      // Check if google script is loaded
      if (typeof google === 'undefined' || !google.accounts) {
        console.error('Google Identity Services script not loaded');
        reject(new Error('Google Identity Services script not loaded'));
        return;
      }

      try {
        google.accounts.id.initialize({
          client_id: GOOGLE_CONFIG.clientId,
          callback: (response: GoogleCredentialResponse) => {
            this.ngZone.run(() => {
              this.handleCredentialResponse(response);
            });
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });

        this.initialized = true;
        resolve();
      } catch (error) {
        console.error('Failed to initialize Google Sign-In', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  /**
   * Render Google Sign-In button in a container
   * @param containerId The ID of the HTML element to render the button in
   */
  renderButton(containerId: string): void {
    if (!this.initialized) {
      console.warn('Google Sign-In not initialized. Call initialize() first.');
      return;
    }

    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container element with ID "${containerId}" not found`);
      return;
    }

    google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      logo_alignment: 'left',
      width: '100%'
    });
  }

  /**
   * Prompt Google One Tap sign-in
   */
  promptOneTap(): void {
    if (!this.initialized) {
      console.warn('Google Sign-In not initialized. Call initialize() first.');
      return;
    }

    google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.log('One Tap not displayed:', notification.getNotDisplayedReason() || notification.getSkippedReason());
      }
    });
  }

  /**
   * Handle Google credential response
   */
  private handleCredentialResponse(response: GoogleCredentialResponse): void {
    if (response.credential) {
      this.credentialSubject.next(response);
    }
  }

  /**
   * Login with Google ID token
   * @param idToken The Google ID token
   * @param rememberMe Whether to remember the login
   */
loginWithGoogle(idToken: string, rememberMe: boolean = false): Observable<LoginResponseDto> {
    const request = new GoogleLoginRequestDto({ idToken, rememberMe });
    return this.proxy.google(request).pipe(
        tap(res => {
            if (res && res.accessToken) {
                this.saveTokens(res, rememberMe);
                if (res.roleGroupPermissions) {
                    localStorage.setItem('role_group_permissions', JSON.stringify(res.roleGroupPermissions));
                }
                if (res.user) {
                    localStorage.setItem('user', JSON.stringify(res.user));
                }
            }
        })
    );
}

/**
 * Save tokens to storage
 */
private saveTokens(res: LoginResponseDto, remember: boolean): void {
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
    if (res.user?.avatar != null && res.user?.avatar !== '') {
      localStorage.setItem('avatar_url', res.user.avatar);
    }
  }

  /**
   * Revoke Google access (sign out from Google)
   */
  revokeAccess(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.disableAutoSelect();
    }
  }
}
