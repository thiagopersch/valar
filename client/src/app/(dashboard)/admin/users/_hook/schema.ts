import z from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  change_password: z.boolean(),
  status: z.boolean(),
});

export type UserFormData = z.infer<typeof userSchema>;
