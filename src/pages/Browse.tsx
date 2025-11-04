import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PollCard, Poll } from '@/components/PollCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchPollsByCategory } from '@/lib/polls';

function mapDocToPoll(d: any): Poll {
  return {
    id: d.id,
    title: d.title ?? 'Untitled',
    category: d.category ?? 'Domestic Policy',
    country: d.country ?? 'US',
    region: d.state ?? undefined,
    yesPercent: Math.round(d.stats?.yesPercent ?? 50),
    noPercent: Math.round(d.stats?.noPercent ?? 50),
    totalVotes: Math.round(d.stats?.totalVotes ?? 0),
    status: (d.status ?? 'open') as 'open' | 'closed',
  };
}

export default function Browse() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr' | 'fr' | 'de'>('en');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);

  async function load() {
    const cats = ['Domestic Policy', 'Foreign Policy', 'Economic Policy', 'Environment'];
    const results: Poll[] = [];
    for (const c of cats) {
      const docs = await fetchPollsByCategory(c, { country: selectedCountry || undefined, state: selectedState || undefined, max: 20 });
      results.push(...docs.map(mapDocToPoll));
    }
    setPolls(results);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCountry, selectedState]);

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
        {/* Filter Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            {selectedLanguage === 'en' ? 'Browse Polls' : 'Pregledaj Ankete'}
          </h1>
          <Button
            variant="outline"
            onClick={() => setFilterOpen(!filterOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {selectedLanguage === 'en' ? 'Filter' : 'Filtriraj'}
          </Button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => setActiveFilters(activeFilters.filter((f) => f !== filter))}
              >
                {filter} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Poll List */}
        <div className="bg-card border border-border rounded-md overflow-hidden">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} variant="compact" language={selectedLanguage} />
          ))}
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
