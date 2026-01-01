'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Settings,
  Target,
} from 'lucide-react';
import { useLanguage } from '@/context/language-provider';

export function MainNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      href: '/dashboard',
      label: t('main_nav.dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: '/transactions',
      label: t('main_nav.transactions'),
      icon: ArrowLeftRight,
    },
    {
      href: '/budgets',
      label: t('main_nav.budgets'),
      icon: PiggyBank,
    },
    {
      href: '/reports',
      label: t('main_nav.reports'),
      icon: BarChart3,
    },
    {
      href: '/goals',
      label: t('main_nav.goals'),
      icon: Target,
    },
    {
      href: '/settings',
      label: t('main_nav.settings'),
      icon: Settings,
    },
  ];

  return (
    <nav className="p-2">
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              size="sm"
              isActive={pathname.startsWith(item.href)}
              className="w-full"
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
