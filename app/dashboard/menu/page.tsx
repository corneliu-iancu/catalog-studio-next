'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { useMenu } from '@/lib/contexts/menu-context';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getSupportedCurrencies, type SupportedCurrency } from '@/lib/utils/currency';
import { Plus, ChefHat, Utensils, MoreVertical, Edit, Trash2, Clock, Calendar, Eye, Save, X, Upload, QrCode as QrCodeIcon, Search, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CreateMenuDialog from '@/components/dashboard/create-menu-dialog';
import { CsvImportDialog } from '@/components/dashboard/csv-import-dialog';
import { MenuPicker } from '@/components/dashboard/menu-picker';
import { MenuQRCode } from '@/components/dashboard/menu-qr-code';
import Link from 'next/link';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

type Menu = Database['public']['Tables']['menus']['Row'];
type Category = Database['public']['Tables']['categories']['Row'] & {
  item_count?: number;
};

function MenuManagementContent() {
  const t = useTranslations();
  const { selectedRestaurant } = useRestaurant();
  const { selectedMenu, selectMenu, refreshMenus, hasMenus, isLoading: menusLoading } = useMenu();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showCsvImport, setShowCsvImport] = useState(false);
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
  
  // Category deletion state
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    currency: 'RON' as SupportedCurrency,
    is_active: true,
    is_default: false
  });

  const supabase = createClient();

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );



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
          category_products(count)
        `)
        .eq('menu_id', selectedMenu.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Transform data to include item counts
      const categoriesWithCounts = (data || []).map(category => ({
        ...category,
        item_count: category.category_products?.[0]?.count || 0
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

      toast.success(t('menuManagement.toast.menuUpdated'));
      setIsEditing(false);
      
      // Update the menu context with the new data
      if (refreshMenus) {
        await refreshMenus();
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      toast.error(t('menuManagement.toast.menuUpdateError'));
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

      toast.success(t('menuManagement.toast.menuDeleted'));
      setShowDeleteConfirm(false);
      
      // Refresh menus and let context select a new one
      if (refreshMenus) {
        await refreshMenus();
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
      toast.error(t('menuManagement.toast.menuDeleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setDeletingCategoryId(categoryToDelete.id);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryToDelete.id);

      if (error) throw error;

      toast.success(t('menuManagement.toast.categoryDeleted'));
      setShowDeleteCategoryConfirm(false);
      setCategoryToDelete(null);
      
      // Refresh categories to reflect the deletion
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(t('menuManagement.toast.categoryDeleteError'));
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const confirmDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteCategoryConfirm(true);
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
            <h3 className="text-lg font-semibold">{t('menuManagement.emptyStates.noRestaurant')}</h3>
            <p className="text-muted-foreground">{t('menuManagement.emptyStates.selectRestaurant')}</p>
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
          <p className="text-muted-foreground">{t('menuManagement.emptyStates.loadingMenus')}</p>
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
            <h1 className="text-3xl font-bold tracking-tight">{t('menuManagement.title')}</h1>
            <p className="text-muted-foreground">{t('menuManagement.emptyStates.createMenusDescription')}</p>
          </div>
        </div>

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
            <div className="rounded-full bg-muted p-6">
              <ChefHat className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{t('menuManagement.emptyStates.createFirstMenu')}</h3>
              <p className="text-muted-foreground max-w-md">
                {t('menuManagement.emptyStates.startBuilding')}
              </p>
            </div>
            <div className="space-y-2">
              <Button onClick={() => setShowCreateMenu(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                {t('menuManagement.actions.createMenu')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('menuManagement.emptyStates.firstMenuDefault')}
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
            <h1 className="text-3xl font-bold tracking-tight">{t('menuManagement.title')}</h1>
            <p className="text-muted-foreground">{t('menuManagement.emptyStates.organizeCategories')}</p>
          </div>
          <div className="flex items-center gap-2">
            <MenuPicker />
            <Button onClick={() => setShowCreateMenu(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {t('menuManagement.newMenu')}
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
                    {t('menuManagement.emptyStates.menuCreatedSuccess', { menuName: selectedMenu?.name })}
                  </h3>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t('menuManagement.emptyStates.addCategories')}
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
              <h3 className="text-xl font-semibold">{t('menuManagement.emptyStates.addFirstCategory')}</h3>
              <p className="text-muted-foreground max-w-md">
                {t('menuManagement.emptyStates.organizeIntoCategories')}
              </p>
            </div>
            <div className="space-y-2">
              <Button asChild size="lg">
                <Link href="/dashboard/menu/categories/new">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('menuManagement.actions.createCategory')}
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('menuManagement.emptyStates.categoriesHelp')}
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
          <h1 className="text-3xl font-bold tracking-tight">{t('menuManagement.title')}</h1>
          <p className="text-muted-foreground">
            {t('menuManagement.subtitle')} <span className="font-medium">{selectedMenu?.name}</span> {t('menuManagement.menu')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <MenuPicker />
          {selectedMenu && (
            <Button 
              variant="outline" 
              onClick={() => setShowCsvImport(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Upload className="h-4 w-4 mr-2" />
              {t('menuManagement.actions.importCSV')}
            </Button>
          )}
          <Button onClick={() => setShowCreateMenu(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {t('menuManagement.newMenu')}
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
                  {t('menuManagement.menuInformation.title')}
                </CardTitle>
                <CardDescription>
                  {t('menuManagement.menuInformation.cardDescription')}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                      <X className="mr-2 h-4 w-4" />
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? t('restaurant.profile.saving') : t('restaurant.profile.saveChanges')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      {t('menuManagement.actions.editMenu')}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('common.delete')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('menuManagement.menuInformation.menuName')}</Label>
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('menuManagement.menuInformation.menuNamePlaceholder')}
                  />
                ) : (
                  <p className="text-lg font-semibold">{selectedMenu.name}</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('menuManagement.menuInformation.urlSlug')}</Label>
                {isEditing ? (
                  <Input
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder={t('menuManagement.menuInformation.urlSlugPlaceholder')}
                  />
                ) : (
                  <p className="font-mono text-sm">{selectedMenu.slug}</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('menuManagement.menuInformation.description')}</Label>
                {isEditing ? (
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder={t('menuManagement.menuInformation.descriptionPlaceholder')}
                    rows={3}
                  />
                ) : (
                  <p className="text-sm">
                    {selectedMenu.description || t('restaurant.basicInfo.noDescription')}
                  </p>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('menuManagement.menuInformation.currency')}</Label>
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
                <Label className="text-sm font-medium text-muted-foreground">{t('menuManagement.menuInformation.status')}</Label>
                {isEditing ? (
                  <div className="space-y-3 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                      />
                      <Label htmlFor="is_active">{t('common.active')} {t('menuManagement.menu')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_default"
                        checked={formData.is_default}
                        onCheckedChange={(checked) => handleInputChange('is_default', checked)}
                      />
                      <Label htmlFor="is_default">{t('menuManagement.menuInformation.makeDefault')}</Label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mt-2">
                    {selectedMenu.is_default && (
                      <Badge variant="default">{t('menuManagement.menuInformation.makeDefault')}</Badge>
                    )}
                    <Badge variant={selectedMenu.is_active ? "default" : "secondary"}>
                      {selectedMenu.is_active ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.accountInfo.created')}</Label>
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
                <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.accountInfo.lastUpdated')}</Label>
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

      {/* Search Bar for Categories */}
      {categories.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline">
            {filteredCategories.length} of {categories.length} categories
          </Badge>
        </div>
      )}

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('menuManagement.categories.title')} ({filteredCategories.length})</CardTitle>
              <CardDescription>
                {searchQuery ? `Showing ${filteredCategories.length} of ${categories.length} categories` : t('menuManagement.categories.description')}
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/menu/categories/new">
                <Plus className="h-4 w-4 mr-2" />
                {t('menuManagement.categories.newCategory')}
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCategories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-24">Items</TableHead>
                  <TableHead className="w-24">Status</TableHead>
                  <TableHead className="w-24">Created</TableHead>
                  <TableHead className="w-40 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category, index) => (
                  <TableRow key={category.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Utensils className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {category.name}
                          {category.is_featured && (
                            <Badge variant="outline" className="text-xs">Featured</Badge>
                          )}
                        </div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {category.item_count || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? t('common.active') : t('common.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {category.created_at ? new Date(category.created_at).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/menu/categories/${category.id}/items`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View ({category.item_count || 0})
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/menu/categories/${category.id}/edit`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit {category.name}</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDeleteCategory(category)}
                          disabled={deletingCategoryId === category.id}
                        >
                          {deletingCategoryId === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="sr-only">Delete {category.name}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No categories match your search' : 'No categories in this menu'}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats and QR Code Row */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('menuManagement.stats.totalCategories')}</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCategories} {t('common.active')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('menuManagement.stats.totalItems')}</CardTitle>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {t('menuManagement.stats.activeCategories')}
            </p>
          </CardContent>
        </Card>

        {/* Compact QR Code Card */}
        {selectedRestaurant && selectedMenu && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-medium flex items-center">
                    <QrCodeIcon className="mr-2 h-4 w-4" />
                    {t('menuManagement.actions.generateQR')}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {t('menuManagement.actions.shareQR')}
                  </CardDescription>
                </div>
                <MenuQRCode 
                  restaurantSlug={selectedRestaurant.slug}
                  menuSlug={selectedMenu.slug}
                  menuName={selectedMenu.name}
                />
              </div>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('restaurant.quickActions.title')}</CardTitle>
          <CardDescription>{t('restaurant.quickActions.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/menu/items/new">
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.quickActions.addMenuItem')}
              </Link>
            </Button>
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

      {selectedMenu && (
        <CsvImportDialog
          open={showCsvImport}
          onOpenChange={setShowCsvImport}
          menuId={selectedMenu.id}
          menuName={selectedMenu.name}
          onImportComplete={() => {
            fetchCategories();
            toast.success(t('menuManagement.toast.csvImported'));
          }}
        />
      )}

      {/* Delete Menu Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('menuManagement.deleteConfirm.menuTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('menuManagement.deleteConfirm.menuDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t('restaurant.profile.saving') : t('menuManagement.actions.deleteMenu')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Category Confirmation Dialog */}
      <AlertDialog open={showDeleteCategoryConfirm} onOpenChange={setShowDeleteCategoryConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('menuManagement.deleteConfirm.categoryTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('menuManagement.deleteConfirm.categoryDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              disabled={deletingCategoryId !== null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingCategoryId === categoryToDelete?.id ? t('restaurant.profile.saving') : t('menuManagement.categories.deleteCategory')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function MenuManagementPage() {
  const t = useTranslations();
  const [user, setUser] = useState<User | null>(null);
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
          <p className="text-muted-foreground">{t('common.loading')}</p>
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
