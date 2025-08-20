import { ModeToggle } from '@/components/ModeToggleTheme';
import { AppSidebar } from '@/components/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import UserMenu from '@/components/UserMenu';
import RootProvider from '@/providers/root-provider';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import type React from 'react';
import { nextAuthOptions } from '../api/auth/[...nextauth]/route';

type PrivateLayoutProps = {
  children: React.ReactNode;
};

export default async function PrivateLayout({ children }: PrivateLayoutProps) {
  const session = await getServerSession(nextAuthOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <RootProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 items-center justify-between gap-2 border-b px-4">
            <div className="flex shrink-0 items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger className="-ml-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Tecle <strong>CTRL + B</strong>
                  </p>
                </TooltipContent>
              </Tooltip>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Início</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex items-center justify-center gap-4">
              <ModeToggle />
              <UserMenu />
            </div>
          </header>
          <div className="flex flex-col gap-4 overflow-hidden p-4 max-md:p-0">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </RootProvider>
  );
}
