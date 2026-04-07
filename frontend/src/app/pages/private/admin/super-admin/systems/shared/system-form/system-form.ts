import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Column } from 'app/components/column/column';
import { LoadingSavingChanges } from 'app/components/loading-saving-changes/loading-saving-changes';
import { MESSAGES } from 'app/components/toast/messages';
import { ToastService } from 'app/components/toast/toast-service';
import { System } from 'app/model/system';
import { ErrorMessagePipe } from 'app/pipes/error-message';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-system-form',
  templateUrl: './system-form.html',
  styleUrl: './system-form.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Column,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    ErrorMessagePipe,
    LoadingSavingChanges,
  ],
})
export class SystemForm {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  dialogRef = inject<MatDialogRef<SystemForm>>(MatDialogRef, { optional: true });
  data = inject<{ system: System; submitSubject?: Subject<void> }>(MAT_DIALOG_DATA, {
    optional: true,
  });
  private submitSub?: Subscription;

  form: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);

  constructor() {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      fantasy_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.minLength(3), Validators.maxLength(255)]],
      status: [true],
    });

    if (this.data?.submitSubject) {
      this.submitSub = this.data?.submitSubject.subscribe(() => this.save());
    }
  }

  ngOnInit() {
    if (this.data && this.data.system) {
      this.isEditMode.set(true);
      this.form.patchValue(this.data.system);
      this.form.get('code')?.disable();
    }
  }

  save(): void {
    if (this.form.valid) {
      this.loading.set(true);
      setTimeout(() => {
        this.dialogRef?.close(this.form.getRawValue());
      }, 800);
    } else {
      this.form.markAllAsTouched();
      this.toastService.openWarning(MESSAGES.WARNING);
    }
  }

  cancel() {
    this.dialogRef?.close();
  }
}
