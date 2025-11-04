import { useState } from 'react';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { countries, usStates } from '@/lib/countries';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CountrySelectorProps {
  value: string;
  stateValue?: string;
  onChange: (value: string) => void;
  onStateChange: (value: string) => void;
}

export function CountrySelector({
  value,
  stateValue,
  onChange,
  onStateChange,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  const selectedCountry = countries.find((c) => c.code === value);
  const selectedState = usStates.find((s) => s.code === stateValue);
  const showStateSelector = value === 'US';

  // Build list: special top-level options then all European countries
  const specialOptions = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'EU', name: 'European Union', flag: '🇪🇺' },
  ];

  // Derive flag emoji from ISO country code
  const codeToFlag = (code: string): string => {
    if (!code || code.length < 2) return '';
    const cc = code.slice(0, 2).toUpperCase();
    const A = 0x1f1e6;
    const a = 'A'.charCodeAt(0);
    return String.fromCodePoint(A + (cc.charCodeAt(0) - a)) + String.fromCodePoint(A + (cc.charCodeAt(1) - a));
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="min-w-[140px] justify-between h-11 bg-white/10 border-white/20 text-[hsl(var(--navbar-foreground))] hover:bg-white/20 hover:border-white/30"
          >
            <MapPin className="mr-2 h-4 w-4 shrink-0 text-[hsl(var(--navbar-foreground))]/70" />
            <span className="truncate">
              {value === 'EU'
                ? 'European Union'
                : selectedCountry
                ? selectedCountry.name
                : 'Country'}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-[hsl(var(--navbar-foreground))]/70" />
          </Button>
          </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0 shadow-xl border-border/50" align="start">
          <Command shouldFilter={true} filter={(value, search) => {
            if (!search) return 1;
            const searchLower = search.toLowerCase();
            const valueLower = value.toLowerCase();
            // Check if search matches the value or any part of it
            if (valueLower.includes(searchLower)) return 1;
            return 0;
          }}>
            <CommandInput placeholder="Search country by name..." className="h-12 text-base" />
            <CommandList className="max-h-[400px]">
              <CommandEmpty>No country found. Try searching by name.</CommandEmpty>
              {/* Top-level special options */}
              <CommandGroup heading="Popular">
                {specialOptions.map((opt) => (
                  <CommandItem
                    key={opt.code}
                    value={`${opt.name} ${opt.code}`}
                    onSelect={() => {
                      onChange(opt.code === value ? '' : opt.code);
                      if (opt.code !== 'US') {
                        onStateChange('');
                      }
                      setOpen(false);
                    }}
                    className="h-12 px-3 py-2.5 cursor-pointer hover:bg-accent/50"
                  >
                    <Check
                      className={cn(
                        'mr-3 h-4 w-4 shrink-0',
                        value === opt.code ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="mr-3 text-lg">{opt.flag}</span>
                    <span className="text-base">{opt.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* All countries */}
              <CommandGroup heading="All Countries">
                {countries
                  .filter((c) => c.code !== 'US')
                  .map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.name} ${country.code}`}
                      onSelect={() => {
                        onChange(country.code === value ? '' : country.code);
                        if (country.code !== 'US') {
                          onStateChange('');
                        }
                        setOpen(false);
                      }}
                      className="h-12 px-3 py-2.5 cursor-pointer hover:bg-accent/50"
                    >
                      <Check
                        className={cn(
                          'mr-3 h-4 w-4 shrink-0',
                          value === country.code ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="mr-3 text-lg">{codeToFlag(country.code)}</span>
                      <span className="text-base">{country.name}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {showStateSelector && (
        <Popover open={stateOpen} onOpenChange={setStateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={stateOpen}
              className="min-w-[160px] justify-between h-11 bg-white/10 border-white/20 text-[hsl(var(--navbar-foreground))] hover:bg-white/20 hover:border-white/30"
            >
              <span className="truncate">
                {selectedState ? selectedState.name : 'Select state'}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-[hsl(var(--navbar-foreground))]/70" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0 shadow-xl border-border/50" align="start">
            <Command shouldFilter={true} filter={(value, search) => {
              if (!search) return 1;
              const searchLower = search.toLowerCase();
              const valueLower = value.toLowerCase();
              if (valueLower.includes(searchLower)) return 1;
              return 0;
            }}>
              <CommandInput placeholder="Search state by name..." className="h-12 text-base" />
              <CommandList className="max-h-[400px]">
                <CommandEmpty>No state found. Try searching by name.</CommandEmpty>
                <CommandGroup>
                  {usStates.map((state) => (
                    <CommandItem
                      key={state.code}
                      value={`${state.name} ${state.code}`}
                      onSelect={() => {
                        onStateChange(state.code === stateValue ? '' : state.code);
                        setStateOpen(false);
                      }}
                      className="h-12 px-3 py-2.5 cursor-pointer hover:bg-accent/50"
                    >
                      <Check
                        className={cn(
                          'mr-3 h-4 w-4 shrink-0',
                          stateValue === state.code ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="text-base">{state.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
