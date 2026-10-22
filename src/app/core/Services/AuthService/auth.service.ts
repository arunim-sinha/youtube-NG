import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '@app/core/Models/auth.models';
import { LocalStorageUtil } from '@app/core/Utils/LocalStorage.util';
import { CookieManager } from '@app/core/Utils/CookieManager.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, public storage: LocalStorageUtil,private cookie :CookieManager) {}

  isLoggedIn(): boolean {
    try {
      let token = this.storage.getToken();
      if (!token) {
        token = this.cookie.getCookie('jwt'); // Check cookie if localStorage is not available
        if (!token) {
          return false; // No token means not logged in
        }
      }
      // Optionally, you can add more checks like token expiration here
      return !this.storage.isTokenExpired(); // Check if the token is expired
    } catch (error) {
      console.error('Error checking if user is logged in:', error);
      return false; // Return false on error
    }
  }

  login(data: {
    userName: string;
    password: string;
  }): Observable<AuthResponse> {
    if (!data?.userName || !data?.password) {
      return throwError(() => new Error('Login data is missing or incomplete'));
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
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
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }
}
