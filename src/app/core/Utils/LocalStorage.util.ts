import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root', // This makes it available application-wide
})
export class LocalStorageUtil {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
    }
  }
  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
  }
  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const token = this.getToken();
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        return decodedToken;
      }
    }
    return null;
  }
  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiration = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiration;
  }
  getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }
  setItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }
  removeItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }
}
