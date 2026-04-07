import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ColorPickerField } from 'app/components/color-picker-field/color-picker-field';
import { Column } from 'app/components/column/column';
import { LoadingSavingChanges } from 'app/components/loading-saving-changes/loading-saving-changes';
import { MESSAGES } from 'app/components/toast/messages';
import { ToastService } from 'app/components/toast/toast-service';
import { TransactionCategory, TransactionCategoryType } from 'app/model/TransactionCategory';
import { ErrorMessagePipe } from 'app/pipes/error-message';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-transaction-category-form',
  templateUrl: './transaction-category-form.html',
  styleUrl: './transaction-category-form.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    Column,
    ErrorMessagePipe,
    MatSelectModule,
    ColorPickerField,
    MatTabsModule,
    LoadingSavingChanges,
  ],
})
export class TransactionCategoryForm implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private dialogRef = inject<MatDialogRef<TransactionCategoryForm>>(MatDialogRef, {
    optional: true,
  });
  private data = inject<{
    transactionCategory: TransactionCategory;
    submitSubject?: Subject<void>;
  }>(MAT_DIALOG_DATA, { optional: true });
  private submitSub?: Subscription;

  readonly TRANSACTION_CATEGORY_TYPES = [
    { value: TransactionCategoryType.INCOME, label: 'Receita' },
    { value: TransactionCategoryType.EXPENSE, label: 'Despesa' },
  ];

  form: FormGroup;
  isEditMode = signal(false);
  loading = signal(false);

  constructor() {
    const transactionCategory = this.data?.transactionCategory;

    this.form = this.fb.group({
      name: [
        transactionCategory?.name ?? '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)],
      ],
      description: [
        transactionCategory?.description ?? '',
        [Validators.minLength(3), Validators.maxLength(100)],
      ],
      type: [transactionCategory?.type ?? '', [Validators.required]],
      color: [
        transactionCategory?.color ?? '',
        [Validators.required, Validators.pattern(/^#[0-9A-F]{6}$/i)],
      ],
      icon: [
        transactionCategory?.icon ?? '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9-_]+$/),
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      status: [transactionCategory?.status ?? true],
    });
  }

  ngOnInit() {
    if (this.data && this.data?.transactionCategory) {
      this.isEditMode.set(true);
      this.form.patchValue(this.data.transactionCategory);
    }

    if (this.data?.submitSubject) {
      this.submitSub = this.data?.submitSubject.subscribe(() => this.save());
    }
  }

  ngOnDestroy(): void {
    this.submitSub?.unsubscribe();
  }

  save(): void {
    if (this.form.valid) {
      this.loading.set(true);
      this.dialogRef?.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
      this.toastService.openWarning(MESSAGES.WARNING);
    }
  }
}
