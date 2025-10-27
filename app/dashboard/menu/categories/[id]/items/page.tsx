'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useItems } from '@/lib/contexts/items-context';
import { useMenu } from '@/lib/contexts/menu-context';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Loader2, RefreshCw, Utensils, Trash2, Edit, Plus, Settings, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDisplayImage } from '@/lib/utils/image-display';
import { getPrimaryImage } from '@/lib/utils/product-images';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

type Category = Database['public']['Tables']['categories']['Row'];
type MenuItem = Database['public']['Tables']['products']['Row'];

// Component for displaying item thumbnail with fallback
function ItemThumbnail({ item }: { item: MenuItem }) {
  const [primaryImageKey, setPrimaryImageKey] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const { displayUrl, loading: urlLoading } = useDisplayImage(primaryImageKey);

  useEffect(() => {
    const fetchPrimaryImage = async () => {
      try {
        const imageKey = await getPrimaryImage(item.id);
        setPrimaryImageKey(imageKey);
      } catch (error) {
        console.error('Error fetching primary image:', error);
        setPrimaryImageKey(null);
      } finally {
        setImageLoading(false);
      }
    };

    fetchPrimaryImage();
  }, [item.id]);

  if (imageLoading || urlLoading) {
    return (
      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (displayUrl) {
    return (
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <img
          src={displayUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
      <Utensils className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function ItemsPageContent({ user }: { user: User | null }) {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const { items, isLoading, fetchItemsByCategory, deleteItem } = useItems();
  const { selectedMenu } = useMenu();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryLoaded, setCategoryLoaded] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      setDeletingItemId(itemId);
      await deleteItem(itemId, categoryId);
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setDeletingItemId(null);
    }
  };

  // Fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      // Reset loaded state when categoryId changes
      setCategoryLoaded(false);
      
      try {
        setCategoryLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          console.error('Category not found or access denied:', categoryId);
          router.push('/dashboard/menu');
          return;
        }

        setCategory(data);
        setCategoryLoaded(true);
      } catch (error) {
        console.error('Error fetching category:', error);
        setCategoryLoaded(false);
        router.push('/dashboard/menu');
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, supabase, router]);

  // Fetch items when category is loaded
  useEffect(() => {
    if (categoryId && categoryLoaded) {
      console.log('Category loaded, fetching items for:', categoryId);
      console.log('Current items count before fetch:', items.length);
      fetchItemsByCategory(categoryId);
    }
  }, [categoryId, categoryLoaded, fetchItemsByCategory, items.length]);

  // Add a retry mechanism for failed loads
  const retryLoadItems = useCallback(() => {
    if (categoryId) {
      console.log('Retrying items load for category:', categoryId);
      fetchItemsByCategory(categoryId, true); // Force refresh on retry
    }
  }, [categoryId, fetchItemsByCategory]);

  if (categoryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading category...</span>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Category Not Found</h3>
          <p className="text-muted-foreground">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/dashboard/menu">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard/menu" className="hover:text-foreground">
              Menu
            </Link>
            <span>›</span>
            <span>{category.name}</span>
            <span>›</span>
            <span>Items</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {category.name} Items
          </h1>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href={`/dashboard/menu/items/new?categoryId=${categoryId}`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/menu/categories/${categoryId}/edit`}>
              <Settings className="h-4 w-4 mr-2" />
              Edit Category
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/menu">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Link>
          </Button>
        </div>
      </div>

      {/* Items Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            Items Overview
          </CardTitle>
          <CardDescription>
            Manage items in the &ldquo;{category.name}&rdquo; category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{items.length} Total Items</Badge>
              <Badge variant="outline">
                {items.filter(item => item.is_active).length} Active
              </Badge>
              <Badge variant="outline">
                {items.filter(item => !item.is_active).length} Inactive
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={retryLoadItems}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      {items.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline">
            {filteredItems.length} of {items.length} items
          </Badge>
        </div>
      )}

      {/* Items Table */}
      {items.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Items List ({filteredItems.length})</CardTitle>
            <CardDescription>
              {searchQuery ? `Showing ${filteredItems.length} of ${items.length} items` : 'Manage existing items in this category'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Loading items...</span>
                </div>
              </div>
            ) : filteredItems.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-32">Price</TableHead>
                    <TableHead className="w-24">Status</TableHead>
                    <TableHead className="w-24">Created</TableHead>
                    <TableHead className="w-32 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell>
                        <ItemThumbnail item={item} />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.price ? (
                          <span className="font-medium">
                            {formatPrice(item.price, (selectedMenu?.currency as SupportedCurrency) || 'USD')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.is_active ? "default" : "secondary"}>
                          {item.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/dashboard/menu/categories/${categoryId}/items/${item.id}/edit`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit {item.name}</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={deletingItemId === item.id}
                          >
                            {deletingItemId === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Delete {item.name}</span>
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
                    {searchQuery ? 'No items match your search' : 'No items in this category'}
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
      ) : (
        /* Empty State */
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <Utensils className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No Items Yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Start building your menu by adding items to this category.
                  Items can include dishes, drinks, or any products you offer.
                </p>
              </div>
              <Button asChild>
                <Link href={`/dashboard/menu/items/new?categoryId=${categoryId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ItemsPage() {
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
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <ItemsPageContent user={user} />
    </DashboardLayout>
  );
}
