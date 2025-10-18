'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useTranslations } from 'next-intl';
import type { TrafficData } from '@/lib/types/traffic';

interface TrafficChartProps {
  data: TrafficData[];
  height?: number;
  showGrid?: boolean;
}

export function TrafficChart({ data, height = 300, showGrid = true }: TrafficChartProps) {
  const t = useTranslations('dashboard.traffic.tooltip');
  
  // Format data for recharts
  const chartData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM dd'),
    shortDate: format(parseISO(item.date), 'MM/dd'),
  }));

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="shortDate"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            width={40}
          />
          
          {showGrid && (
            <defs>
              <pattern id="grid" width="100%" height="100%" patternUnits="userSpaceOnUse">
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
          )}
          
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-popover border border-border rounded-lg shadow-md p-3">
                    <p className="font-medium text-sm mb-2">
                      {format(parseISO(data.date), 'EEEE, MMM dd, yyyy')}
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-muted-foreground">{t('visits')}</span>
                        <span className="font-medium">{data.visits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-muted-foreground">{t('uniqueVisitors')}</span>
                        <span className="font-medium">{data.uniqueVisitors.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-muted-foreground">{t('pageViews')}</span>
                        <span className="font-medium">{data.pageViews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-muted-foreground">{t('bounceRate')}</span>
                        <span className="font-medium">{data.bounceRate}%</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          
          <Area
            type="monotone"
            dataKey="visits"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fill="url(#colorVisits)"
            activeDot={{
              r: 4,
              fill: 'hsl(var(--primary))',
              stroke: 'hsl(var(--background))',
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
