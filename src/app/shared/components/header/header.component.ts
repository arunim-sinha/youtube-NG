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
import { RegistrationComponent } from './register/registration/registration.component';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import {TemplateRef } from '@angular/core';
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
    RegistrationComponent,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
[x: string]: any;
  authService: AuthService; //injected service
  isLoggedIn: boolean = false; // Set to false initially to simulate logged-out state
  displayLoginDialog: boolean = false;
  displayRegisterDialog: boolean = false;
  username: string = '';
  email: string = '';
  password: string = '';
  ErrorMessage: string = '';
  errormsg: boolean = false;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  menuItems: MenuItem[] = [
    { label: 'Home', routerLink: '/', styleClass: 'p-menubar-start' },
    { label: 'About', routerLink: '/about', styleClass: 'p-menubar-start' },
    { label: 'Services', routerLink: '/services',styleClass: 'p-menubar-start'},
    { label: 'Contact', routerLink: '/contact', styleClass: 'p-menubar-start' },
    
    { label: 'Profile',  routerLink: '/profile',visible: this.isLoggedIn, styleClass: '.p-menubar-end' },
    { label: 'Logout', command: () => this.logout(), visible: this.isLoggedIn,styleClass: '.p-menubar-end'},
    { label: 'Register', command: () => this.register(), visible: !this.isLoggedIn, styleClass: '.p-menubar-end'},
    { label: 'Login', command: () => this.login(),visible: !this.isLoggedIn, styleClass: '.p-menubar-end' },
  ];
  register() {
    this.displayRegisterDialog = true;
    this.username = '';
    this.email = '';
    this.password = '';
  }

  get startMenuItems() {
  return this.menuItems.filter(item => item.styleClass === 'p-menubar-start');
}
  get endMenuItems() {
    return this.menuItems.filter(item => item.styleClass === '.p-menubar-end');
  }
  resetLoginRegisterVisible($event: boolean) {
    console.log('resetLoginRegisterVisible called with:', $event);
    this.displayLoginDialog = false;
    this.displayRegisterDialog = false;
    this.username = '';
    this.email = '';
    this.password = '';
    this.ErrorMessage = '';
    this.errormsg = false;
  }
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
    document.cookie =
      'accessToken=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    this.isLoggedIn = false;
  }
}
