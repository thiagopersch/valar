import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ModalAction {
  label: string;
  action?: () => void;
  type?: 'button' | 'submit' | 'reset';
  style?: 'primary' | 'accent' | 'warn'; // Material colors
  variant?: 'basic' | 'raised' | 'stroked' | 'flat'; // Button variants
  disabled?: boolean;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
})
export class Modal implements OnInit {
  @Input() title: string = '';
  @Input() actions: ModalAction[] = [];
  @Input() loading: boolean = false;

  ngOnInit(): void {
    if (this.actions.length < 2) {
      console.warn('The Modal component requires at least 2 actions (e.g., Save/Cancel).');
    }
  }

  handleAction(action: ModalAction): void {
    if (action.action) {
      action.action();
    }
  }
}
