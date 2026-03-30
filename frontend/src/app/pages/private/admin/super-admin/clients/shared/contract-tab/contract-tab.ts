import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ErrorMessagePipe } from 'app/pipes/error-message';

@Component({
  selector: 'app-contract-tab',
  templateUrl: './contract-tab.html',
  styleUrl: './contract-tab.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ErrorMessagePipe,
  ],
})
export class ContractTab {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) levels!: { value: string; label: string }[];
  @Input({ required: true }) minDate!: Date;
  @Input({ required: true }) maxDate!: Date;
}
