'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EmptyState } from '@/components/dashboard/empty-state';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { useMenu } from '@/lib/contexts/menu-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  Eye,
  Plus,
  Store,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function DashboardContent({ onCreateRestaurant }: { onCreateRestaurant: () => void }) {
  const { selectedRestaurant, hasRestaurants, isLoading } = useRestaurant();
  const { selectedMenu } = useMenu();
  const t = useTranslations('dashboard');
  const tCommon = useTranslations('common');
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
          category_menu_items(count)
        `)
        .eq('menu_id', selectedMenu.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Calculate item counts for each category
      const categoriesWithCounts = (categories || []).map(category => ({
        ...category,
        item_count: category.category_menu_items?.[0]?.count || 0
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
    return <EmptyState onCreateRestaurant={onCreateRestaurant} />;
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.totalMenuItems')}</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '-' : stats.totalItems}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('stats.fromLastMonth', { count: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.categories')}</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '-' : stats.totalCategories}
            </div>
            <p className="text-xs text-muted-foreground">
              {statsLoading ? '-' : `${stats.activeCategories} ${t('stats.active')}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.menuViews')}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? '-' : stats.menuViews}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('stats.fromLastMonth', { count: 0 })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('stats.activeSince')}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedRestaurant?.created_at
                ? new Date(selectedRestaurant.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {t('stats.restaurantCreated')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              {t('quickActions.addMenuItem')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {t('quickActions.addMenuItemDesc')}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Store className="mr-2 h-4 w-4" />
              {t('quickActions.addCategory')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {t('quickActions.addCategoryDesc')}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              {t('quickActions.manageMenu')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {t('quickActions.manageMenuDesc')}
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t('quickActions.viewPublicMenu')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {t('quickActions.viewPublicMenuDesc')}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Restaurant Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('restaurantOverview.title')}</CardTitle>
            <CardDescription>
              {t('restaurantOverview.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold">{selectedRestaurant?.name}</h3>
              <p className="text-sm text-muted-foreground">
                {t('restaurantOverview.url')} /{selectedRestaurant?.slug}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('restaurantOverview.lastUpdated')} {selectedRestaurant?.updated_at
                  ? new Date(selectedRestaurant.updated_at).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm">
                <Store className="mr-2 h-4 w-4" />
                {t('restaurantOverview.editProfile')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('recentActivity.title')}</CardTitle>
            <CardDescription>
              {t('recentActivity.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{t('recentActivity.restaurantCreated')}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRestaurant?.created_at
                      ? new Date(selectedRestaurant.created_at).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {t('recentActivity.startAdding')}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);
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

  const handleCreateRestaurant = () => {
    setShowCreateRestaurant(true);
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
    <DashboardLayout
      user={user}
      showCreateRestaurant={showCreateRestaurant}
      onCreateRestaurant={handleCreateRestaurant}
      onCloseCreateRestaurant={() => setShowCreateRestaurant(false)}
    >
      <DashboardContent onCreateRestaurant={handleCreateRestaurant} />
    </DashboardLayout>
  );
}
