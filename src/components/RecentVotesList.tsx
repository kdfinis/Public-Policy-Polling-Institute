import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { fetchRecentVotes, type RecentVote } from '@/lib/users';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';

interface RecentVotesListProps {
  voterId: string;
}

export function RecentVotesList({ voterId }: RecentVotesListProps) {
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState<RecentVote[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchRecentVotes(voterId, 10);
      if (mounted) {
        setVotes(data);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [voterId]);

  if (loading) {
    return (
      <section className="bg-card border border-border rounded-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Recent Votes</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (votes.length === 0) {
    return (
      <section className="bg-card border border-border rounded-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Recent Votes</h2>
        <p className="text-muted-foreground text-center py-8">No recent public votes</p>
      </section>
    );
  }

  return (
    <section className="bg-card border border-border rounded-md p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">Recent Votes</h2>
      <div className="space-y-3">
        {votes.map((vote) => (
          <Link 
            key={vote.id} 
            to={`/poll/${vote.pollId}`}
            className="block border border-border rounded-md p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {vote.choice === 'yes' ? (
                    <ThumbsUp className="w-4 h-4 text-blue-600 shrink-0" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span className="font-medium text-sm">
                    {vote.choice === 'yes' ? 'Agreed' : 'Disagreed'}
                  </span>
                </div>
                <h4 className="font-medium line-clamp-2 mb-2">{vote.pollTitle}</h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(vote.votedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                  {vote.category && (
                    <Badge variant="outline" className="text-xs">
                      {vote.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
