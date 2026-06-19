import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'normal' | 'large' | 'xlarge';
  icon?: ReactNode;
  fullWidth?: boolean;
}

const BigButton = forwardRef<HTMLButtonElement, BigButtonProps>(
  ({ className, variant = 'primary', size = 'large', icon, fullWidth, children, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700 shadow-lg shadow-orange-500/30',
      secondary: 'bg-amber-100 text-amber-900 hover:bg-amber-200 active:bg-amber-300',
      danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
      success: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
    };

    const sizeClasses = {
      normal: 'px-8 py-4 text-xl min-h-[60px]',
      large: 'px-10 py-6 text-2xl min-h-[80px]',
      xlarge: 'px-12 py-8 text-3xl min-h-[100px]',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-2xl font-bold transition-all duration-200',
          'flex items-center justify-center gap-4',
          'active:scale-[0.98] touch-manipulation',
          'focus:outline-none focus:ring-4 focus:ring-orange-300',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

BigButton.displayName = 'BigButton';

export default BigButton;
