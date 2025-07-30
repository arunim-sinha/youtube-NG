import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
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
  errormsg: boolean = false;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  loginUser() {
    if (
      this.username !== null &&
      this.username !== undefined &&
      this.password !== null &&
      this.password !== undefined
    ) {
        this.authService.login({ userName: this.username, password: this.password }).subscribe({
        next: res => {
           if (res && res['successCode'] === 200 && res['success']!== false) {
             this.displayLoginDialog = false;
             this.isLoggedIn = true;
             const accessToken = res['data'].accessToken;
             localStorage.setItem('token', accessToken);
             document.cookie = `jwt=${accessToken}; path=/`;
             this.displayLoginDialogChange.emit(this.isLoggedIn);
           }
           else {
            console.error('Login failed', res);
            this.errormsg = true;
            this.ErrorMessage = res['message'] || 'Login failed due to unknown error';
            this.displayLoginDialog = true;
            this.isLoggedIn = false;
          }
          // navigate, show success, etc.
        },
        error: err => {
          console.error('Login failed', err);
            this.errormsg = true;
            this.ErrorMessage = 'Login failed due to unknown error';
            this.displayLoginDialog = true;
            this.isLoggedIn = false;
        }
      });
    } else {
      this.errormsg = true;
      this.ErrorMessage = 'Login failed due to null or undefined inputs';
      //console.log('Login failed due to null or undefined inputs');
      this.displayLoginDialog = true;
      this.isLoggedIn = false;
    }
  }
}
