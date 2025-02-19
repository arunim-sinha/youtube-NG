import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  private apiUrl = environment.apiUrl;
  async login(data: { email: string; password: string }): Promise<any> {
    if (!data || !data.email || !data.password) {
      return Promise.reject(new Error('Login data is missing or incomplete'));
    }
    const res = await fetch(`${this.apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      return Promise.reject(new Error('Login failed'));
    }
    return await res.json();
  }

  async register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<any> {
    if (!data || !data.username || !data.email || !data.password) {
      return Promise.reject(
        new Error('Registration data is missing or incomplete')
      );
    }
    try {
      const res = await fetch(`${this.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        return Promise.reject(new Error('Registration failed'));
      }
      return await res.json();
    } catch (error) {
      return Promise.reject(new Error('Network error'));
    }
  }
  async logout(): Promise<any> {
    try {
      const res = await fetch(`${this.apiUrl}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res) {
        throw new Error('No response from logout endpoint');
      }

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      return await res.json();
    } catch (error) {
      return Promise.reject(
        error instanceof Error
          ? error
          : new Error('Unexpected error during logout')
      );
    }
  }
}
