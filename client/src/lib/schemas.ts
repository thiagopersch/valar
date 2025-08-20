import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  address: z.object({
    street: z.string().min(1, 'Endereço é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
    zipCode: z.string().min(8, 'CEP inválido'),
  }),
});

export const courseSchema = z.object({
  name: z.string().min(2, 'Nome do curso é obrigatório'),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  duration: z.number().min(1, 'Duração é obrigatória'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  category: z.string().min(1, 'Categoria é obrigatória'),
});

export const financialSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Categoria é obrigatória'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  status: z.enum(['pending', 'paid', 'overdue']),
});
