import { cn } from '@homebase/ui/src/lib/utils';

interface TaskCardProps {
  title: string;
  subtitle?: string;
  count?: number;
  status?: 'pending' | 'in-progress' | 'completed' | 'urgent';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const statusStyles = {
  pending: 'border-l-yellow-500 bg-yellow-50',
  'in-progress': 'border-l-blue-500 bg-blue-50',
  completed: 'border-l-green-500 bg-green-50',
  urgent: 'border-l-red-500 bg-red-50',
};

export function TaskCard({
  title,
  subtitle,
  count,
  status,
  icon,
  onClick,
  className,
  children,
}: TaskCardProps) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-4 rounded-xl border-l-4 bg-white p-5 text-left shadow-sm transition-shadow',
        status ? statusStyles[status] : 'border-l-gray-300',
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.99]',
        className,
      )}
    >
      {icon && <div className="flex-shrink-0">{icon}</div>}
      <div className="flex-1">
        <p className="text-lg font-semibold text-gray-900">{title}</p>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        {children}
      </div>
      {count !== undefined && (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          {count}
        </span>
      )}
    </Wrapper>
  );
}
