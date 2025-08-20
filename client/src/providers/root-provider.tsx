'use client';

import ContentAuth from '@/components/ContentAuth';

import { ReactQueryProvider } from './react-query';
import NextAuthSessionProvider from './session-provider';
import { ThemeProvider } from './theme-provider';

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextAuthSessionProvider>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ContentAuth>{children}</ContentAuth>
        </ThemeProvider>
      </ReactQueryProvider>
    </NextAuthSessionProvider>
  );
}
