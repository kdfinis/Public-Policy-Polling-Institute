import { Globe2, LogIn, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CountrySelector } from './CountrySelector';
import { LanguageSelector } from './LanguageSelector';
import { CategorySelector } from './CategorySelector';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';

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
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[hsl(var(--navbar))] border-b border-secondary/20 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Globe2 className="h-6 w-6 text-[hsl(var(--navbar-foreground))]" />
          <span className="font-semibold text-lg text-[hsl(var(--navbar-foreground))] hidden sm:inline">
            Public Policy Polling Institute
          </span>
        </Link>

        {/* Right Selectors & Actions */}
        <div className="flex items-center gap-2">
          <CategorySelector language={selectedLanguage} />
          <CountrySelector
            value={selectedCountry}
            stateValue={selectedState}
            onChange={onCountryChange}
            onStateChange={onStateChange}
          />
          <LanguageSelector value={selectedLanguage} onChange={onLanguageChange} />
          <Button
            variant="outline"
            asChild
            className="hidden md:inline-flex h-11 bg-white/10 border-white/20 text-[hsl(var(--navbar-foreground))] hover:bg-white/20 hover:border-white/30"
          >
            <Link to="/voters">
              Voters
            </Link>
          </Button>
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="hidden md:inline-flex items-center gap-2 text-[hsl(var(--navbar-foreground))] hover:bg-white/10"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="h-4 w-4 text-[hsl(var(--navbar-foreground))]" />
                )}
              </div>
              <span className="text-sm font-medium">{user.displayName || 'Profile'}</span>
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/login')}
              className="hidden md:inline-flex items-center gap-2 bg-white text-[hsl(var(--navbar))] hover:bg-white/90"
            >
              <LogIn className="h-4 w-4" />
              <span className="font-medium">Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
