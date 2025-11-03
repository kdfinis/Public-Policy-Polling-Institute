import { useState } from 'react';
import { Filter } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { PollCard, Poll } from '@/components/PollCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data (same as Index for now)
function generateMockPolls(): Poll[] {
  const categories = ['Domestic Policy', 'Foreign Policy', 'Economic Policy', 'Environment'];
  const titles = [
    'Should the government increase funding for public infrastructure?',
    'Do you support expanding affordable housing programs?',
    'Should corporate tax rates be increased?',
    'Should the country commit to net-zero emissions by 2040?',
    'Do you support strengthening international trade agreements?',
    'Should minimum wage be adjusted for inflation annually?',
    'Do you support banning single-use plastics nationwide?',
    'Should local governments have more autonomy in policy-making?',
  ];

  return Array.from({ length: 20 }, (_, i) => ({
    id: `poll-${i + 1}`,
    title: titles[i % titles.length],
    category: categories[i % categories.length],
    country: 'United States',
    region: i % 3 === 0 ? 'California' : undefined,
    yesPercent: Math.floor(Math.random() * 40) + 30,
    noPercent: Math.floor(Math.random() * 40) + 30,
    totalVotes: Math.floor(Math.random() * 10000) + 1000,
    status: i % 5 === 0 ? 'closed' : 'open',
  }));
}

export default function Browse() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr'>('en');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const polls = generateMockPolls();

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
