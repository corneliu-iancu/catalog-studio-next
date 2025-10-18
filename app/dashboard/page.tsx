'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EmptyState } from '@/components/dashboard/empty-state';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { useMenu } from '@/lib/contexts/menu-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrafficWidget } from '@/components/dashboard/traffic/traffic-widget';
import { CompactStatsGrid } from '@/components/dashboard/stats/compact-stats-grid';
import { QuickActionsGrid } from '@/components/dashboard/actions/quick-actions-grid';

function DashboardContent() {
  const { selectedRestaurant, hasRestaurants, isLoading } = useRestaurant();
  const { selectedMenu } = useMenu();
  const t = useTranslations('dashboard');
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalItems: 0,
    activeCategories: 0,
    menuViews: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const supabase = createClient();

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    if (!selectedRestaurant || !selectedMenu) {
      setStats({
        totalCategories: 0,
        totalItems: 0,
        activeCategories: 0,
        menuViews: 0
      });
      setStatsLoading(false);
      return;
    }

    try {
      setStatsLoading(true);

      // Fetch categories with item counts through the junction table
      const { data: categories, error } = await supabase
        .from('categories')
        .select(`
          *,
          category_products(count)
        `)
        .eq('menu_id', selectedMenu.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Calculate item counts for each category
      const categoriesWithCounts = (categories || []).map(category => ({
        ...category,
        item_count: category.category_products?.[0]?.count || 0
      }));

      // Calculate stats
      const totalCategories = categoriesWithCounts.length;
      const activeCategories = categoriesWithCounts.filter(c => c.is_active).length;
      const totalItems = categoriesWithCounts.reduce((sum, c) => sum + (c.item_count || 0), 0);

      setStats({
        totalCategories,
        activeCategories,
        totalItems,
        menuViews: 0 // TODO: Implement menu views tracking
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({
        totalCategories: 0,
        totalItems: 0,
        activeCategories: 0,
        menuViews: 0
      });
    } finally {
      setStatsLoading(false);
    }
  }, [selectedRestaurant, selectedMenu, supabase]);

  // Fetch stats when component mounts or dependencies change
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!hasRestaurants) {
    return <EmptyState />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('welcome', { restaurantName: selectedRestaurant?.name || '' })}
        </p>
      </div>

      {/* Restaurant Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('restaurantOverview.title')}</span>
            <Button variant="outline" size="sm">
              <Store className="mr-2 h-4 w-4" />
              {t('restaurantOverview.editProfile')}
            </Button>
          </CardTitle>
          <CardDescription>
            {t('restaurantOverview.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Restaurant</h3>
              <p className="font-medium mt-1">{selectedRestaurant?.name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Public URL</h3>
              {selectedRestaurant?.slug ? (
                <button
                  onClick={() => window.open(`/${selectedRestaurant.slug}`, '_blank')}
                  className="flex items-center gap-2 font-medium mt-1 text-primary hover:text-primary/80 transition-colors cursor-pointer group"
                >
                  <span>/{selectedRestaurant.slug}</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ) : (
                <p className="font-medium mt-1 text-muted-foreground">{t('restaurantOverview.noUrl')}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Last Updated</h3>
              <p className="font-medium mt-1">
                {selectedRestaurant?.updated_at
                  ? new Date(selectedRestaurant.updated_at).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hero Widget - Traffic Analytics */}
      <TrafficWidget className="w-full" />

      {/* Secondary Widgets - Stats and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compact Stats */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t('overview.restaurantOverview')}</h2>
          <CompactStatsGrid 
            stats={{
              totalItems: stats.totalItems,
              totalCategories: stats.totalCategories,
              activeCategories: stats.activeCategories,
              menuViews: stats.menuViews,
              restaurantCreatedAt: selectedRestaurant?.created_at || '',
            }}
            isLoading={statsLoading}
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">{t('overview.quickActions')}</h2>
          <QuickActionsGrid />
        </div>
      </div>

      
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const tCommon = useTranslations('common');

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{tCommon('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <DashboardContent />
    </DashboardLayout>
  );
}
