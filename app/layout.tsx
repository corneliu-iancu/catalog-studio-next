import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Dancing_Script } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Toaster } from "sonner";
import { LanguageProvider } from "@/lib/contexts/language-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Elegant serif font for Urban template
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

// Script/handwritten font for Urban template item names
const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Generate metadata dynamically based on locale
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('home');
  
  return {
    title: `${t('footer.brand.name')} - ${t('hero.title')}`,
    description: t('hero.subtitle'),
  };
}

// Force dynamic rendering to pick up cookie changes
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ro';
  
  console.log('[Layout] Current locale:', locale, '| Messages keys:', Object.keys(messages).slice(0, 5));
  
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${dancingScript.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
