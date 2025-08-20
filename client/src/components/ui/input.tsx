import * as React from 'react';

import { cn } from '@/lib/utils';

type InputProps = React.ComponentProps<'input'> & {
  error?: string | boolean; // Para indicar erro (string para mensagem, boolean para estado)
  icon?: React.ReactNode; // Propriedade para o ícone
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, error, icon, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && <span className="text-muted-foreground absolute top-1/2 left-2 -translate-y-1/2 transform">{icon}</span>}
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          icon ? 'pl-8' : '',
          error
            ? 'border-red-500 focus-visible:ring-red-500 focus-visible:ring-offset-red-400 dark:border-red-400'
            : 'border-input hover:border-gray-300',
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';

export { Input };
