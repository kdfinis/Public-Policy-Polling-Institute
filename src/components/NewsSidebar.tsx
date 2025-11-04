import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string; // ISO string
}

interface NewsSidebarProps {
  countryCode?: string; // 'US' | 'EU' | 'HR' | others fallback to EU
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Placeholder builders per region/category
function stubItems(prefix: string, count = 3): NewsItem[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-${i}`,
    title: `${prefix} headline ${i + 1}`,
    source: prefix.includes('Gov') ? 'Official' : prefix.includes('Research') ? 'Institute' : 'Newswire',
    url: '#',
    publishedAt: new Date(Date.now() - i * 1000 * 60 * 47).toISOString(),
  }));
}

function getRegionBuckets(countryCode?: string) {
  const region = countryCode === 'US' ? 'US' : countryCode === 'HR' ? 'HR' : 'EU';
  if (region === 'US') {
    return {
      government: stubItems('US Gov Publications', 4),
      news: stubItems('US Policy News', 4),
      research: stubItems('US Research Findings', 3),
      elections: stubItems('US Upcoming Elections', 3),
    };
  }
  if (region === 'HR') {
    return {
      government: stubItems('HR Vlada Objave', 4),
      news: stubItems('HR Vijesti Politika', 4),
      research: stubItems('HR Istraživanja', 3),
      elections: stubItems('HR Nadolazeći Izbori', 3),
    };
  }
  // EU default
  return {
    government: stubItems('EU Commission Publications', 4),
    news: stubItems('EU Policy News', 4),
    research: stubItems('EU Research Reports', 3),
    elections: stubItems('EU Upcoming Elections', 3),
  };
}

function CategoryBox({ title, items }: { title: string; items: NewsItem[] }) {
  return (
    <div className="rounded-xl overflow-hidden border border-[hsl(var(--category-accent-border))]/30 shadow-md bg-gradient-to-br from-[hsl(var(--category-accent-light))] to-white">
      <div className="bg-gradient-to-r from-[hsl(var(--category-accent))] to-[hsl(var(--category-accent))]/90 px-4 py-2.5 border-b border-[hsl(var(--category-accent-border))]/30">
        <h4 className="text-sm font-semibold text-[hsl(var(--category-accent-foreground))]">{title}</h4>
      </div>
      <div className="p-3">
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id} className="group">
              <Link to={item.url} className="block">
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                  <span>{item.source}</span>
                  <span>{timeAgo(item.publishedAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function NewsSidebar({ countryCode }: NewsSidebarProps) {
  const [loading, setLoading] = useState(true);
  const [buckets, setBuckets] = useState<ReturnType<typeof getRegionBuckets> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      // Here we can branch to real fetchers per category/region in the future.
      const data = getRegionBuckets(countryCode);
      if (mounted) setBuckets(data);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [countryCode]);

  if (loading || !buckets) {
    return (
      <aside className="space-y-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-xl overflow-hidden border border-[hsl(var(--category-accent-border))]/30 shadow-md">
            <div className="h-8 bg-[hsl(var(--category-accent))]/40" />
            <div className="p-3 space-y-2">
              {Array.from({ length: 3 }).map((__, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        ))}
      </aside>
    );
  }

  return (
    <aside className="space-y-4">
      <CategoryBox title="Government Publications" items={buckets.government} />
      <CategoryBox title="Policy News" items={buckets.news} />
      <CategoryBox title="Research & Findings" items={buckets.research} />
      <CategoryBox title="Upcoming Elections" items={buckets.elections} />
    </aside>
  );
}
