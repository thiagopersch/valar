import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-color-picker-field',
  templateUrl: './color-picker-field.html',
  styleUrl: './color-picker-field.css',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerField),
      multi: true,
    },
  ],
})
export class ColorPickerField implements ControlValueAccessor {
  private cdr = inject(ChangeDetectorRef);

  @Input() label = 'Cor';
  @Input() description = '';
  @Input() defaultColor = '#000000';

  currentColor = this.defaultColor;
  showPicker = false;
  isDisabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.currentColor = value ?? this.defaultColor;
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  togglePicker(): void {
    if (!this.isDisabled) this.showPicker = !this.showPicker;
  }

  onColorInput(value: string): void {
    this.currentColor = value;
    this.onChange(value);
    this.onTouched();
  }
}
