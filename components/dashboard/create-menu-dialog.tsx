'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/types/database';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSupportedCurrencies, type SupportedCurrency } from '@/lib/utils/currency';
import { Loader2 } from 'lucide-react';

type Menu = Database['public']['Tables']['menus']['Row'];

const menuSchema = z.object({
  name: z.string().min(1, 'Menu name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(1000, 'Description too long').optional().or(z.literal('')),
  currency: z.enum(['RON', 'EUR', 'USD']),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  metaTitle: z.string().max(255, 'Meta title too long').optional().or(z.literal('')),
  metaDescription: z.string().max(500, 'Meta description too long').optional().or(z.literal('')),
});

type MenuFormData = z.infer<typeof menuSchema>;

interface CreateMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  onMenuCreated: (menu: Menu) => void;
  isFirstMenu?: boolean;
}

export default function CreateMenuDialog({
  open,
  onOpenChange,
  restaurantId,
  onMenuCreated,
  isFirstMenu = false
}: CreateMenuDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      currency: 'RON',
      isActive: true,
      isDefault: isFirstMenu, // First menu is automatically default
      metaTitle: '',
      metaDescription: '',
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setValue('slug', slug);
    
    // Auto-generate meta title
    if (name) {
      form.setValue('metaTitle', `${name} Menu`);
    }
  };

  const onSubmit = async (data: MenuFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if slug is unique within the restaurant
      const { data: existingMenu } = await supabase
        .from('menus')
        .select('slug')
        .eq('restaurant_id', restaurantId)
        .eq('slug', data.slug)
        .single();

      if (existingMenu) {
        form.setError('slug', {
          message: 'This slug is already used by another menu'
        });
        return;
      }

      // If this is set as default, unset other default menus
      if (data.isDefault) {
        await supabase
          .from('menus')
          .update({ is_default: false })
          .eq('restaurant_id', restaurantId);
      }

      // Create the menu
      const { data: newMenu, error } = await supabase
        .from('menus')
        .insert({
          restaurant_id: restaurantId,
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          currency: data.currency,
          is_active: data.isActive,
          is_default: data.isDefault,
          meta_title: data.metaTitle || null,
          meta_description: data.metaDescription || null,
          sort_order: 0, // TODO: Calculate proper sort order
        })
        .select()
        .single();

      if (error) throw error;

      onMenuCreated(newMenu);
      form.reset();
      
    } catch (error) {
      console.error('Error creating menu:', error);
      form.setError('root', {
        message: 'Failed to create menu. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Menu</DialogTitle>
          <DialogDescription>
            {isFirstMenu 
              ? "Create your restaurant's first menu. This will be set as your default menu."
              : "Add a new menu to your restaurant. You can create different menus for different occasions."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Main Menu, Breakfast, Dinner"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="main-menu" {...field} />
                  </FormControl>
                  <FormDescription>
                    Used in the menu URL. Only lowercase letters, numbers, and hyphens.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this menu..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {getSupportedCurrencies().map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.symbol} {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Currency for menu item prices
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription className="text-xs">
                        Menu is visible to customers
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {!isFirstMenu && (
                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Default</FormLabel>
                        <FormDescription className="text-xs">
                          Primary menu for restaurant
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>

            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Menu
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
