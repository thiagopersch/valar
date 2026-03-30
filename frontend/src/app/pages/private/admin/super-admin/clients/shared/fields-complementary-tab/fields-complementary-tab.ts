import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { System } from 'app/model/system';

@Component({
  selector: 'app-fields-complementary-tab',
  templateUrl: './fields-complementary-tab.html',
  styleUrl: './fields-complementary-tab.css',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule],
})
export class FieldsComplementaryTab {
  @Input({ required: true }) form!: FormGroup;
  @Input({ required: true }) systems!: System[];
}
