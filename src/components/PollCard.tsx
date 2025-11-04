import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface Poll {
  id: string;
  title: string;
  description?: string;
  category: string;
  country: string;
  region?: string;
  yesPercent: number;
  noPercent: number;
  totalVotes: number;
  status: 'open' | 'closed';
  articleUrl?: string;
  imageUrl?: string;
}

interface PollCardProps {
  poll: Poll;
  variant?: 'featured' | 'compact';
  language?: 'en' | 'hr' | 'fr' | 'de';
}

export function PollCard({ poll, variant = 'compact', language = 'en' }: PollCardProps) {
  const isOpen = poll.status === 'open';
  
  if (variant === 'featured') {
    const total = Math.max(1, poll.yesPercent + poll.noPercent);
    const yesW = (poll.yesPercent / total) * 100;
    const noW = 100 - yesW;

    return (
      <div className="block bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all relative h-full flex flex-col">
        {/* Image in top right corner (1/4 corner) */}
        {poll.imageUrl && (
          <div className="absolute top-0 right-0 w-[25%] h-[25%] overflow-hidden rounded-bl-lg z-10">
            <img
              src={poll.imageUrl}
              alt={poll.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6 h-full flex flex-col">
          <Link
            to={`/poll/${poll.id}`}
            className="block flex-1 flex flex-col"
          >
            {/* SECTION 1: Title and Information */}
            <div className={cn("flex-1 min-h-0 mb-4", poll.imageUrl && "pr-[28%]")}>
              <h3 className="font-bold text-xl leading-tight mb-3 line-clamp-2 text-foreground min-h-[3rem]">
                {poll.title}
              </h3>
              
              {/* Fixed height for badges - no wrapping that causes shifts */}
              <div className="flex items-center gap-2 mb-3 min-h-[1.75rem]">
                <Badge variant="secondary" className="font-medium text-xs shrink-0">
                  {poll.category}
                </Badge>
                <span className="text-sm text-muted-foreground shrink-0 whitespace-nowrap">
                  {poll.country}
                  {poll.region && ` • ${poll.region}`}
                </span>
                <Badge
                  variant={isOpen ? 'default' : 'secondary'}
                  className={cn('text-xs shrink-0', isOpen && 'bg-accent text-accent-foreground')}
                >
                  {isOpen ? (language === 'en' ? 'Open' : 'Otvoreno') : (language === 'en' ? 'Closed' : 'Zatvoreno')}
                </Badge>
              </div>
              
              {/* Description/Context - fixed height */}
              <div className="min-h-[4rem] max-h-[4rem] overflow-hidden">
                {poll.description ? (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {poll.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 opacity-0">
                    {/* Placeholder to maintain height */}
                    &nbsp;
                  </p>
                )}
              </div>
            </div>
            
            {/* SECTION 2: Bar */}
            <div className="space-y-2 mb-4 flex-shrink-0">
              {/* Percentages above the bar */}
              <div className="flex justify-between items-center text-base font-semibold">
                <span className="text-blue-600">{poll.yesPercent}% {language === 'en' ? 'In Favor' : 'Za'}</span>
                <span className="text-red-600">{poll.noPercent}% {language === 'en' ? 'Opposed' : 'Protiv'}</span>
              </div>
              
              {/* Full-width bar with rounded edges */}
              <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden flex shadow-inner">
                <div className="bg-blue-600 transition-all" style={{ width: `${yesW}%` }} />
                <div className="bg-red-600 transition-all" style={{ width: `${noW}%` }} />
              </div>
            </div>
            
            {/* SECTION 3: Content Below Bar */}
            <div className="flex items-center justify-between pt-1 flex-shrink-0 min-h-[1.5rem]">
              <div className="text-sm text-muted-foreground">
                {poll.totalVotes.toLocaleString()} {language === 'en' ? 'participants' : 'sudionika'}
              </div>
            </div>
          </Link>
          
          {/* Article link - outside Link to avoid nested anchors */}
          {poll.articleUrl && (
            <a
              href={poll.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary-hover transition-colors font-medium shrink-0 mt-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'Read article' : 'Pročitaj članak'}</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/poll/${poll.id}`}
      className="flex items-center gap-3 p-3 bg-card border-b border-border hover:bg-muted/50 transition-colors"
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
