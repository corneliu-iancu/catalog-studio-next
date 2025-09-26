'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type Category = Database['public']['Tables']['categories']['Row'];

function EditCategoryPageContent() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    sort_order: 0,
    is_active: true,
    is_featured: false
  });

  const supabase = createClient();

  // Fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          toast.error('Category not found');
          router.push('/dashboard/menu');
          return;
        }

        setCategory(data);

        // Set form data
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          sort_order: data.sort_order || 0,
          is_active: data.is_active ?? true,
          is_featured: data.is_featured ?? false
        });
        
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Failed to load category details');
        router.push('/dashboard/menu');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, supabase, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSave = async () => {
    if (!category) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          sort_order: formData.sort_order,
          is_active: formData.is_active,
          is_featured: formData.is_featured
        })
        .eq('id', categoryId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
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

  const backUrl = `/dashboard/menu/categories/${categoryId}/items`;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard/menu" className="hover:text-foreground">
              Menu
            </Link>
            <span>›</span>
            <Link href={backUrl} className="hover:text-foreground">
              {category.name}
            </Link>
            <span>›</span>
            <span>Edit Category</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit {category.name}
          </h1>
          <p className="text-muted-foreground">
            Update the details for this category
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={backUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Core details about this category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Appetizers"
              />
            </div>
            
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="e.g., appetizers"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display Settings</CardTitle>
            <CardDescription>
              Control how this category appears
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Lower numbers appear first
              </p>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Active Category</Label>
                <p className="text-sm text-muted-foreground">
                  Whether this category appears on your menu
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_featured">Featured Category</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight this category as special
                </p>
              </div>
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Info */}
        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
            <CardDescription>
              Details about this category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created</Label>
              <p className="text-sm">
                {category.created_at ? new Date(category.created_at).toLocaleDateString('en-US', {
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
                {category.updated_at ? new Date(category.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Not available'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EditCategoryPage() {
  return (
    <DashboardLayout>
      <EditCategoryPageContent />
    </DashboardLayout>
  );
}