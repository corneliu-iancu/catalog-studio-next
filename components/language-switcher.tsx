'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';
import { useState } from 'react';
import { setLocale } from '@/app/actions/locale';

const locales = [
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
] as const;

interface LanguageSwitcherProps {
  currentLocale?: string;
}

export function LanguageSwitcher({ currentLocale = 'ro' }: LanguageSwitcherProps) {
  const [isPending, setIsPending] = useState(false);

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === currentLocale) return; // Don't switch if already on that locale
    
    setIsPending(true);
    
    try {
      // Use server action to set cookie
      await setLocale(newLocale);
      
      // Force full page reload to pick up new translations
      window.location.reload();
    } catch (error) {
      console.error('Failed to change locale:', error);
      setIsPending(false);
    }
  };

  const selectedLocale = locales.find((l) => l.code === currentLocale) || locales[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" disabled={isPending}>
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{isPending ? 'Switching...' : selectedLocale.name}</span>
          <span className="sm:hidden">{selectedLocale.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => handleLocaleChange(loc.code)}
            className={currentLocale === loc.code ? 'bg-accent' : ''}
            disabled={isPending}
          >
            <span className="mr-2">{loc.flag}</span>
            {loc.name}
            {currentLocale === loc.code && ' ✓'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

