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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSupportedCurrencies, type SupportedCurrency } from '@/lib/utils/currency';
import { Plus, ChefHat, Utensils, MoreVertical, Edit, Trash2, Clock, Calendar, Eye, Save, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CreateMenuDialog from '@/components/dashboard/create-menu-dialog';
import { MenuPicker } from '@/components/dashboard/menu-picker';
import Link from 'next/link';
import { toast } from 'sonner';

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

  // Menu editing state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    currency: 'RON' as SupportedCurrency,
    is_active: true,
    is_default: false
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

  // Update form data when selected menu changes
  useEffect(() => {
    if (selectedMenu) {
      setFormData({
        name: selectedMenu.name || '',
        slug: selectedMenu.slug || '',
        description: selectedMenu.description || '',
        currency: (selectedMenu.currency as SupportedCurrency) || 'RON',
        is_active: selectedMenu.is_active ?? true,
        is_default: selectedMenu.is_default ?? false
      });
    }
  }, [selectedMenu]);

  // Form handling functions
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedMenu) return;

    setIsSaving(true);
    try {
      // If setting this menu as default, unset other default menus first
      if (formData.is_default && !selectedMenu.is_default) {
        await supabase
          .from('menus')
          .update({ is_default: false })
          .eq('restaurant_id', selectedMenu.restaurant_id);
      }

      const { data, error } = await supabase
        .from('menus')
        .update(formData)
        .eq('id', selectedMenu.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Menu updated successfully');
      setIsEditing(false);
      
      // Update the menu context with the new data
      if (refreshMenus) {
        await refreshMenus();
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      toast.error('Failed to update menu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (selectedMenu) {
      setFormData({
        name: selectedMenu.name || '',
        slug: selectedMenu.slug || '',
        description: selectedMenu.description || '',
        currency: (selectedMenu.currency as SupportedCurrency) || 'RON',
        is_active: selectedMenu.is_active ?? true,
        is_default: selectedMenu.is_default ?? false
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!selectedMenu) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', selectedMenu.id);

      if (error) throw error;

      toast.success('Menu deleted successfully');
      setShowDeleteConfirm(false);
      
      // Refresh menus and let context select a new one
      if (refreshMenus) {
        await refreshMenus();
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error('Failed to delete menu');
    } finally {
      setIsDeleting(false);
    }
  };

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

      {/* Menu Information */}
      {selectedMenu && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <ChefHat className="mr-2 h-5 w-5" />
                  Menu Information
                </CardTitle>
                <CardDescription>
                  Basic details about this menu
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Menu
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Menu Name</Label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter menu name"
                  />
                ) : (
                  <p className="text-lg font-semibold">{selectedMenu.name}</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">URL Slug</Label>
                {isEditing ? (
                  <Input
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="Enter URL slug"
                  />
                ) : (
                  <p className="font-mono text-sm">{selectedMenu.slug}</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter menu description"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm">
                    {selectedMenu.description || 'No description provided'}
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Currency</Label>
                {isEditing ? (
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => handleInputChange('currency', value as SupportedCurrency)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSupportedCurrencies().map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.symbol} {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm">
                    {getSupportedCurrencies().find(c => c.value === selectedMenu.currency)?.label || 'Romanian Leu (RON)'}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Status Settings</Label>
                {isEditing ? (
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                      />
                      <Label htmlFor="is_active">Active Menu</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_default"
                        checked={formData.is_default}
                        onCheckedChange={(checked) => handleInputChange('is_default', checked)}
                      />
                      <Label htmlFor="is_default">Default Menu</Label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mt-2">
                    {selectedMenu.is_default && (
                      <Badge variant="default">Default</Badge>
                    )}
                    <Badge variant={selectedMenu.is_active ? "default" : "secondary"}>
                      {selectedMenu.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                <p className="text-sm">
                  {selectedMenu.created_at ? new Date(selectedMenu.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                <p className="text-sm">
                  {selectedMenu.updated_at ? new Date(selectedMenu.updated_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2">
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
      </div>

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
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/menu/categories/${category.id}/items`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Items ({category.item_count || 0})
                    </Link>
                  </Button>
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
                        <Link href={`/dashboard/menu/categories/${category.id}/items`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Items
                        </Link>
                      </DropdownMenuItem>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Menu</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{selectedMenu?.name}&rdquo;? This action cannot be undone.
              All categories and menu items in this menu will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Menu'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
