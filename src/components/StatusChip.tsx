import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export type StatusType = 'open' | 'closed' | 'flagged';

interface StatusChipProps {
  status: StatusType;
  language?: 'en' | 'hr';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<StatusType, {
  label: { en: string; hr: string };
  icon: typeof CheckCircle2;
  className: string;
}> = {
  open: {
    label: { en: 'Open', hr: 'Otvoreno' },
    icon: CheckCircle2,
    className: 'bg-status-open/10 text-status-open border-status-open/20',
  },
  closed: {
    label: { en: 'Closed', hr: 'Zatvoreno' },
    icon: XCircle,
    className: 'bg-status-closed/10 text-status-closed border-status-closed/20',
  },
  flagged: {
    label: { en: 'Flagged', hr: 'Označeno' },
    icon: AlertTriangle,
    className: 'bg-status-flagged/10 text-status-flagged border-status-flagged/20',
  },
};

export function StatusChip({
  status,
  language = 'en',
  showIcon = true,
  className,
}: StatusChipProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn('font-medium', config.className, className)}
    >
      {showIcon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
      {config.label[language]}
    </Badge>
  );
}
