import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { CookieManager } from '@app/core/Utils/CookieManager.util';
@Component({
  selector: 'app-login',
  imports: [DialogModule, ButtonModule, FormsModule, MessageModule,CommonModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  Cancel() {
    this.displayLoginDialog = false;
    this.displayLoginDialogChange.emit(this.displayLoginDialog);
    this.ErrorMessage = '';
    this.errormsg = false;
    this.username = '';
    this.email = '';
    this.password = '';
  }
  authService: AuthService; //injected service
  @Input() displayLoginDialog: boolean = false;
  @Output() displayLoginDialogChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  username: string = '';
  email: string = '';
  password: string = '';
  isLoggedIn: boolean = false; // Set to false initially to simulate logged-out state
  ErrorMessage: string = '';
  loading = false;
  errormsg: boolean = false;
  constructor(authService: AuthService, private cookie: CookieManager) {
    this.authService = authService;
  }
  loginUser() {
    if (this.username.trim() && this.password) {
      this.loading = true;
      this.errormsg = false;
      this.authService.login({ userName: this.username.trim(), password: this.password }).subscribe({
        next: res => {
           this.loading = false;
           const accessToken = res.data?.accessToken;
           if (res.successCode === 200 && res.success !== false && accessToken) {
             this.displayLoginDialog = false;
             this.isLoggedIn = true;
             localStorage.setItem('token', accessToken);
              // Set the cookie with the access token
              this.cookie.setCookie('jwt', accessToken, 1);
             this.displayLoginDialogChange.emit(this.isLoggedIn);
           }
           else {
             this.errormsg = true;
             this.ErrorMessage = res.message || 'Login failed. Please check your details and try again.';
            this.displayLoginDialog = true;
            this.isLoggedIn = false;
          }
          // navigate, show success, etc.
        },
        error: err => {
          this.loading = false;
            this.errormsg = true;
            this.ErrorMessage = err?.error?.message || err?.message || 'Login failed. Please try again.';
            this.displayLoginDialog = true;
            this.isLoggedIn = false;
        }
      });
    } else {
      this.errormsg = true;
      this.ErrorMessage = 'Enter your username and password to continue.';
      this.displayLoginDialog = true;
      this.isLoggedIn = false;
    }
  }
}
