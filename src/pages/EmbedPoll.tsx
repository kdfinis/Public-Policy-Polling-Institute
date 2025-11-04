import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPollById, type PollDoc } from '@/lib/polls';

export default function EmbedPoll() {
  const { id } = useParams();
  const [poll, setPoll] = useState<PollDoc | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        const p = await fetchPollById(id);
        if (mounted) setPoll(p);
      } catch {
        if (mounted) setPoll(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const jsonLd = useMemo(() => {
    if (!poll) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Question',
      name: poll.title,
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes',
      },
      suggestedAnswer: {
        '@type': 'Answer',
        text: 'No',
      },
    };
  }, [poll]);

  return (
    <div className="w-full h-full bg-transparent">
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {!poll ? (
        <div className="p-4 text-sm text-muted-foreground">Loading…</div>
      ) : (
        <div className="p-4 border border-border rounded-md bg-card">
          <div className="text-sm text-muted-foreground mb-1">Poll</div>
          <div className="text-lg font-semibold mb-3">{poll.title}</div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-3">
              <span className="text-blue-600">{poll.stats?.yesPercent ?? 0}% Yes</span>
              <span className="text-red-600">{poll.stats?.noPercent ?? 0}% No</span>
            </div>
            <div className="text-muted-foreground">{(poll.stats?.totalVotes ?? 0).toLocaleString()} votes</div>
          </div>
        </div>
      )}
    </div>
  );
}


