import { Component, inject } from '@angular/core';
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
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { Card } from 'app/components/card/card';

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
    Card,
  ],
})
export class Login {
  loginForm: FormGroup;
  router = inject(Router);

  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['administrador@gmail.com', [Validators.required, Validators.email]],
      password: [
        '#mpresaPC10',
        [Validators.required, Validators.minLength(8), Validators.maxLength(30)],
      ],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Login:', this.loginForm.value);
      this.router.navigateByUrl('/admin/home');
    }
  }
}
