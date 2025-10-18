'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Shield, BarChart3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { giveAnalyticsConsent, revokeAnalyticsConsent } from '@/lib/analytics/menu-tracker';

export function AnalyticsConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations('analytics.consent');

  useEffect(() => {
    // Check if consent has already been given
    const consent = getCookie('analytics_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    setIsLoading(true);
    giveAnalyticsConsent();
    setIsVisible(false);
    setIsLoading(false);
  };

  const handleDecline = async () => {
    setIsLoading(true);
    revokeAnalyticsConsent();
    setIsVisible(false);
    setIsLoading(false);
  };

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-6 sm:right-6 lg:left-auto lg:right-6 lg:max-w-md">
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-sm mb-1 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  {t('title')}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t('description')}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleAccept}
                  disabled={isLoading}
                  className="flex-1 h-8 text-xs"
                >
                  {isLoading ? t('processing') : t('accept')}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleDecline}
                  disabled={isLoading}
                  className="flex-1 h-8 text-xs"
                >
                  {t('decline')}
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <a 
                  href="/privacy" 
                  target="_blank" 
                  className="underline hover:no-underline"
                >
                  {t('privacyPolicy')}
                </a>
              </div>
            </div>
            
            <button
              onClick={handleDecline}
              className="flex-shrink-0 p-1 hover:bg-muted rounded-full transition-colors"
              aria-label={t('close')}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
