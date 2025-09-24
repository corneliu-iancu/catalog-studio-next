'use client';

import { useState } from 'react';
import { useItems } from '@/lib/contexts/items-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';

// Predefined ingredients for autocomplete
const COMMON_INGREDIENTS = [
  'Tomatoes', 'Mozzarella', 'Basil', 'Olive Oil', 'Garlic', 'Onions', 'Bell Peppers',
  'Mushrooms', 'Spinach', 'Chicken', 'Beef', 'Pork', 'Salmon', 'Shrimp', 'Lettuce',
  'Cucumber', 'Carrots', 'Potatoes', 'Rice', 'Pasta', 'Bread', 'Cheese', 'Butter',
  'Salt', 'Pepper', 'Oregano', 'Thyme', 'Parsley', 'Lemon', 'Lime', 'Avocado'
];

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

interface CreateItemDialogProps {
  categoryId: string;
  categoryName?: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  ingredients: string[];
  allergens: string[];
  spiceLevel: string;
  isActive: boolean;
  isFeatured: boolean;
}

export function CreateItemDialog({ categoryId, categoryName }: CreateItemDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    ingredients: [],
    allergens: [],
    spiceLevel: '',
    isActive: true,
    isFeatured: false,
  });

  // Ingredient input state
  const [ingredientInput, setIngredientInput] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);

  const { createItem } = useItems();

  // Handle ingredient input changes and filtering
  const handleIngredientInputChange = (value: string) => {
    setIngredientInput(value);
    if (value.trim()) {
      const filtered = COMMON_INGREDIENTS.filter(ingredient =>
        ingredient.toLowerCase().includes(value.toLowerCase()) &&
        !formData.ingredients.includes(ingredient)
      );
      setFilteredIngredients(filtered.slice(0, 5)); // Show max 5 suggestions
    } else {
      setFilteredIngredients([]);
    }
  };

  // Add ingredient to the list
  const addIngredient = (ingredient: string) => {
    if (ingredient.trim() && !formData.ingredients.includes(ingredient)) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, ingredient]
      }));
      setIngredientInput('');
      setFilteredIngredients([]);
    }
  };

  // Remove ingredient from the list
  const removeIngredient = (ingredient: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i !== ingredient)
    }));
  };

  // Toggle allergen
  const toggleAllergen = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      ingredients: [],
      allergens: [],
      spiceLevel: '',
      isActive: true,
      isFeatured: false,
    });
    setIngredientInput('');
    setFilteredIngredients([]);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim()) {
      setError('Please enter a product name');
      return;
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      setError('Please enter a valid price');
      return;
    }

    try {
      setIsSubmitting(true);

      // For now, we'll still use the simple createItem function
      // TODO: Update API to handle all the new fields
      await createItem(categoryId, formData.name.trim());

      // Show success briefly
      setSuccess(true);

      // Close dialog after a brief delay
      setTimeout(() => {
        setIsOpen(false);
        resetForm();
      }, 1000);

    } catch (error) {
      console.error('Error creating item:', error);
      setError('Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      setIsOpen(open);
      if (!open) {
        resetForm();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Add a new item to {categoryName ? `"${categoryName}"` : 'this category'}.
            Fill in the details below to create your menu item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-800">Product added successfully!</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Basic Information</h3>

              <div className="grid gap-2">
                <Label htmlFor="itemName">Product Name *</Label>
                <Input
                  id="itemName"
                  type="text"
                  placeholder="e.g., Margherita Pizza, Caesar Salad..."
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isSubmitting || success}
                  autoFocus
                  maxLength={255}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the item..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={isSubmitting || success}
                  rows={3}
                  maxLength={500}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Pricing</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    disabled={isSubmitting || success}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="discountPrice">Sale Price</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    placeholder="0.00"
                    value={formData.discountPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value }))}
                    disabled={isSubmitting || success}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Ingredients</h3>

              <div className="grid gap-2">
                <Label htmlFor="ingredients">Add Ingredients</Label>
                <div className="relative">
                  <Input
                    id="ingredients"
                    type="text"
                    placeholder="Type to search ingredients..."
                    value={ingredientInput}
                    onChange={(e) => handleIngredientInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (ingredientInput.trim()) {
                          addIngredient(ingredientInput.trim());
                        }
                      }
                    }}
                    disabled={isSubmitting || success}
                  />

                  {/* Ingredient suggestions */}
                  {filteredIngredients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                      {filteredIngredients.map((ingredient) => (
                        <button
                          key={ingredient}
                          type="button"
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                          onClick={() => addIngredient(ingredient)}
                        >
                          {ingredient}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected ingredients */}
                {formData.ingredients.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.ingredients.map((ingredient) => (
                      <Badge key={ingredient} variant="secondary" className="flex items-center gap-1">
                        {ingredient}
                        <button
                          type="button"
                          onClick={() => removeIngredient(ingredient)}
                          className="ml-1 hover:text-destructive"
                          disabled={isSubmitting || success}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Allergens */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Allergens</h3>

              <div className="grid grid-cols-2 gap-2">
                {ALLERGEN_OPTIONS.map((allergen) => (
                  <label
                    key={allergen.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.allergens.includes(allergen.value)}
                      onChange={() => toggleAllergen(allergen.value)}
                      disabled={isSubmitting || success}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">{allergen.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">Additional Details</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="spiceLevel">Spice Level</Label>
                  <Select
                    value={formData.spiceLevel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, spiceLevel: value }))}
                    disabled={isSubmitting || success}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select spice level" />
                    </SelectTrigger>
                    <SelectContent>
                      {SPICE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Active</Label>
                    <p className="text-xs text-muted-foreground">
                      Item is available for ordering
                    </p>
                  </div>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    disabled={isSubmitting || success}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Featured</Label>
                    <p className="text-xs text-muted-foreground">
                      Highlight this item on the menu
                    </p>
                  </div>
                  <Switch
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                    disabled={isSubmitting || success}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting || success}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || success}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Product...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Added!
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
