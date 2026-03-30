import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Column } from 'app/components/column/column';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service-activity-form',
  templateUrl: './service-activity-form.html',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSlideToggleModule, Column],
})
export class ServiceActivityForm implements OnInit, OnDestroy {
  form: FormGroup;
  isEditMode = false;
  private submitSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      status: [true],
    });
  }

  ngOnInit() {
    if (this.data && this.data.serviceActivity) {
      this.isEditMode = true;
      this.form.patchValue(this.data.serviceActivity);
    }

    if (this.data?.submitSubject) {
      this.submitSub = this.data.submitSubject.subscribe(() => {
        this.save();
      });
    }
  }

  ngOnDestroy() {
    this.submitSub?.unsubscribe();
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
