import { subDays, format } from 'date-fns';
import type { TrafficData } from '@/lib/types/traffic';

/**
 * Generates realistic mock traffic data for the last N days
 */
export function generateMockTrafficData(days: number = 30): TrafficData[] {
  const data: TrafficData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Generate realistic traffic patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base traffic with weekend variations
    let baseVisits = isWeekend ? 25 + Math.random() * 35 : 40 + Math.random() * 45;
    
    // Add some growth trend over time (slightly increasing)
    const growthFactor = 1 + (days - i) * 0.002;
    baseVisits *= growthFactor;
    
    // Add some random spikes (10% chance of higher traffic)
    if (Math.random() < 0.1) {
      baseVisits *= 1.5 + Math.random() * 0.8;
    }
    
    const visits = Math.round(baseVisits);
    const uniqueVisitors = Math.round(visits * (0.7 + Math.random() * 0.2)); // 70-90% of visits
    const pageViews = Math.round(visits * (2.1 + Math.random() * 1.4)); // 2.1-3.5 pages per visit
    const bounceRate = Math.round(35 + Math.random() * 30); // 35-65% bounce rate
    
    data.push({
      date: dateStr,
      visits,
      uniqueVisitors,
      pageViews,
      bounceRate,
    });
  }

  return data;
}

/**
 * Calculate traffic metrics from data array
 */
export function calculateTrafficMetrics(data: TrafficData[]) {
  if (data.length === 0) {
    return {
      todayVisits: 0,
      weeklyAverage: 0,
      monthlyTotal: 0,
      percentChange: 0,
      totalUniqueVisitors: 0,
    };
  }

  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Today's visits (last data point)
  const todayVisits = sortedData[sortedData.length - 1]?.visits || 0;
  
  // Monthly total
  const monthlyTotal = sortedData.reduce((sum, day) => sum + day.visits, 0);
  
  // Weekly average (last 7 days)
  const lastWeekData = sortedData.slice(-7);
  const weeklyTotal = lastWeekData.reduce((sum, day) => sum + day.visits, 0);
  const weeklyAverage = Math.round(weeklyTotal / Math.max(lastWeekData.length, 1));
  
  // Previous week for comparison
  const previousWeekData = sortedData.slice(-14, -7);
  const previousWeekTotal = previousWeekData.reduce((sum, day) => sum + day.visits, 0);
  const previousWeekAverage = previousWeekTotal / Math.max(previousWeekData.length, 1);
  
  // Percent change (week over week)
  const percentChange = previousWeekAverage > 0 
    ? Math.round(((weeklyAverage - previousWeekAverage) / previousWeekAverage) * 100)
    : 0;
  
  // Total unique visitors
  const totalUniqueVisitors = sortedData.reduce((sum, day) => sum + day.uniqueVisitors, 0);

  return {
    todayVisits,
    weeklyAverage,
    monthlyTotal,
    percentChange,
    totalUniqueVisitors,
  };
}
