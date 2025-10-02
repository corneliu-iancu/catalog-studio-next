'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IngredientSelector } from '@/components/ui/ingredient-selector';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MultiImageUpload, UploadedImage } from '@/components/ui/multi-image-upload';

type MenuItem = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];
type Menu = Database['public']['Tables']['menus']['Row'];
type Restaurant = Database['public']['Tables']['restaurants']['Row'];

// Allergen options
const ALLERGEN_OPTIONS = [ // todo: these are predefined. but still we need to make it translatable.
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten', label: 'Gluten' },
  { value: 'nuts', label: 'Nuts' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'soy', label: 'Soy' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'fish', label: 'Fish' },
  { value: 'sesame', label: 'Sesame' }
];

// Spice level options
const SPICE_LEVELS = [
  { value: 'mild', label: 'Mild' },
  { value: 'medium', label: 'Medium' },
  { value: 'hot', label: 'Hot' },
  { value: 'very-hot', label: 'Very Hot' }
];

function EditItemPageContent() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('forms');
  const tCommon = useTranslations('common');
  
  const categoryId = params.id as string;
  const itemId = params.itemId as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [initialImageIds, setInitialImageIds] = useState<Set<string>>(new Set());
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    price: '',
    discount_price: '',
    ingredients: '',
    allergens: [] as string[],
    spice_level: 'none',
    is_active: true,
    is_featured: false
  });

  const supabase = createClient();

  // Fetch item and category details
  useEffect(() => {
    const fetchItemAndCategory = async () => {
      if (!itemId || !categoryId) return;
      
      try {
        setLoading(true);
        
        // Fetch item details
        const { data: itemData, error: itemError } = await supabase
          .from('products')
          .select(`
            *,
            product_images (
              id,
              s3_key,
              alt_text,
              display_order,
              is_primary,
              width,
              height
            )
          `)
          .eq('id', itemId)
          .maybeSingle();

        if (itemError) throw itemError;

        if (!itemData) {
          toast.error('Item not found');
          router.push(`/dashboard/menu/categories/${categoryId}/items`);
          return;
        }

        setItem(itemData);

        // Set form data
        setFormData({
          name: itemData.name || '',
          slug: itemData.slug || '',
          description: itemData.description || '',
          long_description: itemData.long_description || '',
          price: itemData.price?.toString() || '',
          discount_price: itemData.discount_price?.toString() || '',
          ingredients: itemData.ingredients || '',
          allergens: itemData.allergens || [],
          spice_level: itemData.spice_level || 'none',
          is_active: itemData.is_active ?? true,
          is_featured: itemData.is_featured ?? false
        });

        // Load existing product images
        if (itemData.product_images && Array.isArray(itemData.product_images)) {
          const images: UploadedImage[] = itemData.product_images
            .sort((a: any, b: any) => {
              // Sort by is_primary first, then display_order
              if (a.is_primary && !b.is_primary) return -1;
              if (!a.is_primary && b.is_primary) return 1;
              return (a.display_order || 0) - (b.display_order || 0);
            })
            .map((img: any) => ({
              id: img.id,
              s3_key: img.s3_key,
              alt_text: img.alt_text || undefined,
              width: img.width || undefined,
              height: img.height || undefined
            }));
          setUploadedImages(images);
          setInitialImageIds(new Set(images.map(img => img.id)));
        }

        // Fetch the specific category with menu and restaurant data
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select(`
            *,
            menus:menu_id (
              *,
              restaurants:restaurant_id (*)
            )
          `)
          .eq('id', categoryId)
          .maybeSingle();

        if (categoryError) {
          console.error('Error fetching category:', categoryError);
          toast.error('Failed to load category details');
          throw categoryError;
        }

        if (!categoryData) {
          toast.error('Category not found');
          router.push('/dashboard/menu');
          return;
        }

        setCategory(categoryData);
        
        // Extract menu and restaurant data from the nested response
        if (categoryData.menus) {
          setMenu(categoryData.menus);
          if (categoryData.menus.restaurants) {
            setRestaurant(categoryData.menus.restaurants);
          }
        }
        
      } catch (error) {
        console.error('Error fetching item:', error);
        toast.error('Failed to load item details');
        router.push(`/dashboard/menu/categories/${categoryId}/items`);
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndCategory();
  }, [itemId, categoryId, supabase, router]);

  const buildUploadPath = () => {
    if (!restaurant || !menu || !category || !item) {
      return 'temp-uploads';
    }
    return `${restaurant.slug}/${menu.slug}/${category.slug}/${item.slug}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item) return;

    try {
      setSaving(true);
        const { error } = await supabase
        .from('products')
        .update({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          long_description: formData.long_description.trim() || null,
          price: formData.price ? parseFloat(formData.price) : null,
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          ingredients: formData.ingredients.trim() || null,
          allergens: formData.allergens.length > 0 ? formData.allergens : null,
          spice_level: formData.spice_level === 'none' ? null : formData.spice_level,
          is_active: formData.is_active,
          is_featured: formData.is_featured
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      // Handle product images
      try {
        // 1. Find deleted images (in initialImageIds but not in current uploadedImages)
        const currentImageIds = new Set(
          uploadedImages.filter(img => initialImageIds.has(img.id)).map(img => img.id)
        );
        const deletedImageIds = Array.from(initialImageIds).filter(id => !currentImageIds.has(id));

        // Delete removed images from S3 and database
        if (deletedImageIds.length > 0) {
          // First, get the s3_keys for the images being deleted
          const { data: imagesToDelete, error: fetchError } = await supabase
            .from('product_images')
            .select('s3_key')
            .in('id', deletedImageIds);

          if (fetchError) {
            console.error('Error fetching images to delete:', fetchError);
          } else if (imagesToDelete) {
            // Delete from S3
            for (const img of imagesToDelete) {
              try {
                const response = await fetch(`/api/images/${encodeURIComponent(img.s3_key)}`, {
                  method: 'DELETE',
                });
                if (!response.ok) {
                  console.error(`Failed to delete image from S3: ${img.s3_key}`);
                }
              } catch (s3Error) {
                console.error('Error deleting from S3:', s3Error);
              }
            }
          }

          // Delete from database
          const { error: deleteError } = await supabase
            .from('product_images')
            .delete()
            .in('id', deletedImageIds);
          
          if (deleteError) {
            console.error('Error deleting images from database:', deleteError);
          }
        }

        // 2. Add new images (not in initialImageIds)
        const newImages = uploadedImages.filter(img => !initialImageIds.has(img.id));
        if (newImages.length > 0) {
          const imagesToInsert = newImages.map((img, index) => ({
            product_id: itemId,
            s3_key: img.s3_key,
            alt_text: img.alt_text || null,
            display_order: uploadedImages.indexOf(img),
            is_primary: uploadedImages.indexOf(img) === 0,
            width: img.width || null,
            height: img.height || null
          }));

          const { error: insertError } = await supabase
            .from('product_images')
            .insert(imagesToInsert);

          if (insertError) {
            console.error('Error inserting images:', insertError);
            throw insertError;
          }
        }

        // 3. Update existing images (display_order and is_primary)
        const existingImages = uploadedImages.filter(img => initialImageIds.has(img.id));
        if (existingImages.length > 0) {
          for (let i = 0; i < existingImages.length; i++) {
            const img = existingImages[i];
            const { error: updateError } = await supabase
              .from('product_images')
              .update({
                display_order: uploadedImages.indexOf(img),
                is_primary: uploadedImages.indexOf(img) === 0
              })
              .eq('id', img.id);

            if (updateError) {
              console.error('Error updating image:', updateError);
            }
          }
        }

        // Refresh images from database to get real IDs
        const { data: refreshedImages, error: refreshError } = await supabase
          .from('product_images')
          .select('id, s3_key, alt_text, display_order, is_primary, width, height')
          .eq('product_id', itemId)
          .order('display_order', { ascending: true });

        if (!refreshError && refreshedImages) {
          const updatedImages: UploadedImage[] = refreshedImages.map((img: any) => ({
            id: img.id,
            s3_key: img.s3_key,
            alt_text: img.alt_text || undefined,
            width: img.width || undefined,
            height: img.height || undefined
          }));
          setUploadedImages(updatedImages);
          setInitialImageIds(new Set(updatedImages.map(img => img.id)));
        }
      } catch (imageError) {
        console.error('Error managing images:', imageError);
        toast.error('Product updated but some images may not have been saved');
        return;
      }

      toast.success('Item updated successfully');
      // Stay on edit page to allow further edits
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading item...</span>
        </div>
      </div>
    );
  }

  if (!item || !category || !menu || !restaurant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Item Not Found</h3>
          <p className="text-muted-foreground">The item you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href={`/dashboard/menu/categories/${categoryId}/items`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {category?.name || 'Category'}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-12">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard/menu" className="hover:text-foreground">
              Menu
            </Link>
            <span>›</span>
            <Link href={`/dashboard/menu/categories/${categoryId}/items`} className="hover:text-foreground">
              {category.name}
            </Link>
            <span>›</span>
            <span>Edit Item</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit {item.name}
          </h1>
          <p className="text-muted-foreground">
            Update the details for this menu item in {category.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/menu/categories/${categoryId}/items`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {category.name}
            </Link>
          </Button>
          <Button type="submit" form="edit-item-form" disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <form id="edit-item-form" onSubmit={handleSubmit} className="space-y-6 max-w-none">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your menu item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-friendly-name"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the item"
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="long_description">Detailed Description</Label>
              <Textarea
                id="long_description"
                value={formData.long_description}
                onChange={(e) => handleInputChange('long_description', e.target.value)}
                placeholder="Detailed description with preparation, ingredients, etc."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Set the pricing for this item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_price">Discount Price</Label>
                <Input
                  id="discount_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discount_price}
                  onChange={(e) => handleInputChange('discount_price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle>Item Details</CardTitle>
            <CardDescription>
              Additional information about ingredients, allergens, etc.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <IngredientSelector
                value={formData.ingredients}
                onChange={(value) => handleInputChange('ingredients', value)}
                placeholder="Add ingredients..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>Allergens</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {ALLERGEN_OPTIONS.map((allergen) => (
                  <div key={allergen.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={allergen.value}
                      checked={formData.allergens.includes(allergen.value)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newAllergens = checked
                          ? [...formData.allergens, allergen.value]
                          : formData.allergens.filter(a => a !== allergen.value);
                        handleInputChange('allergens', newAllergens);
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={allergen.value} className="text-sm">
                      {allergen.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="spice_level">Spice Level</Label>
              <Select 
                value={formData.spice_level} 
                onValueChange={(value) => handleInputChange('spice_level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select spice level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {SPICE_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload multiple images for this product. The first image will be the primary image.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultiImageUpload
              images={uploadedImages}
              onImagesChange={setUploadedImages}
              uploadPath={buildUploadPath()}
              maxImages={10}
              disabled={saving}
            />
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Control visibility and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Item is visible and available for order
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
              <div className="space-y-0.5">
                <Label htmlFor="is_featured">Featured</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight this item in the menu
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
      </form>
    </div>
  );
}

export default function EditItemPage() {
  return (
    <DashboardLayout user={null}>
      <EditItemPageContent />
    </DashboardLayout>
  );
}
