import z from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value === undefined || value === '') return true; // Password is optional
        return value.length >= 6 && value.length <= 30;
      },
      { message: 'Senha deve ter entre 6 e 30 caracteres' },
    )
    .refine(
      (value) => {
        if (value === undefined || value === '') return true; // Password is optional
        return /[A-Z]/.test(value);
      },
      { message: 'Senha deve conter pelo menos uma letra maiúscula' },
    )
    .refine(
      (value) => {
        if (value === undefined || value === '') return true; // Password is optional
        return /[a-z]/.test(value);
      },
      { message: 'Senha deve conter pelo menos uma letra minúscula' },
    )
    .refine(
      (value) => {
        if (value === undefined || value === '') return true; // Password is optional
        return /[0-9]/.test(value);
      },
      { message: 'Senha deve conter pelo menos um número' },
    )
    .refine(
      (value) => {
        if (value === undefined || value === '') return true; // Password is optional
        return /[!@#$%^&*(),.?":{}|<>]/.test(value);
      },
      { message: 'Senha deve conter pelo menos um caractere especial' },
    ),
  change_password: z.boolean(),
  status: z.boolean(),
  enable_password: z.boolean(),
});

export type UserFormData = z.infer<typeof userSchema>;
