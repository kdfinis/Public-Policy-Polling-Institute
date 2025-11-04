import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink } from 'lucide-react';
import type { Poll } from './PollCard';

interface HotPollProps {
  poll: Poll;
  language?: 'en' | 'hr' | 'fr' | 'de';
}

export function HotPoll({ poll, language = 'en' }: HotPollProps) {
  return (
    <div className="border-t-4 border-foreground/20 bg-card border border-border rounded-lg shadow-lg mb-8 overflow-hidden">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-12 bg-foreground/60"></div>
            <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              {language === 'en' ? 'Featured Poll' : 'Istaknuta anketa'}
            </span>
            <div className="h-1 w-12 bg-foreground/60"></div>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            {poll.totalVotes.toLocaleString()} {language === 'en' ? 'participants' : 'učesnika'}
          </Badge>
        </div>
        
        <div className="block group">
          <Link to={`/poll/${poll.id}`} className="block">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-primary/80 transition-colors">
              {poll.title}
            </h1>
            
            {/* Meta */}
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
              <span className="font-medium">{poll.category}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{poll.country}{poll.region && ` • ${poll.region}`}</span>
            </div>
            
            {/* Results */}
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-8">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-sm font-medium text-muted-foreground">
                    <span>{language === 'en' ? 'Yes' : 'Da'}</span>
                    <span>{language === 'en' ? 'No' : 'Ne'}</span>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-sm overflow-hidden flex relative">
                    <div 
                      className="bg-blue-600 flex items-center justify-end pr-2 text-xs font-semibold text-white"
                      style={{ width: `${poll.yesPercent}%` }}
                    >
                      {poll.yesPercent >= 15 && `${poll.yesPercent}%`}
                    </div>
                    <div 
                      className="bg-red-600 flex items-center justify-start pl-2 text-xs font-semibold text-white"
                      style={{ width: `${poll.noPercent}%` }}
                    >
                      {poll.noPercent >= 15 && `${poll.noPercent}%`}
                    </div>
                  </div>
                </div>
                
                <div className="text-right pb-1">
                  <div className="text-3xl font-bold tracking-tight">{poll.totalVotes.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
                    {language === 'en' ? 'Total Votes' : 'Ukupno glasova'}
                  </div>
                </div>
              </div>
              
              {/* Percentages */}
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-border">
                <div className="text-left">
                  <div className="text-2xl">{poll.yesPercent}%</div>
                  <div className="text-xs text-muted-foreground font-normal mt-1">{language === 'en' ? 'In Favor' : 'Za'}</div>
                </div>
                <Separator orientation="vertical" className="h-12" />
                <div className="text-right">
                  <div className="text-2xl">{poll.noPercent}%</div>
                  <div className="text-xs text-muted-foreground font-normal mt-1">{language === 'en' ? 'Opposed' : 'Protiv'}</div>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Article link - outside Link to avoid nested anchors */}
          {(poll as any).articleUrl && (
            <a
              href={(poll as any).articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary-hover transition-colors font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              <span>{language === 'en' ? 'Read related article' : 'Pročitaj članak'}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

