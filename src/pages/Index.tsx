import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { CategoryWindow } from '@/components/CategoryWindow';
import { Poll } from '@/components/PollCard';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data generator
function generateMockPolls(category: string, count: number): Poll[] {
  const titles: Record<string, string[]> = {
    'Domestic Policy': [
      'Should the government increase funding for public infrastructure?',
      'Do you support expanding affordable housing programs?',
      'Should local governments have more autonomy in policy-making?',
      'Do you support increased funding for public transportation?',
      'Should term limits be imposed on elected officials?',
    ],
    'Foreign Policy': [
      'Should the country increase its foreign aid budget?',
      'Do you support strengthening international trade agreements?',
      'Should military presence abroad be reduced?',
      'Do you support diplomatic engagement with rival nations?',
      'Should the country join new international coalitions?',
    ],
    'Economic Policy': [
      'Should corporate tax rates be increased?',
      'Do you support a universal basic income program?',
      'Should minimum wage be adjusted for inflation annually?',
      'Do you support stricter regulations on financial institutions?',
      'Should small businesses receive more tax incentives?',
    ],
    'Environment': [
      'Should the country commit to net-zero emissions by 2040?',
      'Do you support banning single-use plastics nationwide?',
      'Should renewable energy subsidies be increased?',
      'Do you support stricter regulations on industrial emissions?',
      'Should public lands be protected from development?',
    ],
  };

  return Array.from({ length: count }, (_, i) => ({
    id: `${category.toLowerCase().replace(/\s+/g, '-')}-${i + 1}`,
    title: titles[category]?.[i % titles[category].length] || `${category} Poll ${i + 1}`,
    category,
    country: 'United States',
    region: i % 3 === 0 ? 'California' : undefined,
    yesPercent: Math.floor(Math.random() * 40) + 30,
    noPercent: Math.floor(Math.random() * 40) + 30,
    totalVotes: Math.floor(Math.random() * 10000) + 1000,
    status: i % 5 === 0 ? 'closed' : 'open',
  }));
}

export default function Index() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr'>('en');
  const [loading, setLoading] = useState(true);

  const categories = [
    'Domestic Policy',
    'Foreign Policy',
    'Economic Policy',
    'Environment',
  ];

  const categoryPolls = categories.reduce((acc, cat) => {
    acc[cat] = generateMockPolls(cat, 5);
    return acc;
  }, {} as Record<string, Poll[]>);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
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
                polls={categoryPolls[category]}
                language={selectedLanguage}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
