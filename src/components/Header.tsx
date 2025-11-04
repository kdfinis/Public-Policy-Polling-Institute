import { Globe2, LogIn, Users, Newspaper } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CountrySelector } from './CountrySelector';
import { LanguageSelector } from './LanguageSelector';
import { Button } from '@/components/ui/button';

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
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--navbar))] border-b border-white/10 shadow-md">
      <div className="w-[90%] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Globe2 className="h-6 w-6 text-[hsl(var(--navbar-foreground))]" />
          <span className="font-semibold text-lg text-[hsl(var(--navbar-foreground))] hidden sm:inline">
            Public Policy Polling Institute
          </span>
        </Link>

        {/* Right-to-left ordered actions */}
        <div className="flex items-center gap-2">
          {/* Leftmost in the cluster (Language) */}
          <LanguageSelector value={selectedLanguage} onChange={onLanguageChange} />

          {/* Country selector */}
          <CountrySelector
            value={selectedCountry}
            stateValue={selectedState}
            onChange={onCountryChange}
            onStateChange={onStateChange}
          />

          {/* Browse Polls */}
          <Button
            asChild
            variant="outline"
            className="h-11 bg-white/10 border-white/20 text-[hsl(var(--navbar-foreground))] hover:bg-white/20 hover:border-white/30"
          >
            <Link to="/browse" className="flex items-center gap-2">
              <Newspaper className="h-4 w-4" />
              <span>Browse Polls</span>
            </Link>
          </Button>

          {/* Browse Voters */}
          <Button
            asChild
            variant="outline"
            className="h-11 bg-white/10 border-white/20 text-[hsl(var(--navbar-foreground))] hover:bg-white/20 hover:border-white/30"
          >
            <Link to="/voters" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Browse Voters</span>
            </Link>
          </Button>

          {/* About */}
          <Button
            asChild
            variant="outline"
            className="h-11 bg-white/10 border-white/20 text-[hsl(var(--navbar-foreground))] hover:bg-white/20 hover:border-white/30"
          >
            <Link to="/about">About</Link>
          </Button>

          {/* Rightmost: Login */}
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate('/login')}
            className="h-11 bg-white text-[hsl(var(--navbar))] hover:bg-white/90 px-4"
          >
            <LogIn className="h-4 w-4 mr-2" />
            <span className="font-medium">Login</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
