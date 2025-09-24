'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useItems } from '@/lib/contexts/items-context';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, RefreshCw, Utensils, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { CreateItemDialog } from '@/components/dashboard/items/create-item-dialog';

type Category = Database['public']['Tables']['categories']['Row'];

function ItemsPageContent() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const { items, isLoading, fetchItemsByCategory, deleteItem } = useItems();
  
  const [category, setCategory] = useState<Category | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const supabase = createClient();

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
      } catch (error) {
        console.error('Error fetching category:', error);
        router.push('/dashboard/menu');
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, supabase, router]);

  // Fetch items when category is loaded
  useEffect(() => {
    if (categoryId && category) {
      console.log('Category loaded, fetching items for:', categoryId);
      fetchItemsByCategory(categoryId);
    }
  }, [categoryId, category, fetchItemsByCategory]);

  // Add a retry mechanism for failed loads
  const retryLoadItems = useCallback(() => {
    if (categoryId) {
      console.log('Retrying items load for category:', categoryId);
      fetchItemsByCategory(categoryId, true); // Force refresh
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
          <CreateItemDialog
            categoryId={categoryId}
            categoryName={category.name}
          />
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

      {/* Items List */}
      {items.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Items List ({items.length})</CardTitle>
            <CardDescription>
              Manage existing items in this category
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
            ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Utensils className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Added {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.is_active ? "default" : "secondary"}>
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
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
                    </Button>
                  </div>
                </div>
              ))}
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
              <CreateItemDialog
                categoryId={categoryId}
                categoryName={category.name}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ItemsPage() {
  return (
    <DashboardLayout>
      <ItemsPageContent />
    </DashboardLayout>
  );
}
