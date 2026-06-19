import { cn } from '@/lib/utils';

interface BigSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export default function BigSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: BigSwitchProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-6',
        'p-6 rounded-2xl bg-amber-50',
        'border-2 border-amber-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="flex-1">
        {label && <p className="text-2xl font-bold text-amber-900 mb-2">{label}</p>}
        {description && <p className="text-xl text-amber-700">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative w-20 h-12 rounded-full transition-colors duration-300',
          'focus:outline-none focus:ring-4 focus:ring-orange-300',
          checked ? 'bg-orange-500' : 'bg-amber-300',
          disabled && 'cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'absolute top-1 w-10 h-10 rounded-full bg-white shadow-lg',
            'transition-transform duration-300',
            checked ? 'translate-x-9' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  );
}
