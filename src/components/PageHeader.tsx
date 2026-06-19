import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightContent?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, showBack = true, rightContent, children, className }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        'sticky top-0 z-10 bg-amber-50/95 backdrop-blur-sm',
        'border-b-2 border-amber-200',
        'px-6 py-5',
        'flex items-center justify-between gap-4',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-3 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 active:bg-amber-300 transition-colors shrink-0"
            aria-label="返回"
          >
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>
        )}
        <h1 className="text-3xl font-bold text-amber-900">{title}</h1>
        {children}
      </div>
      {rightContent && <div className="shrink-0">{rightContent}</div>}
    </header>
  );
}
