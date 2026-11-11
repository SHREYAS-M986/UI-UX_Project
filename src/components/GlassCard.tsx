import React from 'react';
import { cn } from '@/lib/utils';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'subtle' | 'elevated';
  interactive?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, variant = 'default', interactive = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-[22px] transition-all duration-300',
          variant === 'default' && 'glass-panel',
          variant === 'dark' && 'glass-sidebar text-mist',
          variant === 'subtle' && 'bg-mist-100/40 backdrop-blur-md border border-white/40',
          variant === 'elevated' && 'glass-panel shadow-2xl',
          interactive && 'hover:bg-mist-300/60 hover:-translate-y-0.5 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

