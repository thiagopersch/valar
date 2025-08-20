import { ModeToggle } from '@/components/ModeToggleTheme';
import SigninForm from './_components/signInForm';

export default function LoginPage() {
  return (
    <>
      <ModeToggle className="absolute top-4 right-4" />
      <div className="min-h-screen flex items-center justify-center dark:bg-zinc-900">
        <div className="w-full max-w-lg">
          <SigninForm />
        </div>
      </div>
    </>
  );
}
