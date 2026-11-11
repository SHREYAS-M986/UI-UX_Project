import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-green focus-visible:ring-offset-2',
          'active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
          
          // Variants
          variant === 'primary' && [
            'bg-forest text-mist shadow-glass-button',
            'hover:bg-[#1f3329] hover:shadow-lg',
            'border border-white/15',
          ],
          variant === 'secondary' && [
            'bg-mist-400 text-forest border border-white/70 shadow-sm',
            'hover:bg-mist-600',
          ],
          variant === 'glass' && [
            'glass-pill text-forest',
            'hover:bg-white/80',
          ],
          variant === 'ghost' && [
            'bg-transparent text-forest',
            'hover:bg-forest-100',
          ],

          // Sizes (touch target min 44px for accessibility on interactive triggers)
          size === 'sm' && 'min-h-[38px] px-3.5 py-1.5 text-xs rounded-full gap-1.5',
          size === 'md' && 'min-h-[44px] px-4 py-2 text-sm rounded-full gap-2',
          size === 'lg' && 'min-h-[48px] px-6 py-2.5 text-base rounded-full gap-2.5',
          size === 'icon' && 'w-11 h-11 p-0 rounded-full flex items-center justify-center',

          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

