import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from "./register/registration/registration.component";
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
    LoginComponent,
    RegistrationComponent
],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService: AuthService; //injected service
  isLoggedIn: boolean = false; // Set to false initially to simulate logged-out state
  displayLoginDialog: boolean = false;
  username: string = '';
  email: string = '';
  password: string = '';
  ErrorMessage: string = '';
  errormsg: boolean = false;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  register() {
    this.displayRegisterDialog = true;
    this.username = '';
    this.email = '';
    this.password = '';
  }
 
  displayRegisterDialog: boolean = false;
  
  // Function to handle login action (simulating successful login)
  login() {
    this.displayLoginDialog = true;
    this.username = '';
    this.password = '';
  }
  
  // Function to handle logout (optional)
  logout() {
    //remove access token to simulate logout from local storage and cookie
    localStorage.removeItem('accessToken');
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    this.isLoggedIn = false;
  }
}
