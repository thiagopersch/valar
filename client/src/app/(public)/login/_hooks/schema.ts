import { z } from 'zod';

export const schema = z.object({
  email: z
    .string()
    .email({ message: 'O email é obrigatório, portanto não pode ser vazio.' })
    .nonempty({
      message: 'O email é obrigatório, portanto não pode ser vazio.',
    })
    .min(1, { message: 'O campo espera no mínimo 1 caractere.' })
    .max(255, { message: 'Tamanho excedido (255).' }),
  password: z
    .string()
    .min(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
    .max(30, { message: 'A senha deve ter no máximo 30 caracteres.' })
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,30}$/,
      {
        message:
          'A sua senha deve conter letras maiúsculas, letras minúsculas, números e caracteres especiais (@,$,!,%,*,?,&).',
      },
    ),
});

export type Schema = z.infer<typeof schema>;
