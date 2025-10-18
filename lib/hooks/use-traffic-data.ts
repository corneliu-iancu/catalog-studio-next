'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TrafficAnalytics } from '@/lib/types/traffic';
import { generateMockTrafficData, calculateTrafficMetrics } from '@/lib/utils/mock-traffic-data';

/**
 * Hook for managing traffic analytics data
 * Currently uses mock data, but can be extended to fetch real data from API
 */
export function useTrafficData() {
  const [analytics, setAnalytics] = useState<TrafficAnalytics>({
    data: [],
    metrics: {
      todayVisits: 0,
      weeklyAverage: 0,
      monthlyTotal: 0,
      percentChange: 0,
      totalUniqueVisitors: 0,
    },
    isLoading: true,
  });

  const fetchTrafficData = useCallback(async () => {
    try {
      setAnalytics(prev => ({ ...prev, isLoading: true, error: undefined }));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate mock data (replace with real API call later)
      const mockData = generateMockTrafficData(30);
      const metrics = calculateTrafficMetrics(mockData);
      
      setAnalytics({
        data: mockData,
        metrics,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      setAnalytics(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load traffic data',
      }));
    }
  }, []);

  useEffect(() => {
    fetchTrafficData();
  }, [fetchTrafficData]);

  const refreshData = useCallback(() => {
    fetchTrafficData();
  }, [fetchTrafficData]);

  return {
    ...analytics,
    refreshData,
  };
}
