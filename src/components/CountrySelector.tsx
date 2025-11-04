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
            className="min-w-[140px] justify-between h-11 bg-background"
          >
            <MapPin className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {value === 'EU'
                ? 'European Union'
                : selectedCountry
                ? selectedCountry.name
                : 'Country'}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              {/* Top-level special options */}
              <CommandGroup heading="Popular">
                {specialOptions.map((opt) => (
                  <CommandItem
                    key={opt.code}
                    value={opt.code}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? '' : currentValue);
                      if (currentValue !== 'US') {
                        onStateChange('');
                      }
                      setOpen(false);
                    }}
                    className="h-11"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === opt.code ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="mr-2">{opt.flag}</span>
                    {opt.name}
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* European countries */}
              <CommandGroup heading="Europe">
                {countries
                  .filter((c) => c.code !== 'US')
                  .map((country) => (
                    <CommandItem
                      key={country.code}
                      value={country.code}
                      onSelect={(currentValue) => {
                        onChange(currentValue === value ? '' : currentValue);
                        if (currentValue !== 'US') {
                          onStateChange('');
                        }
                        setOpen(false);
                      }}
                      className="h-11"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === country.code ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      <span className="mr-2">{codeToFlag(country.code)}</span>
                      {country.name}
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
              className="min-w-[160px] justify-between h-11 bg-background"
            >
              <span className="truncate">
                {selectedState ? selectedState.name : 'Select state'}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search state..." />
              <CommandList>
                <CommandEmpty>No state found.</CommandEmpty>
                <CommandGroup>
                  {usStates.map((state) => (
                    <CommandItem
                      key={state.code}
                      value={state.code}
                      onSelect={(currentValue) => {
                        onStateChange(currentValue === stateValue ? '' : currentValue);
                        setStateOpen(false);
                      }}
                      className="h-11"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          stateValue === state.code ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {state.name}
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
