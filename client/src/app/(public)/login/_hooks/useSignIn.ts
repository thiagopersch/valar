import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { schema } from './schema';

type Schema = z.infer<typeof schema> & {
  showPassword?: boolean;
};

const extendedSchema = schema.extend({
  showPassword: z.boolean().optional(),
});

export default function useLogin() {
  const router = useRouter();

  const form = useForm<Schema>({
    criteriaMode: 'all',
    mode: 'all',
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      email: 'administrador@gmail.com',
      password: '@mpresaPC10',
      showPassword: false,
    },
  });

  const handleClickShowPassword = useCallback(() => {
    const currentValue = form.getValues('showPassword');
    form.setValue('showPassword', !currentValue);
  }, [form]);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<Schema> = useCallback(
    async (data: Schema) => {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (result?.error) {
          form.setError('root', {
            type: 'manual',
            message:
              result.error === 'CredentialsSignin'
                ? 'Credenciais inválidas'
                : result.error,
          });
        } else {
          router.push('/');
        }
      } catch (error: any) {
        console.error(error);
        form.setError('root', {
          type: 'manual',
          message: 'Erro ao realizar login. Tente novamente mais tarde.',
        });
      }
    },
    [router, form],
  );

  const errorMessage = form.formState.errors.root?.message || '';

  const showPassword = form.watch('showPassword');

  return {
    handleClickShowPassword,
    handleMouseDownPassword,
    onSubmit,
    form,
    showPassword,
    errorMessage,
  };
}
