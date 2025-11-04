import { ChevronRight } from 'lucide-react';
import { PollCard, Poll } from './PollCard';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/lib/i18n';

interface CategoryWindowProps {
  category: string;
  polls: Poll[];
  language?: 'en' | 'hr' | 'fr' | 'de';
}

export function CategoryWindow({ category, polls, language = 'en' }: CategoryWindowProps) {
  const { t } = useTranslation(language);
  const featuredPolls = polls.slice(0, 2); // Always 2 tickets
  const summaryPolls = polls.slice(2, 6).slice(0, 4); // Exactly 4 poll lines

  return (
    <div className="mb-8 rounded-xl overflow-hidden border border-[hsl(var(--category-accent-border))]/30 shadow-md bg-gradient-to-br from-[hsl(var(--category-accent-light))] to-white">
      {/* Category header with accent color */}
      <div className="bg-gradient-to-r from-[hsl(var(--category-accent))] to-[hsl(var(--category-accent))]/90 px-6 py-4 border-b border-[hsl(var(--category-accent-border))]/30">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[hsl(var(--category-accent-foreground))]">{category}</h2>
          <Link
            to={`/browse?category=${encodeURIComponent(category)}`}
            className="flex items-center gap-1 text-sm font-medium text-[hsl(var(--category-accent-foreground))] hover:text-[hsl(var(--category-accent-foreground))]/80 transition-colors bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-md"
          >
            {t('nav.browse')}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6">
        {polls.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            {t('common.empty')}
          </div>
        ) : (
          <div className="space-y-3">
          {/* Two side-by-side featured polls */}
          <div className="grid gap-3 sm:grid-cols-2">
            {featuredPolls.length >= 2 ? (
              featuredPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} variant="featured" language={language} />
              ))
            ) : (
              <>
                {featuredPolls.map((poll) => (
                  <PollCard key={poll.id} poll={poll} variant="featured" language={language} />
                ))}
                {/* Placeholder if only 1 poll */}
                {featuredPolls.length === 1 && (
                  <div className="bg-card border border-border rounded-md p-4 opacity-50">
                    <div className="text-sm text-muted-foreground">More polls coming soon</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Summary lines - Always show 4 poll lines */}
          <div className="bg-card border border-border rounded-md overflow-hidden divide-y divide-border">
            {summaryPolls.length > 0 ? (
              summaryPolls.slice(0, 4).map((poll) => (
                <Link
                  key={poll.id}
                  to={`/poll/${poll.id}`}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                      {poll.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{poll.totalVotes.toLocaleString()} {language === 'en' ? 'votes' : 'glasova'}</span>
                      <span>•</span>
                      <span className="text-blue-600">{poll.yesPercent}% {language === 'en' ? 'Yes' : 'Da'}</span>
                      <span className="text-red-600">{poll.noPercent}% {language === 'en' ? 'No' : 'Ne'}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))
            ) : (
              // Show placeholder if no polls available
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 text-muted-foreground text-sm">
                  <span>{language === 'en' ? 'More polls coming soon...' : 'Više anketa uskoro...'}</span>
                </div>
              ))
            )}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
