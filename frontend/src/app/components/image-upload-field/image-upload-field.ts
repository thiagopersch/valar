import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ModalAction } from 'app/model/Modal';
import { buttonStyleMap } from 'app/styles/styleMapComponents';

export interface ImageUploadConfig {
  inputId: string;
  label: string;
  accept: string;
  hints: string[];
  maxBytes?: number;
  previewClass?: string;
  objectFit?: 'contain' | 'cover';
}

@Component({
  selector: 'app-image-upload-field',
  templateUrl: './image-upload-field.html',
  styleUrl: './image-upload-field.css',
  imports: [CommonModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadField),
      multi: true,
    },
  ],
})
export class ImageUploadField implements ControlValueAccessor, OnInit {
  private cdr = inject(ChangeDetectorRef);

  @Input({ required: true }) config!: ImageUploadConfig;
  @Input() initialPreview: string | null = null;

  preview: string | ArrayBuffer | null = null;
  isDisabled = false;

  private onChange: (value: File | 'REMOVE' | null) => void = () => {};
  private onTouched: () => void = () => {};

  get maxBytes(): number {
    return this.config.maxBytes ?? 5 * 1024 * 1024;
  }

  ngOnInit(): void {
    if (this.initialPreview) {
      this.preview = this.initialPreview;
    }
  }

  getButtonClass(action: ModalAction): string {
    const base = ['rounded-lg!', 'max-md:w-full!'];
    const style = action.style;

    if (style && style !== 'primary' && buttonStyleMap[style]) {
      const variant = action.variant ?? 'basic';
      const styleClass = buttonStyleMap[style][variant] ?? buttonStyleMap[style]['basic'];
      base.push(styleClass);
    }

    return base.join(' ');
  }

  writeValue(value: File | string | null): void {
    if (!value && !this.initialPreview) {
      this.preview = null;
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: (value: File | 'REMOVE' | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdr.markForCheck();
  }

  triggerInput(): void {
    document.getElementById(this.config.inputId)?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > this.maxBytes) {
      alert(`Arquivo muito grande! Máximo ${this.maxBytes / (1024 * 1024)} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result;
      this.onChange(file);
      this.onTouched();
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  removeFile(): void {
    this.preview = null;
    this.onChange('REMOVE');
    this.onTouched();

    const input = document.getElementById(this.config.inputId) as HTMLInputElement | null;
    if (input) input.value = '';

    this.cdr.markForCheck();
  }
}
