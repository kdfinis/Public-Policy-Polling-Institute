import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Input } from '@/components/ui/input';

export default function Search() {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('FEDERAL');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hr'>('en');

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

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={selectedLanguage === 'en' ? 'Search polls...' : 'Traži ankete...'}
            className="pl-10 h-12"
          />
        </div>
        <div className="mt-12 text-center text-muted-foreground">
          {selectedLanguage === 'en' ? 'Start typing to search polls' : 'Počnite tipkati za pretraživanje anketa'}
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
