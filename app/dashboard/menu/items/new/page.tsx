'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { MultiImageUpload, UploadedImage } from '@/components/ui/multi-image-upload';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useMenu } from '@/lib/contexts/menu-context';
import { User } from '@supabase/supabase-js';

type Category = Database['public']['Tables']['categories']['Row'];

// Allergen options
const ALLERGEN_OPTIONS = [
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

function NewItemPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  
  const { selectedMenu } = useMenu();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slugLocked, setSlugLocked] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [restaurant, setRestaurant] = useState<{slug: string} | null>(null);
  const [menu, setMenu] = useState<{slug: string} | null>(null);
  
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
    is_featured: false,
    categoryId: categoryId || ''
  });

  const supabase = createClient();

  // Fetch categories for the current menu
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedMenu) return;
      
      try {
        setLoading(true);
        
        // Fetch categories
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('menu_id', selectedMenu.id)
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;

        setCategories(data || []);

        // If categoryId is provided, find and set the category
        if (categoryId && data) {
          const category = data.find(c => c.id === categoryId);
          if (category) {
            setSelectedCategory(category);
            setFormData(prev => ({ ...prev, categoryId }));
          }
        }

        // Fetch menu with restaurant for upload path
        const { data: menuData, error: menuError } = await supabase
          .from('menus')
          .select(`
            slug,
            restaurants!inner (
              slug
            )
          `)
          .eq('id', selectedMenu.id)
          .single();

        if (!menuError && menuData) {
          setMenu({ slug: menuData.slug });
          setRestaurant({ slug: (menuData.restaurants as any).slug });
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMenu, categoryId, supabase]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from name (only if not locked)
    if (field === 'name' && !slugLocked) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  // Build upload path
  const buildUploadPath = () => {
    if (!restaurant || !menu || !selectedCategory || !formData.slug) {
      return 'temp-uploads';
    }
    return `${restaurant.slug}/${menu.slug}/${selectedCategory.slug}/${formData.slug}`;
  };

  const handleAllergenToggle = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const handleSave = async () => {
    if (!formData.categoryId) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter an item name');
      return;
    }

    setSaving(true);
    try {
      // Create the product
      const { data: newItem, error: itemError } = await supabase
        .from('products')
        .insert({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          long_description: formData.long_description.trim() || null,
          price: parseFloat(formData.price) || 0,
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          ingredients: formData.ingredients.trim() || null,
          allergens: formData.allergens.length > 0 ? formData.allergens : null,
          spice_level: formData.spice_level && formData.spice_level !== 'none' ? formData.spice_level : null,
          is_active: formData.is_active,
          is_featured: formData.is_featured
        })
        .select()
        .single();

      if (itemError) throw itemError;

      // Link the product to the category
      const { error: linkError } = await supabase
        .from('category_products')
        .insert({
          category_id: formData.categoryId,
          product_id: newItem.id,
          sort_order: 1
        });

      if (linkError) {
        // Try to clean up the created product
        await supabase.from('products').delete().eq('id', newItem.id);
        throw linkError;
      }

      // Save product images
      if (uploadedImages.length > 0) {
        const imageRecords = uploadedImages.map((img, index) => ({
          product_id: newItem.id,
          s3_key: img.s3_key,
          alt_text: img.alt_text || null,
          display_order: index,
          is_primary: index === 0, // First image is primary
          width: img.width || null,
          height: img.height || null
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageRecords);

        if (imagesError) {
          console.error('Error saving images:', imagesError);
          // Don't fail the whole operation if images fail
          toast.warning('Product created but some images failed to save');
        }
      }

      toast.success('Item created successfully');
      router.push(`/dashboard/menu/categories/${formData.categoryId}/items`);
      
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('Failed to create item');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const backUrl = selectedCategory 
    ? `/dashboard/menu/categories/${selectedCategory.id}/items`
    : '/dashboard/menu';

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/dashboard/menu" className="hover:text-foreground">
              Menu
            </Link>
            {selectedCategory && (
              <>
                <span>›</span>
                <Link href={backUrl} className="hover:text-foreground">
                  {selectedCategory.name}
                </Link>
              </>
            )}
            <span>›</span>
            <span>Add Item</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Add New Menu Item
          </h1>
          <p className="text-muted-foreground">
            Create a new item for your menu
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
            <Plus className="h-4 w-4 mr-2" />
            {saving ? 'Creating...' : 'Create Item'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Core details about this menu item
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Margherita Pizza"
              />
            </div>
            
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="e.g., margherita-pizza"
              />
            </div>

            <div>
              <Label htmlFor="categoryId">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => {
                  handleInputChange('categoryId', value);
                  const category = categories.find(c => c.id === value);
                  setSelectedCategory(category || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="description">Short Description*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description for menu display"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="long_description">Detailed Description</Label>
              <Textarea
                id="long_description"
                value={formData.long_description}
                onChange={(e) => handleInputChange('long_description', e.target.value)}
                placeholder="Detailed description for item page"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Details */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Details</CardTitle>
            <CardDescription>
              Set pricing and item specifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="discount_price">Discount Price</Label>
                <Input
                  id="discount_price"
                  type="number"
                  step="0.01"
                  value={formData.discount_price}
                  onChange={(e) => handleInputChange('discount_price', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            
            <IngredientSelector
              value={formData.ingredients}
              onChange={(value) => handleInputChange('ingredients', value)}
              label="Ingredients"
              placeholder="Type to search ingredients..."
            />
            
            <div>
              <Label>Spice Level</Label>
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

        {/* Product Images - Full Width */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>
              Upload multiple images for this product. The first image will be the primary image.
              {slugLocked && (
                <span className="block mt-1 text-xs text-orange-600">
                  Product slug is locked after first upload
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultiImageUpload
              images={uploadedImages}
              onImagesChange={setUploadedImages}
              uploadPath={buildUploadPath()}
              maxImages={10}
              disabled={saving || !formData.slug}
              onSlugLock={() => setSlugLocked(true)}
            />
            {!formData.slug && (
              <p className="text-sm text-muted-foreground mt-2">
                Enter a product name to enable image uploads
              </p>
            )}
          </CardContent>
        </Card>

        {/* Allergens */}
        <Card>
          <CardHeader>
            <CardTitle>Allergens</CardTitle>
            <CardDescription>
              Mark any allergens this item contains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {ALLERGEN_OPTIONS.map((allergen) => (
                <div
                  key={allergen.value}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.allergens.includes(allergen.value)
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => handleAllergenToggle(allergen.value)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{allergen.label}</span>
                    {formData.allergens.includes(allergen.value) && (
                      <Badge variant="default" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        

        {/* Status Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Status Settings</CardTitle>
            <CardDescription>
              Control item visibility and features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Active Item</Label>
                <p className="text-sm text-muted-foreground">
                  Whether this item appears on your menu
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
                <Label htmlFor="is_featured">Featured Item</Label>
                <p className="text-sm text-muted-foreground">
                  Highlight this item as a special recommendation
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
      </div>
    </div>
  );
}

export default function NewMenuItemPage({ user }: { user: User | null }) {
  return (
    <DashboardLayout user={user}>
      <NewItemPageContent />
    </DashboardLayout>
  );
}
