import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ErrorMessagePipe } from 'app/pipes/error-message';

@Component({
  selector: 'app-health-tab',
  templateUrl: './health-tab.html',
  styleUrl: './health-tab.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    ErrorMessagePipe,
  ],
})
export class HealthTab {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) healthScores!: { value: string; label: string }[];
  @Input({ required: true }) levels!: { value: string; label: string }[];
  @Input({ required: true }) demandLevels!: { value: string; label: string }[];
  @Input({ required: true }) priorityLevels!: { value: string; label: string }[];
}
