import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

export default function Notifications() {
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
        <h1 className="text-2xl font-bold mb-6">
          {selectedLanguage === 'en' ? 'Notifications' : 'Obavijesti'}
        </h1>
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mb-4" />
          <p>{selectedLanguage === 'en' ? 'No notifications yet' : 'Još nema obavijesti'}</p>
        </div>
      </main>

      <BottomNav language={selectedLanguage} />
    </div>
  );
}
