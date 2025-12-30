import { PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <PiggyBank className="h-6 w-6 text-accent" />
      <span className="font-headline text-lg font-semibold text-foreground">Fiscal Flow</span>
    </div>
  );
}
