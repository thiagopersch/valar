import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Column } from 'app/components/column/column';
import { ErrorMessagePipe } from 'app/pipes/error-message';
import { NgxMaskDirective } from 'ngx-mask';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-identification-tab',
  templateUrl: './identification-tab.html',
  styleUrl: './identification-tab.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    Column,
    ErrorMessagePipe,
    NgxMaskDirective,
  ],
})
export class IdentificationTab {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) implementationTypes!: SelectOption[];
}
