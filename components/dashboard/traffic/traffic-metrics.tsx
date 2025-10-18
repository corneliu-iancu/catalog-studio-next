'use client';

import { TrendingUp, TrendingDown, Eye, Users, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { TrafficMetrics } from '@/lib/types/traffic';

interface TrafficMetricsProps {
  metrics: TrafficMetrics;
  isLoading?: boolean;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="h-6 w-12 bg-muted animate-pulse rounded" />
        <div className="h-3 w-20 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      
      <div className="space-y-1">
        <p className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        
        {(subtitle || trend) && (
          <div className="flex items-center justify-between">
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            
            {trend && (
              <div className={`flex items-center text-xs ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function TrafficMetrics({ metrics, isLoading }: TrafficMetricsProps) {
  const t = useTranslations('dashboard.traffic.metrics');
  
  const trendData = metrics.percentChange !== 0 ? {
    value: Math.abs(metrics.percentChange),
    isPositive: metrics.percentChange > 0,
  } : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        title={t('todayVisits')}
        value={metrics.todayVisits}
        icon={Eye}
        isLoading={isLoading}
      />
      
      <MetricCard
        title={t('weeklyAverage')}
        value={metrics.weeklyAverage}
        subtitle={t('visitsPerDay')}
        icon={Calendar}
        trend={trendData}
        isLoading={isLoading}
      />
      
      <MetricCard
        title={t('uniqueVisitors')}
        value={metrics.totalUniqueVisitors}
        subtitle={t('thisMonth')}
        icon={Users}
        isLoading={isLoading}
      />
    </div>
  );
}
