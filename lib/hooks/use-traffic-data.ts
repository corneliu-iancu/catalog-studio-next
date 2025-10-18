'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TrafficAnalytics } from '@/lib/types/traffic';

/**
 * Hook for managing traffic analytics data from the analytics API
 */
export function useTrafficData(restaurantId?: string) {
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
      
      // Fetch real data from API
      if (!restaurantId) {
        throw new Error('Restaurant ID required');
      }

      const response = await fetch(`/api/analytics/dashboard?restaurantId=${restaurantId}&days=30`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const analyticsData = await response.json();
      
      setAnalytics({
        data: analyticsData.data,
        metrics: analyticsData.metrics,
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
  }, [restaurantId]);

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
