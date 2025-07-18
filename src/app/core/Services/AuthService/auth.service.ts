import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '@app/core/Models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  isLoggedIn(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/userProfile`, { headers }).pipe(
      map(() => true),
      catchError(() => {
        return [false];
      })
    );
  }

  login(data: { userName: string; password: string }): Observable<AuthResponse> {
    if (!data?.userName || !data?.password) {
      return throwError(() => new Error('Login data is missing or incomplete'));
    }
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      map((res: any) => {
        localStorage.setItem('token', res.token);
        return res;
      }),
      catchError(error => {
        return throwError(() => new Error(error?.error?.message || 'Login failed'));
      })
    );
  }

  logout(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      map(res => {
        localStorage.removeItem('token');
        return res;
      }),
      catchError(error => {
        return throwError(() => new Error(error?.error?.message || 'Logout failed'));
      })
    );
  }

  register(data: { userName: string; email: string; password: string }): Observable<AuthResponse> {
    if (!data?.userName || !data?.email || !data?.password) {
      return throwError(() => new Error('Registration data is missing or incomplete'));
    }
    return this.http.post(`${this.apiUrl}/register`, data).pipe(
      map((res: any) => res),
      catchError(error => {
        return throwError(() => new Error(error?.error?.message || 'Registration failed'));
      })
    );
  }
}
