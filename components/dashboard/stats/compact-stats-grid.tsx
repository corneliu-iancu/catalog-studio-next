'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Store, Eye, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface StatsData {
  totalItems: number;
  totalCategories: number;
  activeCategories: number;
  menuViews: number;
  restaurantCreatedAt: string;
}

interface CompactStatsGridProps {
  stats: StatsData;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  isLoading?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="h-24">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              <div className="h-4 w-8 bg-muted animate-pulse rounded" />
            </div>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-24 hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-lg font-bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CompactStatsGrid({ stats, isLoading }: CompactStatsGridProps) {
  const t = useTranslations('dashboard.stats.compact');
  
  const formattedCreatedDate = stats.restaurantCreatedAt
    ? new Date(stats.restaurantCreatedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      })
    : 'N/A';

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        title={t('menuItems')}
        value={stats.totalItems}
        icon={UtensilsCrossed}
        isLoading={isLoading}
      />
      
      <StatCard
        title={t('categories')}
        value={stats.totalCategories}
        subtitle={t('activeCount', { count: stats.activeCategories })}
        icon={Store}
        isLoading={isLoading}
      />
      
      <StatCard
        title={t('menuViews')}
        value={stats.menuViews}
        subtitle={t('thisMonth')}
        icon={Eye}
        isLoading={isLoading}
      />
      
      <StatCard
        title={t('activeSince')}
        value={formattedCreatedDate}
        subtitle={t('restaurantCreated')}
        icon={Calendar}
        isLoading={isLoading}
      />
    </div>
  );
}
