'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Store } from 'lucide-react';

type CuisineType = Database['public']['Enums']['cuisine_type'];

const cuisineOptions: { value: CuisineType; label: string }[] = [
  { value: 'italian', label: 'Italian' },
  { value: 'american', label: 'American' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'asian', label: 'Asian' },
  { value: 'mediterranean', label: 'Mediterranean' },
  { value: 'french', label: 'French' },
  { value: 'indian', label: 'Indian' },
  { value: 'thai', label: 'Thai' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'greek', label: 'Greek' },
  { value: 'other', label: 'Other' },
];

const formSchema = z.object({
  name: z.string().min(2, 'Restaurant name must be at least 2 characters').max(100, 'Restaurant name must be less than 100 characters'),
  slug: z.string().min(2, 'URL slug must be at least 2 characters').max(50, 'URL slug must be less than 50 characters').regex(/^[a-z0-9-]+$/, 'URL slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  cuisine: z.enum(['italian', 'american', 'mexican', 'asian', 'mediterranean', 'french', 'indian', 'thai', 'japanese', 'chinese', 'greek', 'other']).optional(),
  owner_name: z.string().min(2, 'Owner name must be at least 2 characters').max(100, 'Owner name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

interface CreateRestaurantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateRestaurantDialog({ open, onOpenChange }: CreateRestaurantDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshRestaurants } = useRestaurant();
  const supabase = createClient();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      cuisine: undefined,
      owner_name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
    },
  });

  // Auto-generate slug from restaurant name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setValue('slug', slug);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if slug is already taken
      const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('id')
        .eq('slug', data.slug)
        .single();

      if (existingRestaurant) {
        form.setError('slug', {
          type: 'manual',
          message: 'This URL slug is already taken. Please choose a different one.',
        });
        return;
      }

      // Create restaurant
      const { data: restaurant, error } = await supabase
        .from('restaurants')
        .insert({
          user_id: user.id,
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          cuisine: data.cuisine || null,
          owner_name: data.owner_name,
          email: data.email,
          phone: data.phone || null,
          address: data.address || null,
          website: data.website || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Refresh restaurants list and close dialog
      await refreshRestaurants();
      onOpenChange(false);
      form.reset();

      // Show success message or redirect
      router.push('/dashboard/restaurant');
    } catch (error) {
      console.error('Error creating restaurant:', error);
      form.setError('root', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Failed to create restaurant. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Store className="mr-2 h-5 w-5" />
            Create Your Restaurant
          </DialogTitle>
          <DialogDescription>
            Set up your restaurant profile to start building your digital menu catalog.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Restaurant Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Mario's Italian Kitchen"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleNameChange(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of your restaurant as it will appear to customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* URL Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Slug *</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        catalogstudio.com/
                      </span>
                      <Input
                        placeholder="marios-italian-kitchen"
                        className="rounded-l-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    This will be your restaurant's unique URL. Only lowercase letters, numbers, and hyphens allowed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell customers about your restaurant, cuisine, and what makes you special..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of your restaurant (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cuisine Type */}
            <FormField
              control={form.control}
              name="cuisine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your cuisine type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cuisineOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of cuisine your restaurant serves (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Owner Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="owner_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@restaurant.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourrestaurant.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="123 Main Street, City, State 12345"
                      className="resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your restaurant's physical address (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {form.formState.errors.root && (
              <div className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Restaurant
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
