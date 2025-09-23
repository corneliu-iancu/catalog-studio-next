'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantContextType {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  selectRestaurant: (restaurant: Restaurant) => void;
  refreshRestaurants: () => Promise<void>;
  hasRestaurants: boolean;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRestaurants([]);
        setSelectedRestaurant(null);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setRestaurants(data || []);

      // Auto-select first restaurant if none selected and restaurants exist
      if (data && data.length > 0 && !selectedRestaurant) {
        setSelectedRestaurant(data[0]);
        // Store in localStorage for persistence
        localStorage.setItem('selectedRestaurantId', data[0].id);
      }

      // If we have a stored restaurant ID, try to select it
      const storedRestaurantId = localStorage.getItem('selectedRestaurantId');
      if (storedRestaurantId && data) {
        const storedRestaurant = data.find(r => r.id === storedRestaurantId);
        if (storedRestaurant) {
          setSelectedRestaurant(storedRestaurant);
        }
      }

    } catch (err) {
      console.error('Error fetching restaurants:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
    } finally {
      setIsLoading(false);
    }
  };

  const selectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    localStorage.setItem('selectedRestaurantId', restaurant.id);
  };

  const refreshRestaurants = async () => {
    await fetchRestaurants();
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        fetchRestaurants();
      } else if (event === 'SIGNED_OUT') {
        setRestaurants([]);
        setSelectedRestaurant(null);
        localStorage.removeItem('selectedRestaurantId');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value: RestaurantContextType = {
    restaurants,
    selectedRestaurant,
    isLoading,
    error,
    selectRestaurant,
    refreshRestaurants,
    hasRestaurants: restaurants.length > 0,
  };

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
