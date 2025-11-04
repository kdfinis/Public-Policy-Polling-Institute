import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSelectorProps {
  value: 'en' | 'hr' | 'fr' | 'de';
  onChange: (value: 'en' | 'hr' | 'fr' | 'de') => void;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
] as const;

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const currentLang = languages.find((l) => l.code === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-11 bg-white/10 border-white/20 text-[hsl(var(--navbar-foreground))] hover:bg-white/20 hover:border-white/30 gap-2">
          <span className="font-medium">Language</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-popover shadow-xl border-border/50">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className="h-11 cursor-pointer hover:bg-accent/50 focus:bg-accent/50 transition-colors"
          >
            <span className="mr-2">{lang.flag}</span>
            <span className={value === lang.code ? 'font-medium' : ''}>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
