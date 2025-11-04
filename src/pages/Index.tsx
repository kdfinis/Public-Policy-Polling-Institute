import { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { CategoryWindow } from '@/components/CategoryWindow';
import { Poll } from '@/components/PollCard';
import { fetchPollsByCategory } from '@/lib/polls';
import { Skeleton } from '@/components/ui/skeleton';
import { TopVotersCarousel } from '@/components/TopVotersCarousel';
import { TopPoliticiansCarousel } from '@/components/TopPoliticiansCarousel';

// Helper: map Firestore poll doc -> UI Poll shape
function mapDocToPoll(category: string, d: any): Poll {
  return {
    id: d.id,
    title: d.title ?? 'Untitled',
    category,
    country: d.country ?? 'US',
    region: d.state ?? undefined,
    yesPercent: Math.round(d.stats?.yesPercent ?? 50),
    noPercent: Math.round(d.stats?.noPercent ?? 50),
    totalVotes: Math.round(d.stats?.totalVotes ?? 0),
    status: (d.status ?? 'open') as 'open' | 'closed',
  };
}

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation(selectedLanguage);

  const categories = [
    t('category.domestic'),
    t('category.foreign'),
    t('category.economic'),
    t('category.environment'),
  ];

  const [categoryPolls, setCategoryPolls] = useState<Record<string, Poll[]>>({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const next: Record<string, Poll[]> = {};
      for (const cat of categories) {
        const docs = await fetchPollsByCategory(cat, {
          country: selectedCountry || undefined,
          state: selectedState || undefined,
          max: 5,
        });
        next[cat] = docs.map((d) => mapDocToPoll(cat, d));
      }
      if (!cancelled) {
        setCategoryPolls(next);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedCountry, selectedState, selectedLanguage]);

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
            {categories.map((category) => (
              <CategoryWindow
                key={category}
                category={category}
                polls={categoryPolls[category] || []}
                language={selectedLanguage}
              />
            ))}
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
