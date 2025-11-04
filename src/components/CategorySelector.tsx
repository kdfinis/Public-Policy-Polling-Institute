import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Grid3x3 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'category.domestic',
  'category.foreign',
  'category.economic',
  'category.social',
  'category.environment',
  'category.healthcare',
  'category.education',
  'category.immigration',
  'category.criminal',
  'category.technology',
  'category.housing',
  'category.defense',
  'category.energy',
  'category.trade',
  'category.taxation',
  'category.labor',
  'category.civil',
  'category.guns',
  'category.abortion',
  'category.infrastructure',
  'category.climate',
] as const;

interface CategorySelectorProps {
  language?: 'en' | 'hr' | 'fr' | 'de';
}

export function CategorySelector({ language = 'en' }: CategorySelectorProps) {
  const { t } = useTranslation(language);
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-11 bg-white/10 border-white/20 text-[hsl(var(--navbar-foreground))] hover:bg-white/20 hover:border-white/30 gap-2">
          <Grid3x3 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('nav.browse')}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-[400px] overflow-y-auto shadow-xl border-border/50">
        {CATEGORIES.map((catKey) => {
          const category = t(catKey as any);
          return (
            <DropdownMenuItem key={catKey} asChild>
              <Link
                to={`/browse?category=${encodeURIComponent(category)}`}
                onClick={() => setOpen(false)}
                className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50 transition-colors"
              >
                {category}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

