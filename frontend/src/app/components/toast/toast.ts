import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export interface ToastData {
  message: string;
  action: string;
  icon: string;
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  imports: [MatIconModule, MatButtonModule],
})
export class Toast {
  data = inject(MAT_SNACK_BAR_DATA) as ToastData;
  snackBarRef = inject(MatSnackBarRef<Toast>);
  close() {
    this.snackBarRef.dismiss();
  }
}
