import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../shared/auth.service';
import { GoogleAuthService, GoogleCredentialResponse } from '../../shared/google-auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;
  isGoogleLoading: boolean = false;
  googleError: string = '';

  private googleSub?: Subscription;

  constructor(
    private router: Router,
    private auth: AuthService,
    private googleAuth: GoogleAuthService
  ) { }

  ngOnInit(): void {
    // Subscribe to Google credential responses
    this.googleSub = this.googleAuth.credential$.subscribe((response) => {
      this.handleGoogleCredential(response);
    });
  }

  ngAfterViewInit(): void {
    // Initialize Google Sign-In after view is ready
    this.initializeGoogleSignIn();
  }

  ngOnDestroy(): void {
    this.googleSub?.unsubscribe();
  }

  private async initializeGoogleSignIn(): Promise<void> {
    try {
      await this.googleAuth.initialize();
      // Render Google button in the container
      this.googleAuth.renderButton('google-signin-button');
    } catch (error) {
      console.error('Failed to initialize Google Sign-In', error);
      this.googleError = 'Không thể khởi tạo đăng nhập Google';
    }
  }

  private handleGoogleCredential(response: GoogleCredentialResponse): void {
    if (!response.credential) {
      this.googleError = 'Không nhận được thông tin từ Google';
      return;
    }

    this.isGoogleLoading = true;
    this.googleError = '';

    this.googleAuth.loginWithGoogle(response.credential, this.rememberMe).subscribe({
      next: (res) => {
        this.isGoogleLoading = false;
        if (res && res.accessToken) {
          this.router.navigate(['/main']);
        } else {
          this.googleError = 'Đăng nhập Google thất bại';
        }
      },
      error: (err) => {
        this.isGoogleLoading = false;
        console.error('Google login failed', err);
        this.googleError = err?.error?.message || 'Đăng nhập Google thất bại';
      }
    });
  }

  onLogin(): void {
    if (this.username && this.password) {
      this.auth.login(this.username, this.password, this.rememberMe).subscribe(
        (res) => {
          if (res && res.accessToken) {
            if (res.roleGroupPermissions) localStorage.setItem('role_group_permissions', JSON.stringify(res.roleGroupPermissions));
            if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
            this.router.navigate(['/main']);
          } else {
            console.error('Login failed: Invalid response', res);
          }
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
    }
  }

  onForgotPassword(event: Event): void {
    // Handle forgot password logic here
  }
}
