import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ColorPickerField } from 'app/components/color-picker-field/color-picker-field';
import {
  ImageUploadConfig,
  ImageUploadField,
} from 'app/components/image-upload-field/image-upload-field';

@Component({
  selector: 'app-visual-identity-tab',
  templateUrl: './visual-identity-tab.html',
  styleUrl: './visual-identity-tab.css',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDividerModule,
    ImageUploadField,
    ColorPickerField,
  ],
})
export class VisualIdentityTab {
  @Input({ required: true }) form!: FormGroup;

  /** Pass pre-existing URLs so the upload fields show the stored previews */
  @Input() initialPreviews: Record<string, string | null> = {};

  readonly logoConfig: ImageUploadConfig = {
    inputId: 'logoInput',
    label: 'Logo institucional branca',
    accept: '.svg,.png,.webp,.jpg,.jpeg',
    maxBytes: 2 * 1024 * 1024,
    previewClass: 'w-56 h-16',
    objectFit: 'contain',
    hints: [
      'A dimensão recomendada é de 165 x 45 pixels',
      'Imagens com dimensões diferentes serão redimensionadas',
      'Formato WEBP, JPEG e PNG de no máximo 2MB',
    ],
  };

  readonly faviconConfig: ImageUploadConfig = {
    inputId: 'faviconInput',
    label: 'Favicon',
    accept: '.svg,.png,.webp',
    maxBytes: 2 * 1024 * 1024,
    previewClass: 'w-10 h-10',
    objectFit: 'contain',
    hints: [
      'A dimensão recomendada é de 32 x 32 pixels',
      'Imagens com dimensões diferentes serão redimensionadas',
      'Formato JPEG ou PNG de no máximo 2MB',
    ],
  };

  readonly backgroundConfig: ImageUploadConfig = {
    inputId: 'backgroundInput',
    label: 'Background',
    accept: '.svg,.png,.webp,.jpg,.jpeg',
    maxBytes: 5 * 1024 * 1024,
    previewClass: 'w-56 h-32',
    objectFit: 'cover',
    hints: [
      'A dimensão recomendada é de 1920 x 1080 pixels',
      'Imagens com dimensões diferentes serão redimensionadas',
      'Formato WEBP, JPEG ou PNG de no máximo 5MB',
    ],
  };

  readonly colorDescription =
    'A definição da cor institucional norteará a identidade visual do sistema entre ' +
    'títulos, botões e demais ícones de todas as páginas.';
}
