import { ChevronRight } from 'lucide-react';
import { PollCard, Poll } from './PollCard';
import { Link } from 'react-router-dom';

interface CategoryWindowProps {
  category: string;
  polls: Poll[];
  language?: 'en' | 'hr';
}

export function CategoryWindow({ category, polls, language = 'en' }: CategoryWindowProps) {
  const featuredPolls = polls.slice(0, 2);
  const listPolls = polls.slice(2, 5);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{category}</h2>
        <Link
          to={`/browse?category=${encodeURIComponent(category)}`}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          {language === 'en' ? 'View all' : 'Vidi sve'}
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-3">
        {/* Featured polls */}
        <div className="grid gap-3 sm:grid-cols-2">
          {featuredPolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} variant="featured" language={language} />
          ))}
        </div>

        {/* Compact list */}
        {listPolls.length > 0 && (
          <div className="bg-card border border-border rounded-md overflow-hidden">
            {listPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} variant="compact" language={language} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
