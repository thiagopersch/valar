import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private readonly errorMessages: { [key: string]: (args?: any) => string } = {
    minlength: (args: { requiredLength: number }) =>
      `Mínimo de ${args.requiredLength} caracteres inválidos.`,
    maxlength: (args: { requiredLength: number }) =>
      `Máximo de ${args.requiredLength} caracteres inválidos.`,
    min: (args: { min: number }) => `O valor mínimo é ${args.min}.`,
    max: (args: { max: number }) => `O valor máximo é ${args.max}.`,
    required: () => 'Este campo é obrigatório.',
    email: () => 'Informe um e-mail válido.',
    pattern: () => 'Formato inválido.',
    nullValidator: () => 'Valor nulo não permitido.',
    passwordMismatch: () => 'As senhas não coincidem.',
    cpfInvalid: () => 'CPF inválido.',
    cnpjInvalid: () => 'CNPJ inválido.',
    phoneInvalid: () => 'Telefone inválido.',
    dateInvalid: () => 'Data inválida.',
    futureDate: () => 'A data deve ser futura.',
    pastDate: () => 'A data deve ser passada.',
    urlInvalid: () => 'URL inválida.',
  };

  /**
   * Obtém a primeira mensagem de erro para o conjunto de erros fornecido.
   * @param errors Objeto de erros do formulário.
   * @returns Mensagem de erro amigável em Português.
   */
  getErrorMessage(errors: ValidationErrors | null): string {
    if (!errors) {
      return '';
    }

    const firstKey = Object.keys(errors)[0];
    const messageGetter = this.errorMessages[firstKey];

    if (messageGetter) {
      return messageGetter(errors[firstKey]);
    }

    // Default message for unknown errors
    return 'Campo inválido.';
  }
}
