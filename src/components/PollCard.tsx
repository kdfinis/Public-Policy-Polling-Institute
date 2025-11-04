import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Poll {
  id: string;
  title: string;
  category: string;
  country: string;
  region?: string;
  yesPercent: number;
  noPercent: number;
  totalVotes: number;
  status: 'open' | 'closed';
}

interface PollCardProps {
  poll: Poll;
  variant?: 'featured' | 'compact';
  language?: 'en' | 'hr' | 'fr' | 'de';
}

export function PollCard({ poll, variant = 'compact', language = 'en' }: PollCardProps) {
  const isOpen = poll.status === 'open';
  
  if (variant === 'featured') {
    return (
      <Link
        to={`/poll/${poll.id}`}
        className="block bg-card border border-border/60 rounded-lg p-6 shadow-sm hover:shadow-md hover:border-border transition-all"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg line-clamp-2 mb-2">
              {poll.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="secondary" className="font-medium">
                {poll.category}
              </Badge>
              <span className="text-muted-foreground">
                {poll.country}
                {poll.region && ` • ${poll.region}`}
              </span>
            </div>
          </div>
          <Badge
            variant={isOpen ? 'default' : 'secondary'}
            className={cn('shrink-0', isOpen && 'bg-accent text-accent-foreground')}
          >
            {isOpen ? (language === 'en' ? 'Open' : 'Otvoreno') : (language === 'en' ? 'Closed' : 'Zatvoreno')}
          </Badge>
        </div>
        
        <div>
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-chart-yes">{language === 'en' ? 'Yes' : 'Da'} {poll.yesPercent}%</span>
            <span className="text-chart-no">{language === 'en' ? 'No' : 'Ne'} {poll.noPercent}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden flex">
            {(() => {
              const total = Math.max(1, poll.yesPercent + poll.noPercent);
              const yesW = (poll.yesPercent / total) * 100;
              const noW = 100 - yesW;
              return (
                <>
                  <div className="bg-chart-yes" style={{ width: `${yesW}%` }} />
                  <div className="bg-chart-no" style={{ width: `${noW}%` }} />
                </>
              );
            })()}
          </div>
          {/* total votes centered under bar */}
          <div className="mt-2 text-center text-xs text-muted-foreground">
            {poll.totalVotes.toLocaleString()} {language === 'en' ? 'votes' : 'glasova'}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/poll/${poll.id}`}
      className="flex items-center gap-3 p-3 bg-card border border-border/60 rounded-md hover:shadow-sm hover:bg-muted/40 transition-all"
    >
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-1 mb-1">
          {poll.title}
        </h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{poll.category}</span>
          <span>•</span>
          <span>{poll.totalVotes.toLocaleString()} {language === 'en' ? 'votes' : 'glasova'}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <div className="text-sm font-medium text-chart-yes">{poll.yesPercent}%</div>
          <div className="text-xs text-muted-foreground">{language === 'en' ? 'Yes' : 'Da'}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-chart-no">{poll.noPercent}%</div>
          <div className="text-xs text-muted-foreground">{language === 'en' ? 'No' : 'Ne'}</div>
        </div>
      </div>
    </Link>
  );
}
