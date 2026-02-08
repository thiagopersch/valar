import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, NgZone, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'app/model/User';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  status: boolean;
  token: string;
  user: User;
  permissions: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}
  private apiUrl = environment.apiUrl;

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);
  private zone = inject(NgZone);

  get isLoggedIn() {
    return this.isLoggedIn$;
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => {
        if (response.status && response.token) {
          this.storeAuthData(response.token, response.user, response.permissions);
        }
      }),
    );
  }

  private storeAuthData(token: string, user: User, permissions: string[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('permissions', JSON.stringify(permissions));

      this.isLoggedInSubject.next(true);
      this.userSubject.next(user);
    }
  }
}
