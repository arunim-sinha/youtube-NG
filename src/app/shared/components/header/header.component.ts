import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ButtonModule,
    MenubarModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    MessageModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService: AuthService; //injected service
  isLoggedIn: boolean = false; // Set to false initially to simulate logged-out state
  username: string = '';
  email: string = '';
  password: string = '';
  ErrorMessage: string = '';
  errormsg: boolean = false;
  displayLoginDialog: boolean = false;
  constructor(authService: AuthService) {
    this.authService = authService;
  }
  register() {
    this.displayRegisterDialog = true;
    this.username = '';
    this.email = '';
    this.password = '';
  }
  registerUser() {
    if (
      this.username !== null &&
      this.username !== undefined &&
      this.email !== null &&
      this.email !== undefined &&
      this.password !== null &&
      this.password !== undefined
    ) {
      //console.log(this.username, this.email, this.password);
      this.authService
        .register({
          userName: this.username,
          email: this.email,
          password: this.password,
        })
        .then((response: any) => {
          if (response && response.successCode === 200 && response.success) {
            //console.log(response.message);
            //console.log('User details:', response.data);
            this.displayRegisterDialog = false;
          } else {
            this.errormsg = true;
            this.ErrorMessage = 'Registration failed';
            //console.log('Registration failed');
          }
        })
        .catch((error: any) => {
          this.errormsg = true;
          this.ErrorMessage = 'Registration failed due to unknown error';
          //console.log('Registration failed due to unknown error');
        });
    } else {
      this.errormsg = true;
      this.ErrorMessage = 'Registration failed due to null or undefined inputs';
      //console.log('Registration failed due to null or undefined inputs');
    }
  }
  displayRegisterDialog: boolean = false;
  
  // Function to handle login action (simulating successful login)
  login() {
    this.displayLoginDialog = true;
    this.username = '';
    this.password = '';
  }
  loginUser() {
    if (
      this.username !== null &&
      this.username !== undefined &&
      this.password !== null &&
      this.password !== undefined
    ) {
      //console.log(this.username, this.password); // Log the email and password
      this.authService
        .login({ userName: this.username, password: this.password })  // Pass the email and password to the login method
        .then((response: any) => {
          if (response && response.successCode === 200 && response.success) {
            //console.log(response.message);
            //console.log('User details:', response.data);
            this.displayLoginDialog = false;
            this.isLoggedIn = true;
            const accessToken = response.data.accessToken;
            localStorage.setItem('token', accessToken);
            document.cookie = `jwt=${accessToken}; path=/`;
          } else {
            this.errormsg = true;
            this.ErrorMessage = 'Login failed';
            //console.log('Login failed');
            this.displayLoginDialog = false;
            this.isLoggedIn = false;
          }
        })
        .catch((error: any) => {
          this.errormsg = true;
          this.ErrorMessage = 'Login failed due to unknown error';
          //console.log('Login failed due to unknown error');
          this.displayLoginDialog = false;
          this.isLoggedIn = false;
        });
    } else {
      this.errormsg = true;
      this.ErrorMessage = 'Login failed due to null or undefined inputs';
      //console.log('Login failed due to null or undefined inputs');
      this.displayLoginDialog = false;
      this.isLoggedIn = false;
    }
  }
  // Function to handle logout (optional)
  logout() {
    //remove access token to simulate logout from local storage and cookie
    localStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    this.isLoggedIn = false;
  }
}
