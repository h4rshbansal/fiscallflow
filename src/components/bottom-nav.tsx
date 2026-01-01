"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PiggyBank,
  BarChart3,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/context/language-provider";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    {
      href: "/dashboard",
      label: t('main_nav.dashboard'),
      icon: LayoutDashboard,
    },
    {
      href: "/transactions",
      label: t('main_nav.transactions'),
      icon: ArrowLeftRight,
    },
    {
      href: "/budgets",
      label: t('main_nav.budgets'),
      icon: PiggyBank,
    },
    {
      href: "/reports",
      label: t('main_nav.reports'),
      icon: BarChart3,
    },
    {
      href: "/settings",
      label: t('main_nav.settings'),
      icon: Settings,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
           const isActive = pathname.startsWith(item.href);
           return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
