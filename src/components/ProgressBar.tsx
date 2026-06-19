import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  height?: 'normal' | 'large';
  color?: 'orange' | 'green' | 'red';
}

export default function ProgressBar({
  value,
  max,
  className,
  height = 'large',
  color = 'orange',
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const heightClasses = {
    normal: 'h-3',
    large: 'h-6',
  };

  const colorClasses = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div
      className={cn(
        'w-full rounded-full bg-amber-200 overflow-hidden',
        heightClasses[height],
        className
      )}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          colorClasses[color]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
