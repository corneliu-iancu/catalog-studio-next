export interface TrafficData {
  date: string;
  visits: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number; // percentage
}

export interface TrafficMetrics {
  todayVisits: number;
  weeklyAverage: number;
  monthlyTotal: number;
  percentChange: number; // week over week percentage change
  totalUniqueVisitors: number;
}

export interface TrafficAnalytics {
  data: TrafficData[];
  metrics: TrafficMetrics;
  isLoading: boolean;
  error?: string;
}
