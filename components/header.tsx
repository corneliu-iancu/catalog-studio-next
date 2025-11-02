'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { APP_CONFIG } from "@/lib/config";

interface HeaderProps {
  currentLocale: string;
}

export function Header({ currentLocale }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-chart-1 to-chart-2 font-bold text-sm transition-transform group-hover:scale-105">
              CS
            </div>
            <span className="text-xl font-bold tracking-tight">{APP_CONFIG.APP_NAME}</span>
          </Link>

          {/* Right side: Language Switcher + Auth Buttons */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLocale={currentLocale} />
            
            <div className="hidden sm:flex items-center gap-2 ml-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

