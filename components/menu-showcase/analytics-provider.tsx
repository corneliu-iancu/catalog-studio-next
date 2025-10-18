'use client';

import { useEffect } from 'react';
import { initMenuAnalytics, trackPageView } from '@/lib/analytics/menu-tracker';
import { AnalyticsConsentBanner } from '@/components/analytics/analytics-consent-banner';

interface AnalyticsProviderProps {
  restaurantId: string;
  menuId?: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({ restaurantId, menuId, children }: AnalyticsProviderProps) {
  useEffect(() => {
    // Initialize analytics
    const analytics = initMenuAnalytics();
    
    // Track initial page view
    trackPageView(restaurantId, menuId);
    
    // Track route changes for SPA navigation
    const handleRouteChange = () => {
      trackPageView(restaurantId, menuId);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [restaurantId, menuId]);

  return (
    <>
      {children}
      <AnalyticsConsentBanner />
    </>
  );
}

// HOC for menu items to track views
interface TrackableMenuItemProps {
  itemId: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackableMenuItem({ itemId, children, className }: TrackableMenuItemProps) {
  return (
    <div 
      data-menu-item-id={itemId}
      className={className}
    >
      {children}
    </div>
  );
}

// HOC for categories to track views
interface TrackableCategoryProps {
  categoryId: string;
  children: React.ReactNode;
  className?: string;
}

export function TrackableCategory({ categoryId, children, className }: TrackableCategoryProps) {
  return (
    <div 
      data-category-id={categoryId}
      className={className}
    >
      {children}
    </div>
  );
}
