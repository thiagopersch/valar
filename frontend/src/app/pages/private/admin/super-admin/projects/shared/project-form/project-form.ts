import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Column } from 'app/components/column/column';
import { Client } from 'app/model/client';
import { Subscription } from 'rxjs';
import { ClientsService } from '../../../clients/clients-service';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    Column,
  ],
  providers: [],
})
export class ProjectForm implements OnInit, OnDestroy {
  form: FormGroup;
  isEditMode = false;
  private submitSub?: Subscription;

  clients: Client[] = [];
  private clientService = inject(ClientsService);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.form = this.fb.group({
      client_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      status: ['active', [Validators.required]],
      start_date: [''],
      end_date: [''],
    });
  }

  ngOnInit() {
    if (this.data && this.data.project) {
      this.isEditMode = true;
      this.form.patchValue(this.data.project);
    }

    if (this.data?.submitSubject) {
      this.submitSub = this.data.submitSubject.subscribe(() => {
        this.save();
      });
    }

    this.clientService.getClients(1, 100).subscribe((res) => {
      this.clients = res.data ?? [];
    });
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
