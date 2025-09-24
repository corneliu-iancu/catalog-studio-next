'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { useMenu } from './menu-context';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];

interface ItemsContextType {
  items: MenuItem[];
  isLoading: boolean;
  selectedCategoryId: string | null;
  fetchItemsByCategory: (categoryId: string) => Promise<void>;
  createItem: (categoryId: string, name: string) => Promise<void>;
  deleteItem: (itemId: string, categoryId: string) => Promise<void>;
  refreshItems: () => Promise<void>;
  selectCategory: (categoryId: string) => void;
  getItemCount: (categoryId: string) => number;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [itemsCache, setItemsCache] = useState<Record<string, MenuItem[]>>({});
  
  const { selectedMenu } = useMenu();
  const supabase = createClient();

  const fetchItemsByCategory = useCallback(async (categoryId: string, forceRefresh = false) => {
    if (!categoryId) return;

    // Check cache first (unless force refresh)
    if (!forceRefresh && itemsCache[categoryId]) {
      setItems(itemsCache[categoryId]);
      setSelectedCategoryId(categoryId);
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('category_menu_items')
        .select(`
          menu_item_id,
          sort_order,
          menu_items (
            id,
            name,
            description,
            price,
            image_url,
            is_active,
            created_at,
            updated_at
          )
        `)
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const menuItems = data?.map((item: any) => item.menu_items) || [];
      
      // Update cache
      setItemsCache(prev => ({
        ...prev,
        [categoryId]: menuItems
      }));
      
      setItems(menuItems);
      setSelectedCategoryId(categoryId);

    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const createItem = useCallback(async (categoryId: string, name: string) => {
    if (!categoryId || !name.trim()) return;

    try {
      setIsLoading(true);

      // Get next sort order for the category
      const { data: existingItems } = await supabase
        .from('category_menu_items')
        .select('sort_order')
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextSortOrder = existingItems?.[0]?.sort_order ? existingItems[0].sort_order + 1 : 1;

      // Create the menu item with required fields
      // For now, let's use a simpler approach and create via API route
      const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug,
          description: 'No description yet',
          price: 0,
          categoryId: categoryId,
          sortOrder: nextSortOrder
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create item');
      }

      // Clear cache for this category to force refresh
      setItemsCache(prev => {
        const newCache = { ...prev };
        delete newCache[categoryId];
        return newCache;
      });

      // Force refresh items for this category to get the new item
      await fetchItemsByCategory(categoryId, true);

    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const deleteItem = useCallback(async (itemId: string, categoryId: string) => {
    if (!itemId || !categoryId) return;

    try {
      setIsLoading(true);

      const response = await fetch(`/api/menu-items?id=${itemId}&categoryId=${categoryId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete item');
      }

      // Force refresh items for this category
      await fetchItemsByCategory(categoryId, true);

    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const refreshItems = useCallback(async () => {
    if (selectedCategoryId) {
      // Clear cache for current category and refetch
      setItemsCache(prev => {
        const updated = { ...prev };
        delete updated[selectedCategoryId];
        return updated;
      });
      await fetchItemsByCategory(selectedCategoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  const selectCategory = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    fetchItemsByCategory(categoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getItemCount = useCallback((categoryId: string) => {
    return itemsCache[categoryId]?.length || 0;
  }, [itemsCache]);

  // Clear cache when menu changes
  useEffect(() => {
    setItemsCache({});
    setItems([]);
    setSelectedCategoryId(null);
  }, [selectedMenu]);

  const value: ItemsContextType = {
    items,
    isLoading,
    selectedCategoryId,
    fetchItemsByCategory,
    createItem,
    deleteItem,
    refreshItems,
    selectCategory,
    getItemCount
  };

  return (
    <ItemsContext.Provider value={value}>
      {children}
    </ItemsContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItems must be used within an ItemsProvider');
  }
  return context;
}
