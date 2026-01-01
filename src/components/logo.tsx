import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2 text-foreground', className)}>
      <svg
        viewBox="0 0 200 50"
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-auto"
        fill="currentColor"
      >
        <g transform="translate(0, 5)">
            <g transform="rotate(-10 25 25) translate(0, -5)">
                <path d="M5 20 Q 15 10, 25 20 T 45 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <rect x="10" y="15" width="35" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
                <text x="21" y="29" textAnchor="middle" fontSize="12" fontWeight="bold" fill="currentColor">$</text>
            </g>
        </g>
        <text
          x="55"
          y="30"
          fontFamily="Inter, sans-serif"
          fontSize="24"
          fontWeight="bold"
          fill="currentColor"
        >
          FiscalFlow
        </text>
      </svg>
    </div>
  );
}
