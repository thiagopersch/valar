'use client';

import { useAuthStore } from '@/stores/authStore';
import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

type NextAuthSessionProviderProps = {
  children: ReactNode;
};

export default function NextAuthSessionProvider({
  children,
}: NextAuthSessionProviderProps) {
  const { data: session, status } = useSession();
  const { setUser, clearUser } = useAuthStore();
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        ...session.user,
      });
    } else if (status === 'unauthenticated') {
      clearUser();
    }
  }, [session, status, setUser, clearUser]);

  return <SessionProvider>{children}</SessionProvider>;
}
