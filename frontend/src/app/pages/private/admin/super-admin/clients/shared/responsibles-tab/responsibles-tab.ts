import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Column } from 'app/components/column/column';
import { User } from 'app/model/user';
import { ErrorMessagePipe } from 'app/pipes/error-message';

@Component({
  selector: 'app-responsibles-tab',
  templateUrl: './responsibles-tab.html',
  styleUrl: './responsibles-tab.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    Column,
    ErrorMessagePipe,
  ],
})
export class ResponsiblesTab {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) users!: User[];
  @Input({ required: true }) analystTypes!: { value: string; label: string }[];
}
