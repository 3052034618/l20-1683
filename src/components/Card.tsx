import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({ children, className, onClick, hoverable = false }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border-2 border-amber-200',
        'shadow-md',
        hoverable && 'cursor-pointer hover:shadow-lg hover:border-orange-300 transition-all duration-200 active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  );
}
