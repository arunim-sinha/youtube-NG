import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
import e from 'express';
@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    ButtonModule,
    MenubarModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService: AuthService; //injected service
  isLoggedIn: boolean = false; // Set to false initially to simulate logged-out state
  username: string="";
  email: string="";
  password: string="";
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
      this.authService
        .register({
          username: this.username,
          email: this.email,
          password: this.password,
        })
        .then((response: Response) => {
          response.json().then((data: any) => {
            if (data !== null && data !== undefined) {
              if (data.success) {
                console.log('Registration successful');
                this.displayRegisterDialog = false;
              } else {
                console.log('Registration failed');
              }
            } else {
              console.log('Registration failed due to unknown error');
            }
          });
        })
        .catch((error: any) => {
          console.log('Registration failed due to unknown error');
        });
    } else {
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
