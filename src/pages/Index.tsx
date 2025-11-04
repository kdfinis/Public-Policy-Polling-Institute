import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { CategoryWindow } from '@/components/CategoryWindow';
import { Poll } from '@/components/PollCard';
import { fetchPollsByCategory } from '@/lib/polls';
import { Skeleton } from '@/components/ui/skeleton';
import { TopVotersCarousel } from '@/components/TopVotersCarousel';
import { TopPoliticiansCarousel } from '@/components/TopPoliticiansCarousel';
import { HotPoll } from '@/components/HotPoll';
import { fetchHotPoll } from '@/lib/polls';

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

      // Throttle category fetches: process in batches to avoid connection overload
      const batchSize = 5;
      for (let i = 0; i < CATEGORY_KEYS.length && !cancelled; i += batchSize) {
        const batch = CATEGORY_KEYS.slice(i, i + batchSize);
        const categoryPromises = batch.map(async (catKey) => {
          try {
            const docs = await fetchPollsByCategory(catKey, {
              country: selectedCountry || undefined,
              state: selectedState || undefined,
              max: 10,
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

      setCategoryPolls(next);
      setTopCategories(top5);
      setLoading(false);
    };

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

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-8 w-48" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-24" />
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* Hot Poll - Newspaper Style */}
            {hotPoll && (
              <HotPoll poll={hotPoll} language={selectedLanguage} />
            )}
            
            {/* Top 5 Categories */}
            {topCategories.length > 0 && (
              <>
                <h2 className="text-2xl font-bold mb-6 mt-8">
                  {selectedLanguage === 'en' ? 'Top Categories' : 'Najpopularnije kategorije'}
                </h2>
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
            
            <div className="mt-10 space-y-8">
              <TopVotersCarousel />
              <TopPoliticiansCarousel />
            </div>
          </div>
        )}
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
