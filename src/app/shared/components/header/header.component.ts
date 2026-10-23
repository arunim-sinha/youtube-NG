import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '@app/core/Services/AuthService/auth.service';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './register/registration/registration.component';
import { Router, RouterModule } from '@angular/router';
import { CookieManager } from '@app/core/Utils/CookieManager.util';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    FormsModule,
    LoginComponent,
    RegistrationComponent,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private static readonly themeStorageKey = 'playframe-theme';
  isLoggedIn = false;
  displayLoginDialog = false;
  displayRegisterDialog = false;
  errorMessage = '';
  isDarkMode = false;
  searchTerm = '';

  constructor(
    private authService: AuthService,
    private cookie: CookieManager,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  searchVideos(): void {
    const query = this.searchTerm.trim();
    void this.router.navigate(['/'], {
      queryParams: query ? { q: query } : {},
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (!isPlatformBrowser(this.platformId)) return;

    this.isDarkMode = localStorage.getItem(HeaderComponent.themeStorageKey) === 'dark';
    document.documentElement.classList.toggle('app-dark', this.isDarkMode);
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (!isPlatformBrowser(this.platformId)) return;

    document.documentElement.classList.toggle('app-dark', this.isDarkMode);
    localStorage.setItem(
      HeaderComponent.themeStorageKey,
      this.isDarkMode ? 'dark' : 'light'
    );
  }

  register(): void {
    this.displayRegisterDialog = true;
  }

  resetLoginRegisterVisible($event: boolean): void {
    this.isLoggedIn = $event;
    this.displayLoginDialog = false;
    this.displayRegisterDialog = false;
    this.errorMessage = '';
  }

  login(): void {
    this.displayLoginDialog = true;
  }

  logout(): void {
    this.errorMessage = '';
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedIn = false;
        this.displayLoginDialog = false;
        this.displayRegisterDialog = false;
        localStorage.removeItem('token');
        this.cookie.deleteCookie('jwt');
        void this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        this.errorMessage = err?.message || 'Sign out failed. Please try again.';
      },
    });
  }
}
