import { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { CategoryWindow } from '@/components/CategoryWindow';
import { Poll } from '@/components/PollCard';
import { fetchPollsByCategory } from '@/lib/polls';
import { Skeleton } from '@/components/ui/skeleton';
const TopVotersCarousel = lazy(() => import('@/components/TopVotersCarousel').then(m => ({ default: m.TopVotersCarousel })));
const TopPoliticiansCarousel = lazy(() => import('@/components/TopPoliticiansCarousel').then(m => ({ default: m.TopPoliticiansCarousel })));
import { NewsSidebar } from '@/components/NewsSidebar';
const HotPoll = lazy(() => import('@/components/HotPoll').then(m => ({ default: m.HotPoll })));
import { fetchHotPoll } from '@/lib/polls';
const NewsRail = lazy(() => import('@/components/NewsRail').then(m => ({ default: m.NewsRail })));

// All 20 categories for Firestore queries
const CATEGORY_KEY_MAP: Record<string, string> = {
  'Domestic Policy': 'category.domestic',
  'Foreign Policy': 'category.foreign',
  'Economic Policy': 'category.economic',
  'Social Issues': 'category.social',
  'Environment': 'category.environment',
  'Healthcare': 'category.healthcare',
  'Education': 'category.education',
  'Immigration': 'category.immigration',
  'Criminal Justice': 'category.criminal',
  'Technology & Privacy': 'category.technology',
  'Housing & Urban': 'category.housing',
  'National Defense': 'category.defense',
  'Energy Policy': 'category.energy',
  'Trade & Commerce': 'category.trade',
  'Taxation': 'category.taxation',
  'Labor & Employment': 'category.labor',
  'Civil Rights': 'category.civil',
  'Gun Control': 'category.guns',
  'Abortion & Reproductive': 'category.abortion',
  'Infrastructure': 'category.infrastructure',
  'Climate Change': 'category.climate',
};
const CATEGORY_KEYS = Object.keys(CATEGORY_KEY_MAP);

// Helper: map Firestore poll doc -> UI Poll shape
function mapDocToPoll(category: string, d: any): Poll {
  return {
    id: d.id,
    title: d.title ?? 'Untitled',
    description: d.description,
    category,
    country: d.country ?? 'US',
    region: d.state ?? undefined,
    yesPercent: Math.round(d.stats?.yesPercent ?? 50),
    noPercent: Math.round(d.stats?.noPercent ?? 50),
    totalVotes: Math.round(d.stats?.totalVotes ?? 0),
    status: (d.status ?? 'open') as 'open' | 'closed',
    articleUrl: d.articleUrl,
    imageUrl: d.imageUrl,
  };
}

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(selectedLanguage);

  // Translate categories for display only - use selectedLanguage only as dependency
  const categories = useMemo(
    () => CATEGORY_KEYS.map((key) => t(CATEGORY_KEY_MAP[key] as any)),
    [selectedLanguage] // t is stable relative to selectedLanguage
  );

  const [categoryPolls, setCategoryPolls] = useState<Record<string, Poll[]>>({});
  const [hotPoll, setHotPoll] = useState<Poll | null>(null);
  const [topCategories, setTopCategories] = useState<string[]>([]);
  // Quick preview state
  const [previewReady, setPreviewReady] = useState(false);
  const [previewPolls, setPreviewPolls] = useState<Record<string, Poll[]>>({});
  const [previewTopCategories, setPreviewTopCategories] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: NodeJS.Timeout;
    
    // Debounce rapid changes to prevent connection overload
    const load = async () => {
      setLoading(true);
      const next: Record<string, Poll[]> = {};
      
      // Fetch hot poll (most votes)
      try {
        const hot = await fetchHotPoll();
        if (!cancelled && hot) {
          setHotPoll({
            id: hot.id,
            title: hot.title,
            category: hot.category,
            country: hot.country,
            region: hot.state || undefined,
            yesPercent: Math.round(hot.stats?.yesPercent ?? 50),
            noPercent: Math.round(hot.stats?.noPercent ?? 50),
            totalVotes: Math.round(hot.stats?.totalVotes ?? 0),
            status: (hot.status ?? 'open') as 'open' | 'closed',
            articleUrl: hot.articleUrl ?? hot.article_url,
            imageUrl: hot.imageUrl ?? hot.image_url,
          });
        }
      } catch (error) {
        if (!cancelled) console.error('Failed to fetch hot poll:', error);
      }

      // Throttle category fetches: process in smaller batches to reduce TTFB
      const batchSize = 3;
      for (let i = 0; i < CATEGORY_KEYS.length && !cancelled; i += batchSize) {
        const batch = CATEGORY_KEYS.slice(i, i + batchSize);
        const categoryPromises = batch.map(async (catKey) => {
          try {
            const docs = await fetchPollsByCategory(catKey, {
              country: selectedCountry || undefined,
              state: selectedState || undefined,
              // Fetch only what's needed by UI: 2 featured + 4 summary lines
              max: 6,
            });
            const translatedCat = categories[CATEGORY_KEYS.indexOf(catKey)] || catKey;
            return { category: translatedCat, polls: docs.map((d) => mapDocToPoll(translatedCat, d)) };
          } catch (error) {
            if (!cancelled) console.error(`Failed to fetch polls for category ${catKey}:`, error);
            const translatedCat = categories[CATEGORY_KEYS.indexOf(catKey)] || catKey;
            return { category: translatedCat, polls: [] };
          }
        });

        const results = await Promise.allSettled(categoryPromises);
        if (cancelled) break;
        
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            next[result.value.category] = result.value.polls;
          }
        });

        // Small delay between batches to prevent connection overload
        if (i + batchSize < CATEGORY_KEYS.length) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      if (cancelled) return;

      // Determine top 5 categories by total votes
      const categoryTotals = Object.entries(next).map(([cat, polls]) => ({
        category: cat,
        total: polls.reduce((sum, p) => sum + p.totalVotes, 0),
      }));
      const top5 = categoryTotals
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)
        .map((c) => c.category);

      // Avoid unnecessary render if data is effectively the same (ids & lengths)
      const same = Object.keys(next).length === Object.keys(categoryPolls).length &&
        Object.keys(next).every((k) => {
          const a = next[k] || [];
          const b = categoryPolls[k] || [];
          if (a.length !== b.length) return false;
          for (let i = 0; i < a.length; i++) {
            if (a[i].id !== b[i].id) return false;
          }
          return true;
        });
      if (!same) {
        setCategoryPolls(next);
      }
      setTopCategories(top5);
      setLoading(false);
    };

    // Start fast preview load (hot poll + first 2 categories)
    (async () => {
      try {
        const quick: Record<string, Poll[]> = {};
        const hot = await fetchHotPoll();
        if (hot) {
          setHotPoll({
            id: hot.id,
            title: hot.title,
            category: hot.category,
            country: hot.country,
            region: hot.state || undefined,
            yesPercent: Math.round(hot.stats?.yesPercent ?? 50),
            noPercent: Math.round(hot.stats?.noPercent ?? 50),
            totalVotes: Math.round(hot.stats?.totalVotes ?? 0),
            status: (hot.status ?? 'open') as 'open' | 'closed',
            articleUrl: (hot as any).articleUrl,
            imageUrl: (hot as any).imageUrl,
          });
        }
        const quickKeys = CATEGORY_KEYS.slice(0, 2);
        const quickResults = await Promise.allSettled(
          quickKeys.map(async (key) => {
            const docs = await fetchPollsByCategory(key, { max: 4 });
            const translatedCat = categories[CATEGORY_KEYS.indexOf(key)] || key;
            return { category: translatedCat, polls: docs.map((d) => mapDocToPoll(translatedCat, d)) };
          })
        );
        quickResults.forEach((r) => {
          if (r.status === 'fulfilled') quick[r.value.category] = r.value.polls;
        });
        const quickTotals = Object.entries(quick).map(([cat, polls]) => ({ category: cat, total: polls.reduce((s, p) => s + p.totalVotes, 0) }));
        const quickTop = quickTotals.sort((a, b) => b.total - a.total).map((c) => c.category);
        setPreviewPolls(quick);
        setPreviewTopCategories(quickTop);
        setPreviewReady(true);
      } catch {}
    })();

    // Debounce to prevent rapid re-fetches
    timeoutId = setTimeout(() => {
      load();
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [selectedCountry, selectedState, selectedLanguage, categories]);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-4">
      <Header
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        selectedLanguage={selectedLanguage}
        onCountryChange={setSelectedCountry}
        onStateChange={setSelectedState}
        onLanguageChange={setSelectedLanguage}
      />

      <main className="w-[90%] mx-auto px-4 py-6">
        {loading ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Left (News) */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-border/40 shadow-sm">
                  <div className="h-8 bg-muted" />
                  <div className="p-3 space-y-2">
                    {Array.from({ length: 4 }).map((__, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Center (Hot poll + categories) */}
            <div className="col-span-12 lg:col-span-6">
              <div className="rounded-lg border border-border/60 p-4 shadow-sm">
                <Skeleton className="h-6 w-56 mb-3" />
                <Skeleton className="h-24 w-full mb-2" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="flex items-center gap-3 my-8">
                <div className="h-px flex-1 bg-border" />
                <Skeleton className="h-6 w-48" />
                <div className="h-px flex-1 bg-border" />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-border/60 shadow-sm mb-6">
                  <div className="h-10 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: 4 }).map((__, j) => (
                        <Skeleton key={j} className="h-5 w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right (People) */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              {[0, 1].map((b) => (
                <div key={b} className="rounded-xl overflow-hidden border border-border/40 shadow-sm">
                  <div className="h-8 bg-muted" />
                  <div className="p-3 grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-64 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Column 1: News (3/12) */}
            <div className="col-span-12 lg:col-span-3">
              <NewsSidebar countryCode={selectedCountry || 'EU'} />
            </div>

            {/* Column 2: Main content (6/12) */}
            <div className="col-span-12 lg:col-span-6">
              {/* Hot Poll - Newspaper Style */}
              {hotPoll && (
                <Suspense fallback={<div className="h-32 bg-muted rounded" />}>
                  <HotPoll poll={hotPoll} language={selectedLanguage} />
                </Suspense>
              )}
              
              {/* Demarcation: About segment under featured poll */}
              {hotPoll && (
                <div className="mt-6 mb-8 border border-[hsl(var(--navbar))]/20 rounded-lg p-5 bg-[hsl(var(--navbar))]/5">
                  <h3 className="text-lg font-semibold text-foreground mb-2">About Public Policy Polling Institute</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    We provide verified snapshots of public opinion on major policy topics. Each poll shows the current distribution of responses, participant totals, and a quick summary so you can understand sentiment at a glance.
                  </p>
                  <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                    <li>Real-time tallies of “In Favor” and “Opposed”.</li>
                    <li>Optional public visibility for verified voters; private voting supported.</li>
                    <li>Top categories highlight areas with the most recent participation.</li>
                  </ul>
                </div>
              )}
              
              {/* Divider heading */}
              <div className="flex items-center gap-3 my-8">
                <div className="h-px flex-1 bg-border" />
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedLanguage === 'en' ? 'Top Categories' : 'Najpopularnije kategorije'}
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              
              {/* Top 5 Categories */}
              {topCategories.length > 0 && (
                <>
                  {topCategories.map((category) => (
                    <CategoryWindow
                      key={category}
                      category={category}
                      polls={categoryPolls[category] || []}
                      language={selectedLanguage}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Column 3: People (3/12) */}
            <div className="col-span-12 lg:col-span-3 space-y-6">
              {/* Public Persons (top half) */}
              <div className="rounded-xl overflow-hidden border border-[hsl(var(--category-accent-border))]/30 shadow-md bg-gradient-to-br from-[hsl(var(--category-accent-light))] to-white">
                <div className="bg-gradient-to-r from-[hsl(var(--category-accent))] to-[hsl(var(--category-accent))]/90 px-6 py-3 border-b border-[hsl(var(--category-accent-border))]/30">
                  <h3 className="text-sm font-semibold text-[hsl(var(--category-accent-foreground))]">Public Persons</h3>
                </div>
                <div className="p-3">
                  <Suspense fallback={<Skeleton className="h-48" />}>
                    <TopPoliticiansCarousel compact />
                  </Suspense>
                </div>
              </div>
              {/* Top Voters (bottom half) */}
              <div className="rounded-xl overflow-hidden border border-[hsl(var(--category-accent-border))]/30 shadow-md bg-gradient-to-br from-[hsl(var(--category-accent-light))] to-white">
                <div className="bg-gradient-to-r from-[hsl(var(--category-accent))] to-[hsl(var(--category-accent))]/90 px-6 py-3 border-b border-[hsl(var(--category-accent-border))]/30">
                  <h3 className="text-sm font-semibold text-[hsl(var(--category-accent-foreground))]">Top Voters</h3>
                </div>
                <div className="p-3">
                  <Suspense fallback={<Skeleton className="h-48" />}>
                    <TopVotersCarousel compact />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
