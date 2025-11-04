import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchHotPoll, fetchFeatured, type PollDoc } from '@/lib/polls';

interface NewsItem {
  id: string;
  title: string;
  source?: string;
  url: string;
}

export function NewsRail() {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [hot, featured] = await Promise.all([
          fetchHotPoll(),
          fetchFeatured({ max: 20 }),
        ]);
        if (cancelled) return;
        const all: Array<PollDoc> = [];
        if (hot) all.push(hot);
        for (const f of featured) all.push(f);
        const uniq: Record<string, boolean> = {};
        const mapped: NewsItem[] = all
          .map((p) => ({
            id: p.id,
            title: p.title,
            url: (p as any).articleUrl || (p as any).article_url || '',
          }))
          .filter((i) => i.url && !uniq[i.url] && (uniq[i.url] = true))
          .slice(0, 20)
          .map((i) => {
            try {
              const host = new URL(i.url).hostname.replace(/^www\./, '');
              return { ...i, source: host };
            } catch {
              return { ...i, source: 'source' };
            }
          });
        setItems(mapped);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!items.length) return null;

  // Categorize
  const isGov = (src?: string) => !!src && (/\.gov$/.test(src) || src.includes('.gov') || src.includes('europa.eu') || src.includes('ec.europa.eu'));
  const isElectionRelated = (t: string) => /election|runoff|ballot|vote|referendum|results/i.test(t);
  const isResultLike = (t: string) => /result|projected|called|wins|runoff|exit poll/i.test(t);

  const govItems = items.filter((i) => isGov(i.source));
  const electionAll = items.filter((i) => isElectionRelated(i.title));
  const electionResults = electionAll.filter((i) => isResultLike(i.title));
  const upcomingElections = electionAll.filter((i) => !isResultLike(i.title));
  const generalNews = items.filter((i) => !govItems.includes(i) && !electionAll.includes(i));

  const Section = ({ title, data }: { title: string; data: NewsItem[] }) => (
    data.length ? (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <Card className="p-3">
          <div className="divide-y divide-border">
            {data.map((n) => (
              <a
                key={n.id + n.url}
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block py-3 group"
              >
                <div className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {n.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                  <Badge variant="outline" className="h-5 px-2">{n.source || 'News'}</Badge>
                  <span>{n.source}</span>
                </div>
              </a>
            ))}
          </div>
        </Card>
      </div>
    ) : null
  );

  return (
    <div className="space-y-6">
      <Section title="Latest from Sources" data={generalNews.slice(0, 20)} />
      <Section title="Latest from Government Sources" data={govItems.slice(0, 20)} />
      <Section title="Latest Election Results" data={electionResults.slice(0, 20)} />
      <Section title="Upcoming Elections" data={upcomingElections.slice(0, 20)} />
    </div>
  );
}


