'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { menuItems } from './routes';

export function AppSidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();

  const imgLogo = (): string => {
    if (theme === 'system') {
      const isDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches;
      return isDarkMode ? '/logo-white.png' : '/logo-black.png';
    }
    return theme === 'dark' ? '/logo-white.png' : '/logo-black.png';
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col items-center justify-center">
          <Image
            src={imgLogo()}
            quality={100}
            width={200}
            height={200}
            sizes="(max-width: 768px) 100dvw, 33dvw"
            priority
            alt="Logo"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible defaultOpen={false}>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton isActive={pathname === item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url!}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
