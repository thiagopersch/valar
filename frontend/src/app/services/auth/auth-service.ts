import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/model/User';
import { environment } from 'environments/environment';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  status: boolean;
  token: string;
  user: User;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Estados com Signals
  private readonly _currentUser = signal<User | null>(this.getStoredUser());
  private readonly _token = signal<string | null>(this.getStoredToken());
  private readonly _permissions = signal<string[]>(this.getStoredPermissions());

  // Computeds e públicos
  readonly user = this._currentUser.asReadonly();
  readonly token = this._token.asReadonly();
  readonly permissions = this._permissions.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  constructor() {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => {
        if (response.status && response.token) {
          this.storeAuthData(response.token, response.user, response.permissions || []);
        }
      }),
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
    }
    this._token.set(null);
    this._currentUser.set(null);
    this._permissions.set([]);
    this.router.navigate(['/login']);
  }

  hasPermission(permission: string): boolean {
    return this._permissions().includes(permission);
  }

  private storeAuthData(token: string, user: User, permissions: string[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('permissions', JSON.stringify(permissions));
    }
    this._token.set(token);
    this._currentUser.set(user);
    this._permissions.set(permissions);
  }

  private getStoredUser(): User | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      if (user && user !== 'undefined' && user !== 'null') {
        try {
          return JSON.parse(user);
        } catch (e) {
          console.error('Error parsing stored user', e);
          return null;
        }
      }
    }
    return null;
  }

  private getStoredToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return token && token !== 'undefined' && token !== 'null' ? token : null;
    }
    return null;
  }

  private getStoredPermissions(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      const perms = localStorage.getItem('permissions');
      if (perms && perms !== 'undefined' && perms !== 'null') {
        try {
          return JSON.parse(perms);
        } catch (e) {
          console.error('Error parsing stored permissions', e);
          return [];
        }
      }
    }
    return [];
  }
}
