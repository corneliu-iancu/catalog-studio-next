import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

// Define supported locales
export const locales = ['ro', 'en'] as const;
export const defaultLocale = 'ro' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  // Get locale from cookie
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  
  let locale: Locale = defaultLocale;
  if (localeCookie && locales.includes(localeCookie as Locale)) {
    locale = localeCookie as Locale;
  }

  console.log('[i18n] Cookie value:', localeCookie, '| Selected locale:', locale);

  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    
    return {
      locale,
      messages,
      timeZone: 'Europe/Bucharest',
      now: new Date()
    };
  } catch (error) {
    console.error('[i18n] Error loading messages:', error);
    // Fallback to default locale if there's an error
    const messages = (await import(`./messages/${defaultLocale}.json`)).default;
    return {
      locale: defaultLocale,
      messages,
      timeZone: 'Europe/Bucharest',
      now: new Date()
    };
  }
});


