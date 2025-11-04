import { Globe2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CountrySelector } from './CountrySelector';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  selectedCountry: string;
  selectedState?: string;
  selectedLanguage: 'en' | 'hr' | 'fr' | 'de';
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
  onLanguageChange: (lang: 'en' | 'hr' | 'fr' | 'de') => void;
}

export function Header({
  selectedCountry,
  selectedState,
  selectedLanguage,
  onCountryChange,
  onStateChange,
  onLanguageChange,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Globe2 className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg text-foreground hidden sm:inline">
            Public Policy Polling Institute
          </span>
        </Link>

        {/* Center Selectors */}
        <div className="flex items-center gap-2 flex-1 justify-center max-w-lg">
          <CountrySelector
            value={selectedCountry}
            stateValue={selectedState}
            onChange={onCountryChange}
            onStateChange={onStateChange}
          />
          <LanguageSelector value={selectedLanguage} onChange={onLanguageChange} />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link to="/voters" className="hidden md:inline text-sm font-medium text-foreground hover:text-primary">
            Voters
          </Link>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">U</span>
          </div>
        </div>
      </div>
    </header>
  );
}
