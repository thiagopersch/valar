import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  openSuccess(message: string, duration: number = 5000) {
    this.snackBar.openFromComponent(Toast, {
      duration,
      data: { message, icon: 'done', action: 'Fechar', style: 'success', variant: 'outlined' },
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  openError(message: string, duration: number = 5000) {
    this.snackBar.openFromComponent(Toast, {
      duration,
      data: { message, icon: 'error', action: 'Fechar', style: 'error', variant: 'outlined' },
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }

  openWarning(message: string, duration: number = 5000) {
    this.snackBar.openFromComponent(Toast, {
      duration,
      data: { message, icon: 'warning', action: 'Fechar', style: 'warn', variant: 'outlined' },
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
    });
  }
}
