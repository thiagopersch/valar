import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

/**
 * Guarda que permite acesso apenas a usuários autenticados.
 * Se não estiver autenticado, redireciona para o login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Guarda que impede usuários autenticados de acessarem páginas públicas (ex: login).
 * Se já estiver autenticado, redireciona para a home.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigateByUrl('/admin/home');
  return false;
};
