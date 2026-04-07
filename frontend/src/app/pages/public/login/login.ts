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
import { ToastService } from 'app/components/toast/toast-service';
import { ErrorMessagePipe } from 'app/pipes/error-message';
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
    ErrorMessagePipe,
  ],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

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
        if (response.success) {
          this.router.navigateByUrl('/admin/home');
          this.toast.openSuccess(response.message);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toast.openError(
          err.error?.message || 'Erro ao conectar com o servidor. Verifique sua conexão.',
        );
        this.isLoading.set(false);
      },
    });
  }
}
