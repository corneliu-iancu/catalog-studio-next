'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Home,
  Palette,
  QrCode,
  Settings,
  Store,
  UtensilsCrossed,
  Upload,
} from 'lucide-react';
import { useRestaurant } from '@/lib/contexts/restaurant-context';

// Navigation items with translation keys
const getNavigation = (t: any) => [
  {
    nameKey: 'overview',
    href: '/dashboard',
    icon: Home,
    descriptionKey: 'descriptions.overview',
  },
  {
    nameKey: 'restaurantProfile',
    href: '/dashboard/restaurant',
    icon: Store,
    descriptionKey: 'descriptions.restaurantProfile',
  },
  {
    nameKey: 'menuManagement',
    href: '/dashboard/menu',
    icon: UtensilsCrossed,
    descriptionKey: 'descriptions.menuManagement',
  },
  {
    nameKey: 'menuTemplate',
    href: '/dashboard/template',
    icon: Palette,
    descriptionKey: 'descriptions.menuTemplate',
  },
  {
    nameKey: 'sharingQr',
    href: '/dashboard/sharing',
    icon: QrCode,
    descriptionKey: 'descriptions.sharingQr',
  },
  {
    nameKey: 'analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    descriptionKey: 'descriptions.analytics',
    disabled: true, // Not implemented yet
  },
  {
    nameKey: 'settings',
    href: '/dashboard/settings',
    icon: Settings,
    descriptionKey: 'descriptions.settings',
    requiresRestaurant: false, // This page doesn't require a restaurant
  },
  {
    nameKey: 'imageUploadDemo',
    href: '/dashboard/image-upload-demo',
    icon: Upload,
    descriptionKey: 'descriptions.imageUploadDemo',
    requiresRestaurant: false, // Demo page doesn't require a restaurant
  },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { hasRestaurants, selectedRestaurant } = useRestaurant();
  const t = useTranslations('navigation');

  // Determine if navigation items should be disabled
  const isDisabled = !hasRestaurants || !selectedRestaurant;
  
  // Get navigation items with translations
  const navigation = getNavigation(t);

  return (
    <div className={cn('flex h-full w-64 flex-col bg-muted/10', className)}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            // Item is disabled if it requires a restaurant and user doesn't have one
            const itemDisabled = (item.requiresRestaurant !== false && isDisabled) && item.href !== '/dashboard';
            
            return (
              <Link
                key={item.nameKey}
                href={itemDisabled ? '#' : item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : itemDisabled
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-foreground hover:bg-muted hover:text-foreground',
                  item.disabled && 'opacity-50 cursor-not-allowed'
                )}
                onClick={(e) => {
                  if (itemDisabled || item.disabled) {
                    e.preventDefault();
                  }
                }}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive
                      ? 'text-primary-foreground'
                      : itemDisabled
                      ? 'text-muted-foreground'
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span>{item.nameKey === 'imageUploadDemo' ? 'Image Upload Demo' : t(item.nameKey)}</span>
                    {item.disabled && (
                      <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                        {t('soon')}
                      </span>
                    )}
                  </div>
                  {!isActive && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {item.nameKey === 'imageUploadDemo' ? 'Test image upload component' : t(item.descriptionKey)}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* No Restaurant Notice */}
        {isDisabled && (
          <div className="mx-2 mt-4 p-3 bg-muted rounded-lg border border-dashed">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Store className="h-4 w-4" />
              <span>{t('createRestaurant')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
