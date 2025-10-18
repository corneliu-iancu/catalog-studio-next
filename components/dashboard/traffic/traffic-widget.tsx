'use client';

import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrafficChart } from './traffic-chart';
import { TrafficMetrics } from './traffic-metrics';
import { useTrafficData } from '@/lib/hooks/use-traffic-data';
import { useTranslations } from 'next-intl';

interface TrafficWidgetProps {
  className?: string;
}

export function TrafficWidget({ className }: TrafficWidgetProps) {
  const { data, metrics, isLoading, error, refreshData } = useTrafficData();
  const t = useTranslations('dashboard.traffic');

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('errorMessage')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('tryAgain')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Traffic Analytics</CardTitle>
            <CardDescription>
              Daily visits and engagement metrics for the last 30 days
            </CardDescription>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <TrafficMetrics metrics={metrics} isLoading={isLoading} />
        
        {/* Chart */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Daily Visits Trend</h3>
          {isLoading ? (
            <div className="h-80 bg-muted animate-pulse rounded-md flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            </div>
          ) : (
            <TrafficChart data={data} height={320} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
