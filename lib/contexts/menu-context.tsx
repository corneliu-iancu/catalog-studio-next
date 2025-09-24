'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { useRestaurant } from './restaurant-context';

type Menu = Database['public']['Tables']['menus']['Row'];

interface MenuContextType {
  menus: Menu[];
  selectedMenu: Menu | null;
  isLoading: boolean;
  error: string | null;
  selectMenu: (menu: Menu) => void;
  refreshMenus: () => Promise<void>;
  hasMenus: boolean;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRestaurant } = useRestaurant();
  const supabase = createClient();

  const fetchMenus = useCallback(async () => {
    if (!selectedRestaurant) {
      setMenus([]);
      setSelectedMenu(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('restaurant_id', selectedRestaurant.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      setMenus(data || []);

      // Auto-select menu logic
      if (data && data.length > 0) {
        // Try to restore from localStorage
        const savedMenuId = localStorage.getItem(`selectedMenuId_${selectedRestaurant.id}`);
        const savedMenu = data.find(menu => menu.id === savedMenuId);
        
        if (savedMenu) {
          setSelectedMenu(savedMenu);
        } else {
          // Default to the default menu or first menu
          const defaultMenu = data.find(menu => menu.is_default) || data[0];
          setSelectedMenu(defaultMenu);
          localStorage.setItem(`selectedMenuId_${selectedRestaurant.id}`, defaultMenu.id);
        }
      } else {
        setSelectedMenu(null);
        localStorage.removeItem(`selectedMenuId_${selectedRestaurant.id}`);
      }

    } catch (error) {
      console.error('Error fetching menus:', error);
      setError('Failed to load menus');
      setMenus([]);
      setSelectedMenu(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedRestaurant, supabase]);

  const selectMenu = (menu: Menu) => {
    setSelectedMenu(menu);
    if (selectedRestaurant) {
      localStorage.setItem(`selectedMenuId_${selectedRestaurant.id}`, menu.id);
    }
  };

  const refreshMenus = async () => {
    await fetchMenus();
  };

  // Fetch menus when restaurant changes
  useEffect(() => {
    fetchMenus();
  }, [selectedRestaurant, fetchMenus]);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setMenus([]);
        setSelectedMenu(null);
        if (selectedRestaurant) {
          localStorage.removeItem(`selectedMenuId_${selectedRestaurant.id}`);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [selectedRestaurant, supabase.auth]);

  const value: MenuContextType = {
    menus,
    selectedMenu,
    isLoading,
    error,
    selectMenu,
    refreshMenus,
    hasMenus: menus.length > 0,
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
