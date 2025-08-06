import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '@app/core/Models/auth.models';
import { LocalStorageUtil } from '@app/core/Utils/LocalStorage.util';
import { CookieManager } from '@app/core/Utils/CookieManager.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, public storage: LocalStorageUtil,private cookie :CookieManager) {}

  isLoggedIn(): boolean {
    let token = this.storage.getToken();
    if (!token) {
      token = this.cookie.getCookie('jwt'); // Check cookie if localStorage is not available
      if (!token) {
        return false; // No token means not logged in
      }
    }
    // Optionally, you can add more checks like token expiration here
    return !this.storage.isTokenExpired(); // Check if the token is expired
  }

  login(data: {
    userName: string;
    password: string;
  }): Observable<AuthResponse> {
    if (!data?.userName || !data?.password) {
      return throwError(() => new Error('Login data is missing or incomplete'));
    }
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      map((res: any) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        return res;
      }),
      catchError((error) => {
        if (error?.status >= 500) {
          console.error('Login error:', error);
          // Handle server errors
          return throwError(
            () =>
              new Error(error?.error?.message || 'Server error, login failed')
          );
        } else if (error?.status >= 400 && error?.status < 500) {
          console.log('Client error:', error);
          // Handle client errors: return default AuthResponse
          const defaultAuthResponse: AuthResponse = {
            token: '', // No token on error
            success: false, // indicate login failure
            message: error?.error?.message || 'Invalid credentials or request', // optional
            // Add more fields as per your AuthResponse interface
          };
          return of(defaultAuthResponse);
        } else {
          // Handle network errors or unexpected errors
          return throwError(
            () => new Error('An unexpected error occurred. Please try again.')
          );
        }
      })
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map((res) => {
        localStorage.removeItem('token');
        return res;
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        return throwError(
          () => new Error(error?.error?.message || 'Logout failed')
        );
      })
    );
  }

  register(data: {
    userName: string;
    email: string;
    password: string;
  }): Observable<AuthResponse> {
    if (!data?.userName || !data?.email || !data?.password) {
      return throwError(
        () => new Error('Registration data is missing or incomplete')
      );
    }
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      map((res: any) => {
        return res;
      }),
      catchError((error) => {
        if (error?.status >= 500) {
          // Handle server errors
          return throwError(
            () =>
              new Error(
                error?.error?.message || 'Server error, registration failed'
              )
          );
        } else if (error?.status >= 400 && error?.status < 500) {
          console.error(error);
          // Handle client errors: return default AuthResponse
          const defaultAuthResponse: AuthResponse = {
            token: '', // No token on error
            success: false, // indicate registration failure
            message: error?.error?.message || 'Invalid registration data', // optional
          };
          return of(defaultAuthResponse);
        } else {
          return throwError(
            () => new Error(error?.error?.message || 'Registration failed')
          );
        }
      })
    );
  }
}
