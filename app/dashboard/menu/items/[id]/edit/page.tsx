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
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type MenuItem = Database['public']['Tables']['menu_items']['Row'];
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

function EditItemPageContent() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  
  const [item, setItem] = useState<MenuItem | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    long_description: '',
    price: '',
    discount_price: '',
    ingredients: '',
    allergens: [] as string[],
    spice_level: '',
    is_active: true,
    is_featured: false
  });

  const supabase = createClient();

  // Fetch item and category details
  useEffect(() => {
    const fetchItemAndCategory = async () => {
      if (!itemId) return;
      
      try {
        setLoading(true);
        
        // Fetch item details
        const { data: itemData, error: itemError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('id', itemId)
          .maybeSingle();

        if (itemError) throw itemError;

        if (!itemData) {
          toast.error('Item not found');
          router.push('/dashboard/menu');
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

        // Fetch category details through the junction table
        const { data: categoryData, error: categoryError } = await supabase
          .from('category_menu_items')
          .select(`
            categories!inner (
              id,
              name,
              slug,
              description
            )
          `)
          .eq('menu_item_id', itemId)
          .maybeSingle();

        if (categoryError) throw categoryError;

        if (categoryData?.categories) {
          setCategory(categoryData.categories as any);
        }
        
      } catch (error) {
        console.error('Error fetching item:', error);
        toast.error('Failed to load item details');
        router.push('/dashboard/menu');
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndCategory();
  }, [itemId, supabase, router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    if (!item) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim(),
          long_description: formData.long_description.trim() || null,
          price: parseFloat(formData.price) || 0,
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          ingredients: formData.ingredients.trim() || null,
          allergens: formData.allergens.length > 0 ? formData.allergens : null,
          spice_level: formData.spice_level && formData.spice_level !== 'none' ? formData.spice_level : null, // todo: problematic for now, might remove it.
          is_active: formData.is_active,
          is_featured: formData.is_featured
        })
        .eq('id', itemId)
        .select()
        .single();

      if (error) throw error;

      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setSaving(false);
    }
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

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold">Item Not Found</h3>
          <p className="text-muted-foreground">The item you're looking for doesn't exist.</p>
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

  const backUrl = category 
    ? `/dashboard/menu/categories/${category.id}/items`
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
            {category && (
              <>
                <span>›</span>
                <Link href={backUrl} className="hover:text-foreground">
                  {category.name}
                </Link>
              </>
            )}
            <span>›</span>
            <span>Edit Item</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Edit {item.name}
          </h1>
          <p className="text-muted-foreground">
            Update the details for this menu item
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
              <Label htmlFor="description">Short Description</Label>
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

          <div>
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                placeholder="List main ingredients"
                rows={3}
            />
          </div>
          
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

export default function EditItemPage() {
  return (
    <DashboardLayout>
      <EditItemPageContent />
    </DashboardLayout>
  );
}