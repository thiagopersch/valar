import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet, CommonModule],
})
export class App {
  constructor() {}
  protected readonly title = signal('valar');
  isLoggedIn$!: boolean;
  private authService = inject(AuthService);

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isAuthenticated();
  }
}
