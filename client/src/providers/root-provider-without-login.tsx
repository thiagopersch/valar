'use client';

import Loading from '@/app/loading';
import { Toaster } from '@/components/ui/sonner';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useEffect, useState } from 'react';
import { ReactQueryProvider } from './react-query';

export default function RootProviderWithoutLogin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Loading />;
  }

  return (
    <SessionProvider>
      <ReactQueryProvider>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
          <Toaster position="bottom-center" duration={5000} />
        </NextThemesProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
