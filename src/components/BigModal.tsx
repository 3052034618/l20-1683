import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BigModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export default function BigModal({
  isOpen,
  onClose,
  title,
  children,
  className,
  hideCloseButton = false,
}: BigModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-2xl',
          'bg-amber-50 rounded-3xl shadow-2xl',
          'border-4 border-amber-200',
          'max-h-[85vh] overflow-hidden',
          'flex flex-col',
          className
        )}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between px-8 py-6 border-b-2 border-amber-200">
            {title && <h2 className="text-3xl font-bold text-amber-900">{title}</h2>}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="p-3 rounded-xl bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
                aria-label="关闭"
              >
                <X size={32} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
