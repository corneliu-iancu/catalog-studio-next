'use client';

import { RefreshCw, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrafficChart } from './traffic-chart';
import { TrafficMetrics } from './traffic-metrics';
import { useTrafficData } from '@/lib/hooks/use-traffic-data';
import { useTranslations } from 'next-intl';
import { useRestaurant } from '@/lib/contexts/restaurant-context';

interface TrafficWidgetProps {
  className?: string;
}

export function TrafficWidget({ className }: TrafficWidgetProps) {
  const { selectedRestaurant } = useRestaurant();
  const { data, metrics, isLoading, error, refreshData } = useTrafficData(selectedRestaurant?.id);
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
            <CardTitle className="text-xl">{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? t('refreshing') : t('refresh')}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <TrafficMetrics metrics={metrics} isLoading={isLoading} />
        
        {/* Chart */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">{t('chartTitle')}</h3>
          {isLoading ? (
            <div className="h-80 bg-muted animate-pulse rounded-md flex items-center justify-center">
              <p className="text-sm text-muted-foreground">{t('loadingChart')}</p>
            </div>
          ) : data.length < 7 ? (
            <InsufficientDataPlaceholder daysCollected={data.length} />
          ) : (
            <TrafficChart data={data} height={320} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Placeholder component for insufficient data
function InsufficientDataPlaceholder({ daysCollected }: { daysCollected: number }) {
  const t = useTranslations('dashboard.traffic');

  return (
    <div className="h-80 border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center space-y-4 bg-muted/10">
      <div className="flex items-center space-x-2 text-muted-foreground">
        <BarChart3 className="h-8 w-8" />
        <TrendingUp className="h-6 w-6" />
      </div>
      
      <div className="text-center space-y-2 max-w-md">
        <h4 className="font-medium text-foreground">
          {t('insufficientData.title')}
        </h4>
        <p className="text-sm text-muted-foreground">
          {t('insufficientData.description', { 
            daysCollected, 
            daysNeeded: 7 
          })}
        </p>
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground mt-4">
          <Calendar className="h-4 w-4" />
          <span>{t('insufficientData.checkBack')}</span>
        </div>
      </div>
      
      {/* Ghost chart visualization */}
      <div className="w-full max-w-lg h-32 flex items-end justify-center space-x-2 opacity-30">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted-foreground/20 rounded-t-sm animate-pulse"
            style={{
              height: `${20 + Math.random() * 60}%`,
              width: '12%',
              animationDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
