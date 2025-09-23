'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Home,
  Menu,
  Palette,
  QrCode,
  Settings,
  Store,
  UtensilsCrossed,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRestaurant } from '@/lib/contexts/restaurant-context';

const navigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: Home,
    description: 'Dashboard overview and quick actions',
  },
  {
    name: 'Restaurant Profile',
    href: '/dashboard/restaurant',
    icon: Store,
    description: 'Manage restaurant information and settings',
  },
  {
    name: 'Menu Management',
    href: '/dashboard/menu',
    icon: UtensilsCrossed,
    description: 'Create and manage your menu items',
  },
  {
    name: 'Customization',
    href: '/dashboard/customization',
    icon: Palette,
    description: 'Customize your catalog appearance',
  },
  {
    name: 'Sharing & QR',
    href: '/dashboard/sharing',
    icon: QrCode,
    description: 'Generate QR codes and sharing links',
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    description: 'View performance and insights',
    disabled: true, // Not implemented yet
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Account and restaurant settings',
  },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { hasRestaurants, selectedRestaurant } = useRestaurant();

  // Determine if navigation items should be disabled
  const isDisabled = !hasRestaurants || !selectedRestaurant;

  return (
    <div className={cn('flex h-full w-64 flex-col bg-muted/10', className)}>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const itemDisabled = isDisabled && item.href !== '/dashboard';
            
            return (
              <Link
                key={item.name}
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
                    <span>{item.name}</span>
                    {item.disabled && (
                      <span className="text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded">
                        Soon
                      </span>
                    )}
                  </div>
                  {!isActive && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {item.description}
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
              <span>Create a restaurant to access all features</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
