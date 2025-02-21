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
    MessageModule
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
  ErrorMessage: string='';
  errormsg: boolean = false;
  constructor(authService: AuthService) {
    this.authService = authService;
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
      console.log(this.username, this.email, this.password);
      this.authService
        .register({
          userName: this.username,
          email: this.email,
          password: this.password,
        })
        .then((response: any) => {
          if (response && response.successCode === 200 && response.success) {
            console.log(response.message);
            console.log('User details:', response.data);
            this.displayRegisterDialog = false;
          } else {
            this.errormsg = true;
            this.ErrorMessage='Registration failed';
            console.log('Registration failed');
          }
        })
        .catch((error: any) => {
          this.errormsg = true;
          this.ErrorMessage='Registration failed due to unknown error';
          console.log('Registration failed due to unknown error');
        });
    } else {
      this.errormsg = true;
      this.ErrorMessage='Registration failed due to null or undefined inputs';
      console.log('Registration failed due to null or undefined inputs');
    }
  }
  displayRegisterDialog: boolean = false;
  register() {
    this.displayRegisterDialog = true;
  }
  // Function to handle login action (simulating successful login)
  login() {
    this.isLoggedIn = true;
  }

  // Function to handle logout (optional)
  logout() {
    this.isLoggedIn = false;
  }
}
