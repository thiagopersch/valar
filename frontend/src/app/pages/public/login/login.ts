import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Card } from 'app/components/card/card';
import { AuthService } from 'app/services/auth/auth-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressBarModule,
    Card,
    MatIconModule,
  ],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  hidePassword = signal(true);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['administrador@gmail.com', [Validators.required, Validators.email]],
      password: [
        '@mpresaPC10',
        [Validators.required, Validators.minLength(8), Validators.maxLength(30)],
      ],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        if (response.status) {
          this.router.navigateByUrl('/admin/home');
        } else {
          this.errorMessage.set('Credenciais inválidas. Tente novamente.');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.errorMessage.set(
          err.error?.message || 'Erro ao conectar com o servidor. Verifique sua conexão.',
        );
        this.isLoading.set(false);
      },
    });
  }
}
