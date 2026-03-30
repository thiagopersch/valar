import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { ToastData } from 'app/model/Toast';
import { buttonStyleMap } from 'app/styles/styleMapComponents';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class Toast {
  data = inject(MAT_SNACK_BAR_DATA) as ToastData;
  snackBarRef = inject(MatSnackBarRef<Toast>);

  getButtonClass(): string {
    const base = ['rounded-lg!'];
    const style = this.data.style;

    if (style === 'success' || style === 'error' || style === 'warn') {
      base.push(`toast-btn-${style}`);
    } else if (style && style !== 'primary' && buttonStyleMap[style]) {
      const variant = this.data.variant ?? 'filled';

      const styleClass = buttonStyleMap[style][variant] ?? buttonStyleMap[style]['text'];
      base.push(styleClass);
    }

    return base.join(' ');
  }

  getContainerClass(): string {
    switch (this.data.style) {
      case 'success':
        return 'bg-emerald-600! text-white!';
      case 'error':
        return 'bg-red-600! text-white!';
      case 'warn':
        return 'bg-yellow-600! text-white!';
      default:
        return 'bg-surface! text-on-surface!';
    }
  }

  close() {
    this.snackBarRef.dismiss();
  }
}
