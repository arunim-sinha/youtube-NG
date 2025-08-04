import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
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
  ngOnInit() {
    try {
      //const token =localStorage.getItem('token') || this.getCookie('jwt');
      const token1 =
        typeof window !== 'undefined' && window.localStorage
          ? localStorage.getItem('token')
          : null;
      const token = token1 || this.getCookie('jwt');
      if (token) {
        this.authService
          .isLoggedIn()
          .pipe()
          .subscribe({
            next: (valid: boolean) => {
              this.isLoggedIn = valid;
              this.updateEndMenuItemsVisibility(valid);
            },
            error: () => {
              this.isLoggedIn = false;
              this.updateEndMenuItemsVisibility(false);
            },
          });
      } else {
        this.isLoggedIn = false;
        this.updateEndMenuItemsVisibility(false);
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
      this.ErrorMessage = 'An error occurred while initializing the header.';
      this.errormsg = true;
    }
  }

  getCookie(name: string): string | null {
    if (typeof document === 'undefined') {
      return null; // Return null if document is not available (e.g., during server-side rendering)
    }
    const match = document.cookie.match(
      new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? match[2] : null;
  }

  menuItems: MenuItem[] = [
    { label: 'Home', routerLink: '/', styleClass: 'p-menubar-start' },
    {
      label: 'Services',
      routerLink: '/services',
      styleClass: 'p-menubar-start',
    },
    { label: 'Contact', routerLink: '/contact', styleClass: 'p-menubar-start' },
    { label: 'About', routerLink: '/about', styleClass: 'p-menubar-start' },

    {
      label: 'Profile',
      routerLink: '/profile',
      visible: this.isLoggedIn,
      styleClass: '.p-menubar-end',
    },
    {
      label: 'Logout',
      command: () => this.logout(),
      visible: this.isLoggedIn,
      styleClass: '.p-menubar-end',
    },
    {
      label: 'Register',
      command: () => this.register(),
      visible: !this.isLoggedIn,
      styleClass: '.p-menubar-end',
    },
    {
      label: 'Login',
      command: () => this.login(),
      visible: !this.isLoggedIn,
      styleClass: '.p-menubar-end',
    },
  ];
  register() {
    this.displayRegisterDialog = true;
    this.username = '';
    this.email = '';
    this.password = '';
  }

  get startMenuItems() {
    return this.menuItems.filter(
      (item) => item.styleClass === 'p-menubar-start'
    );
  }
  get endMenuItems() {
    return this.menuItems.filter(
      (item) => item.styleClass === '.p-menubar-end'
    );
  }
  resetLoginRegisterVisible($event: boolean) {
    console.log('resetLoginRegisterVisible called with:', $event);
    this.isLoggedIn = $event;
    this.updateEndMenuItemsVisibility($event);
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
    this.authService.logout().subscribe({
      next: (res) => {
        console.log('Logout successful:', res);
        this.isLoggedIn = false;
        this.updateEndMenuItemsVisibility(false);
        this.displayLoginDialog = false;
        this.displayRegisterDialog = false;
        this.username = '';
        this.email = '';
        this.password = '';
        //remove access token to simulate logout from local storage and cookie
        localStorage.removeItem('token');
        document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
        window.location.href = '/';
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.ErrorMessage = 'Logout failed. Please try again.';
        this.errormsg = true;
      },
    });
  }

  updateEndMenuItemsVisibility(isLoggedIn: boolean) {
    this.menuItems.forEach((item, idx) => {
      if (item.styleClass === '.p-menubar-end') {
        // Show Profile and Logout only when logged in
        if (item.label === 'Profile' || item.label === 'Logout') {
          item.visible = isLoggedIn;
        }
        // Show Register and Login only when logged out
        if (item.label === 'Register' || item.label === 'Login') {
          item.visible = !isLoggedIn;
        }
      }
    });
    this.menuItems = [...this.menuItems]; // triggers change detection
  }
}
