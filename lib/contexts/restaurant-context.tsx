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

  // Initialize selected restaurant from localStorage on mount
  const initializeSelectedRestaurant = () => {
    if (typeof window !== 'undefined') {
      const storedRestaurantId = localStorage.getItem('selectedRestaurantId');
      if (storedRestaurantId) {
        // We'll set this properly when restaurants are fetched
        // This is just to indicate we have a stored preference
        return storedRestaurantId;
      }
    }
    return null;
  };

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

      // First, try to restore from localStorage
      const storedRestaurantId = localStorage.getItem('selectedRestaurantId');
      let restaurantToSelect: Restaurant | null = null;

      if (storedRestaurantId && data) {
        const storedRestaurant = data.find(r => r.id === storedRestaurantId);
        if (storedRestaurant) {
          restaurantToSelect = storedRestaurant;
        }
      }

      // If no stored restaurant found or stored restaurant doesn't exist, auto-select first restaurant
      if (!restaurantToSelect && data && data.length > 0) {
        restaurantToSelect = data[0];
        // Store the auto-selected restaurant in localStorage
        localStorage.setItem('selectedRestaurantId', data[0].id);
      }

      // Set the selected restaurant (either restored or auto-selected)
      if (restaurantToSelect) {
        setSelectedRestaurant(restaurantToSelect);
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

  // Initialize on mount
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // Additional effect to handle browser navigation/refresh
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedRestaurantId' && e.newValue) {
        // Find the restaurant with the new ID and select it
        const restaurant = restaurants.find(r => r.id === e.newValue);
        if (restaurant) {
          setSelectedRestaurant(restaurant);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [restaurants]);

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
