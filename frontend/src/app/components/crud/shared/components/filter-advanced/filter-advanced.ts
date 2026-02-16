import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

export interface FilterField {
  controlName: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'boolean' | 'range' | 'dateRange';
  options?: { label: string; value: any }[];
  initialValue?: any;
}

@Component({
  selector: 'app-filter-button-advanced',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
  ],
  templateUrl: './filter-advanced.html',
  standalone: true,
})
export class FilterButtonAdvancedComponent {
  fields = input<FilterField[]>([]);
  applyFilter = input<(event: Event) => void>(() => {});
  filterChange = output<any>();

  filterForm: FormGroup = new FormGroup({});

  private fb = inject(FormBuilder);

  constructor() {
    effect(() => {
      this.initForm(this.fields());
    });
  }

  initForm(fields: FilterField[]) {
    const group: any = {};
    fields.forEach((field) => {
      group[field.controlName] = new FormControl(field.initialValue || '');
    });
    this.filterForm = this.fb.group(group);

    this.filterForm.valueChanges.subscribe((value) => {
      this.filterChange.emit(value);
    });
  }
}
