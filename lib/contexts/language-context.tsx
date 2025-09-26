'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type Locale = 'en' | 'es' | 'fr' | 'ro';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, any>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
}

const supportedLocales: Locale[] = ['en', 'es', 'fr', 'ro'];

async function loadMessages(locale: Locale) {
  try {
    const messages = await import(`../../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.warn(`Failed to load messages for locale: ${locale}, falling back to en`);
    const fallback = await import(`../../messages/en.json`);
    return fallback.default;
  }
}

export function LanguageProvider({ children, initialLocale = 'en' }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load messages when locale changes
  useEffect(() => {
    let isMounted = true;
    
    async function loadLocaleMessages() {
      setIsLoading(true);
      try {
        const newMessages = await loadMessages(locale);
        if (isMounted) {
          setMessages(newMessages);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadLocaleMessages();
    
    return () => {
      isMounted = false;
    };
  }, [locale]);

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-locale') as Locale;
    if (savedLocale && supportedLocales.includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (supportedLocales.includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem('preferred-locale', newLocale);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, messages }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
