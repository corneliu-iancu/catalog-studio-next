'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { useMenu } from '@/lib/contexts/menu-context';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, ChefHat, Utensils, MoreVertical, Edit, Trash2, Clock, Calendar, Eye } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CreateMenuDialog from '@/components/dashboard/create-menu-dialog';
import { MenuPicker } from '@/components/dashboard/menu-picker';
import Link from 'next/link';

type Menu = Database['public']['Tables']['menus']['Row'];
type Category = Database['public']['Tables']['categories']['Row'] & {
  item_count?: number;
};

function MenuManagementContent() {
  const { selectedRestaurant } = useRestaurant();
  const { selectedMenu, selectMenu, refreshMenus, hasMenus, isLoading: menusLoading } = useMenu();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [recentlyCreatedMenuId, setRecentlyCreatedMenuId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalItems: 0,
    activeCategories: 0
  });

  const supabase = createClient();



  // Fetch categories for the selected menu
  const fetchCategories = useCallback(async () => {
    if (!selectedMenu) {
      setCategories([]);
      setCategoriesLoading(false);
      return;
    }

    try {
      setCategoriesLoading(true);
      // Fetch categories with item counts
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          category_menu_items(count)
        `)
        .eq('menu_id', selectedMenu.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Transform data to include item counts
      const categoriesWithCounts = (data || []).map(category => ({
        ...category,
        item_count: category.category_menu_items?.[0]?.count || 0
      }));

      setCategories(categoriesWithCounts);

      // Calculate stats
      const totalCategories = categoriesWithCounts.length;
      const activeCategories = categoriesWithCounts.filter(c => c.is_active).length;
      const totalItems = categoriesWithCounts.reduce((sum, c) => sum + (c.item_count || 0), 0);

      setStats({
        totalCategories,
        activeCategories,
        totalItems
      });

    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [selectedMenu, supabase]);

  useEffect(() => {
    fetchCategories();
  }, [selectedMenu, fetchCategories]);

  const handleMenuCreated = (newMenu: Menu) => {
    refreshMenus(); // Refresh menus from context
    selectMenu(newMenu); // Select the new menu
    setRecentlyCreatedMenuId(newMenu.id);
    setShowCreateMenu(false);

    // Clear the success message after 10 seconds
    setTimeout(() => {
      setRecentlyCreatedMenuId(null);
    }, 10000);
  };

  if (!selectedRestaurant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <ChefHat className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No Restaurant Selected</h3>
            <p className="text-muted-foreground">Please select a restaurant to manage menus.</p>
          </div>
        </div>
      </div>
    );
  }

  if (menusLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading menus...</p>
        </div>
      </div>
    );
  }

  // Empty state - no menus
  if (!hasMenus) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
            <p className="text-muted-foreground">Create and organize your restaurant menus</p>
          </div>
        </div>

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
            <div className="rounded-full bg-muted p-6">
              <ChefHat className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Create Your First Menu</h3>
              <p className="text-muted-foreground max-w-md">
                Start building your restaurant&apos;s digital menu. You can create different menus for different times of day,
                seasons, or special occasions.
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => setShowCreateMenu(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Create Menu
              </Button>
              <p className="text-sm text-muted-foreground">
                Your first menu will be set as the default menu
              </p>
            </div>
          </CardContent>
        </Card>

        <CreateMenuDialog
          open={showCreateMenu}
          onOpenChange={setShowCreateMenu}
          restaurantId={selectedRestaurant.id}
          onMenuCreated={handleMenuCreated}
          isFirstMenu={true}
        />
      </div>
    );
  }

  // Empty state - menu exists but no categories
  if (selectedMenu && categories.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
            <p className="text-muted-foreground">Organize your menu categories and items</p>
          </div>
          <div className="flex items-center gap-2">
            <MenuPicker />
            <Button onClick={() => setShowCreateMenu(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              New Menu
            </Button>
          </div>
        </div>

        {/* Success message for menu creation */}
        {recentlyCreatedMenuId === selectedMenu?.id && (
          <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                  <ChefHat className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Great! Your &ldquo;{selectedMenu?.name}&rdquo; menu has been created
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Now let&apos;s add some categories to organize your menu items
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRecentlyCreatedMenuId(null)}
                  className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
            <div className="rounded-full bg-muted p-6">
              <Utensils className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Add Your First Category</h3>
              <p className="text-muted-foreground max-w-md">
                Organize your menu items into categories like &ldquo;Appetizers&rdquo;, &ldquo;Main Courses&rdquo;, &ldquo;Desserts&rdquo;, etc.
                This helps customers navigate your menu easily.
              </p>
            </div>
            <div className="space-y-2">
              <Button asChild size="lg">
                <Link href="/dashboard/menu/categories/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                Categories help organize your menu items
              </p>
            </div>
          </CardContent>
        </Card>

        <CreateMenuDialog
          open={showCreateMenu}
          onOpenChange={setShowCreateMenu}
          restaurantId={selectedRestaurant.id}
          onMenuCreated={handleMenuCreated}
          isFirstMenu={false}
        />
      </div>
    );
  }

  // Main content - menu with categories
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">
            Managing <span className="font-medium">{selectedMenu?.name}</span> menu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MenuPicker />
          <Button onClick={() => setShowCreateMenu(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Menu
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCategories} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={selectedMenu?.is_active ? "default" : "secondary"}>
                {selectedMenu?.is_active ? "Active" : "Inactive"}
              </Badge>
              {selectedMenu?.is_default && (
                <Badge variant="outline">Default</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                {selectedMenu?.name}
              </CardTitle>
              <CardDescription>
                {selectedMenu?.description || 'No description provided'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Menu
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant={selectedMenu?.is_active ? "default" : "secondary"} className="text-xs">
                  {selectedMenu?.is_active ? "Active" : "Inactive"}
                </Badge>
                {selectedMenu?.is_default && (
                  <Badge variant="outline" className="text-xs">Default</Badge>
                )}
              </div>
            </div>

            {(selectedMenu?.active_from || selectedMenu?.active_to) && (
              <div>
                <span className="text-muted-foreground">Schedule:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">
                    {selectedMenu?.active_from || '00:00'} - {selectedMenu?.active_to || '23:59'}
                  </span>
                </div>
              </div>
            )}

            {(selectedMenu?.start_date || selectedMenu?.end_date) && (
              <div>
                <span className="text-muted-foreground">Season:</span>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">
                    {selectedMenu?.start_date ? new Date(selectedMenu.start_date).toLocaleDateString() : 'No start'} -
                    {selectedMenu?.end_date ? new Date(selectedMenu.end_date).toLocaleDateString() : 'No end'}
                  </span>
                </div>
              </div>
            )}

            <div>
              <span className="text-muted-foreground">Categories:</span>
              <div className="mt-1">
                <span className="text-sm font-medium">{stats.totalCategories}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({stats.activeCategories} active)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common menu management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/menu/categories/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/menu/items/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/menu/items">
                View All Items
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Organize your menu items into categories. Drag to reorder.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{category.name}</h3>
                      <div className="flex items-center gap-1">
                        {!category.is_active && (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {category.is_featured && (
                          <Badge variant="outline">Featured</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {category.description || 'No description'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {category.item_count || 0} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/dashboard/menu/categories/${category.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/menu/categories/${category.id}/edit`}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Category
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Category
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CreateMenuDialog
        open={showCreateMenu}
        onOpenChange={setShowCreateMenu}
        restaurantId={selectedRestaurant.id}
        onMenuCreated={handleMenuCreated}
        isFirstMenu={false}
      />
    </div>
  );
}

export default function MenuManagementPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <MenuManagementContent />
      </div>
    </DashboardLayout>
  );
}
