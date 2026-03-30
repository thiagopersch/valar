import { Injectable, Pipe, PipeTransform, inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ValidationService } from '../services/validation';

@Injectable({
  providedIn: 'root',
})
@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe implements PipeTransform {
  private readonly validationService = inject(ValidationService);

  transform(errors: ValidationErrors | null | undefined): string {
    if (!errors) {
      return '';
    }
    return this.validationService.getErrorMessage(errors);
  }
}
