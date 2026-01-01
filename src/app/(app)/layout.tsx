
'use client';

import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BottomNav } from '@/components/bottom-nav';
import { useIsMobile } from '@/hooks/use-mobile';
import { DashboardSkeleton } from './dashboard/components/dashboard-skeleton';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const hasUserName = localStorage.getItem('userName');
    if (!hasUserName) {
      router.push('/auth');
      return;
    }
    // Simulate a brief loading period to allow data to populate and show skeleton
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 500); 
    
    return () => clearTimeout(timer);

  }, [router, pathname]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }


  return (
    <SidebarProvider>
      {!isMobile && (
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex h-14 items-center p-4">
              <Logo />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
      )}

      <SidebarInset>
        <div className="flex flex-col h-screen">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 flex-shrink-0">
            <div className="flex items-center">
              <SidebarTrigger className="md:hidden" />
            </div>
            <div className="flex items-center gap-4">
              <UserNav />
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
          <div className="flex-shrink-0">
            <footer className="p-4 text-center text-sm text-muted-foreground">
              Made by Harsh Bansal
            </footer>
            {isMobile && <BottomNav />}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
