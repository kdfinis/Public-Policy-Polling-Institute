import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LanguageSelectorProps {
  value: 'en' | 'hr';
  onChange: (value: 'en' | 'hr') => void;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hr', name: 'Hrvatski' },
] as const;

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const currentLang = languages.find((l) => l.code === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-11 w-11 bg-background">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 bg-popover">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className="h-11 cursor-pointer"
          >
            <span className={value === lang.code ? 'font-medium' : ''}>
              {lang.name}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
