'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { useMenu } from './menu-context';

type MenuItem = Database['public']['Tables']['products']['Row'];

interface CreateItemData {
  name: string;
  description?: string;
  price?: number;
  discountPrice?: number;
  ingredients?: string[];
  allergens?: string[];
  spiceLevel?: string;
  isActive?: boolean;
  isFeatured?: boolean;
}

interface ItemsContextType {
  items: MenuItem[];
  isLoading: boolean;
  selectedCategoryId: string | null;
  fetchItemsByCategory: (categoryId: string, forceRefresh?: boolean) => Promise<void>;
  createItem: (categoryId: string, itemData: CreateItemData) => Promise<void>;
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
  
  // Use ref to access current cache without adding to dependencies
  const itemsCacheRef = useRef<Record<string, MenuItem[]>>({});
  
  // Track previous menu to detect actual changes vs initialization
  const previousMenuRef = useRef<string | null>(null);
  
  // Keep ref in sync with state
  useEffect(() => {
    itemsCacheRef.current = itemsCache;
  }, [itemsCache]);
  
  const { selectedMenu } = useMenu();
  const supabase = createClient();

  const fetchItemsByCategory = useCallback(async (categoryId: string, forceRefresh = false) => {
    if (!categoryId) {
      console.warn('fetchItemsByCategory called with empty categoryId');
      return;
    }

    // Check cache first using ref (unless force refresh)
    if (!forceRefresh && itemsCacheRef.current[categoryId]) {
      console.log(`Loading items from cache for category: ${categoryId}`);
      setItems(itemsCacheRef.current[categoryId]);
      setSelectedCategoryId(categoryId);
      return;
    }

    try {
      setIsLoading(true);
      console.log(`Fetching items for category: ${categoryId}, forceRefresh: ${forceRefresh}`);

      const { data, error } = await supabase
        .from('category_products')
        .select(`
          product_id,
          sort_order,
          products (
            id,
            name,
            description,
            price,
            discount_price,
            ingredients,
            allergens,
            spice_level,
            is_active,
            is_featured,
            created_at,
            updated_at,
            product_images (
              id,
              s3_key,
              alt_text,
              display_order,
              is_primary,
              width,
              height
            )
          )
        `)
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Supabase error fetching items:', error);
        throw error;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const menuItems = data?.map((item: any) => item.products).filter(Boolean) || [];

      console.log(`Fetched ${menuItems.length} items for category ${categoryId}`);

      // Update cache
      setItemsCache(prev => ({
        ...prev,
        [categoryId]: menuItems
      }));

      console.log('Setting items in state:', menuItems.length);
      setItems(menuItems);
      setSelectedCategoryId(categoryId);

    } catch (error) {
      console.error('Error fetching items for category:', categoryId, error);
      // Don't clear items if we're just refreshing - keep existing items
      if (!forceRefresh) {
        setItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [supabase]); // Only supabase in dependencies

  const createItem = useCallback(async (categoryId: string, itemData: {
    name: string;
    description?: string;
    price?: number;
    discountPrice?: number;
    ingredients?: string[];
    allergens?: string[];
    spiceLevel?: string;
    isActive?: boolean;
    isFeatured?: boolean;
  }) => {
    if (!categoryId || !itemData.name.trim()) return;

    try {
      setIsLoading(true);

      // Get next sort order for the category
      const { data: existingItems } = await supabase
        .from('category_products')
        .select('sort_order')
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextSortOrder = existingItems?.[0]?.sort_order ? existingItems[0].sort_order + 1 : 1;

      // Create slug from name
      const slug = itemData.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const response = await fetch('/api/menu-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemData.name.trim(),
          slug: slug,
          description: itemData.description || '',
          price: itemData.price || 0,
          discountPrice: itemData.discountPrice || null,
          ingredients: itemData.ingredients || [],
          allergens: itemData.allergens || [],
          spiceLevel: itemData.spiceLevel || null,
          isActive: itemData.isActive !== false, // Default to true
          isFeatured: itemData.isFeatured || false,
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
    if (!categoryId) {
      console.warn('selectCategory called with empty categoryId');
      return;
    }
    console.log(`Selecting category: ${categoryId}`);
    setSelectedCategoryId(categoryId);
    fetchItemsByCategory(categoryId);
  }, [fetchItemsByCategory]);

  const getItemCount = useCallback((categoryId: string) => {
    return itemsCacheRef.current[categoryId]?.length || 0;
  }, []);

  // Clear cache when menu actually changes (not just initializes)
  useEffect(() => {
    const currentMenuId = selectedMenu?.id || null;
    const previousMenuId = previousMenuRef.current;
    
    // Only clear if menu actually changed (not null -> menu initialization)
    if (previousMenuId !== null && previousMenuId !== currentMenuId) {
      console.log('Menu changed, clearing items cache. Previous:', previousMenuId, 'Current:', currentMenuId);
      setItemsCache({});
      itemsCacheRef.current = {}; // Clear ref as well
      setItems([]);
      setSelectedCategoryId(null);
      setIsLoading(false);
    } else if (previousMenuId === null && currentMenuId !== null) {
      console.log('Menu initialized for first time:', currentMenuId, '- not clearing items');
    }
    
    // Update ref to track previous menu
    previousMenuRef.current = currentMenuId;
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
