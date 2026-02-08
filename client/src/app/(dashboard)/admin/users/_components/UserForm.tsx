'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Column from '@/components/ui/columns';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect } from 'react';
import useUsers from '../_hook/useUsers';

type UserFormProps = {
  user?: User | null;
};

export default function UserForm({ user }: UserFormProps) {
  const {
    showPassword,
    isSubmitting,
    form,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleSubmit,
    setIsModalOpen,
  } = useUsers();

  useEffect(() => {
    if (user) {
      form.reset(user);
    } else {
      form.reset({
        name: '',
        email: '',
        password: '',
        change_password: true,
        status: true,
        enable_password: true,
      });
    }
  }, [user, form.reset]);

  const enable_password = form.watch('enable_password');

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Column cols={2}>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
                <FormLabel className="cursor-pointer text-sm font-medium">
                  {field.value ? 'Ativado' : 'Desativado'}
                </FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="change_password"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                </FormControl>
                <FormLabel className="cursor-pointer text-sm font-medium">Alterar senha no próximo login?</FormLabel>
              </FormItem>
            )}
          />
        </Column>

        <Column cols={1}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Column>
        <Column cols={2}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!enable_password && (
            <FormField
              control={form.control}
              name="enable_password"
              render={({ field }) => (
                <FormItem>
                  {user && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => form.setValue('enable_password', !field.value)}
                      disabled={isSubmitting}
                    >
                      Alterar senha
                    </Button>
                  )}
                </FormItem>
              )}
            />
          )}
          {enable_password && (
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        disabled={isSubmitting}
                        error={fieldState.error?.message}
                        placeholder="••••••••"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label="toggle password visibility"
                        disabled={isSubmitting}
                      >
                        {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </Column>

        <Separator />

        <div className="flex flex-row items-center justify-end gap-4 max-md:flex-col-reverse">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsModalOpen(false)}
            disabled={isSubmitting}
            className="max-md:w-full"
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="max-md:w-full">
            {isSubmitting ? (user ? 'Atualizando...' : 'Cadastrando...') : user ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
