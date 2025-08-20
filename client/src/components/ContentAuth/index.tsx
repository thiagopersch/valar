import { useSession } from 'next-auth/react';

const ContentAuth = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  return <>{session?.user && children}</>;
};

export default ContentAuth;
