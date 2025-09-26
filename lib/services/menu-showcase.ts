import { createClient } from '@/lib/supabase/client';
import { PublicMenuData, MenuDisplaySettings } from '@/lib/types/templates';

export class MenuShowcaseService {
  private supabase = createClient();

  /**
   * Fetch public menu data for a restaurant by slug
   */
  async getPublicMenuData(restaurantSlug: string): Promise<PublicMenuData | null> {
    try {
      // Fetch restaurant data
      const { data: restaurant, error: restaurantError } = await this.supabase
        .from('restaurants')
        .select(`
          id,
          name,
          slug,
          description,
          logo_url,
          cuisine,
          address,
          phone,
          website,
          hours
        `)
        .eq('slug', restaurantSlug)
        .eq('is_active', true)
        .maybeSingle();

      if (restaurantError) {
        console.error('Database error fetching restaurant:', restaurantError);
        return null;
      }

      if (!restaurant) {
        console.log(`Restaurant with slug "${restaurantSlug}" not found`);
        return null;
      }

      // First, fetch the default menu
      const { data: menuData, error: menuError } = await this.supabase
        .from('menus')
        .select('id, name, description, currency')
        .eq('restaurant_id', restaurant.id)
        .eq('is_active', true)
        .eq('is_default', true)
        .maybeSingle();

      if (menuError) {
        console.error('Database error fetching menu:', menuError);
        return null;
      }

      if (!menuData) {
        console.log(`No default menu found for restaurant "${restaurant.name}" (${restaurant.id})`);

        // Debug: Check what menus exist for this restaurant
        const { data: allMenus } = await this.supabase
          .from('menus')
          .select('id, name, is_default, is_active')
          .eq('restaurant_id', restaurant.id);

        console.log('Available menus for this restaurant:', allMenus);
        return null;
      }

      console.log(`Found default menu: "${menuData.name}" (${menuData.id}) for restaurant "${restaurant.name}"`);

      // Now fetch categories and items for this menu
      const { data: categoriesData, error: categoriesError } = await this.supabase
        .from('categories')
        .select(`
          id,
          name,
          slug,
          description,
          image_url,
          sort_order,
          category_menu_items (
            sort_order,
            menu_items (
              id,
              name,
              slug,
              description,
              long_description,
              price,
              discount_price,
              image_url,
              ingredients,
              allergens,
              spice_level,
              is_featured
            )
          )
        `)
        .eq('menu_id', menuData.id)
        .order('sort_order');

      if (categoriesError) {
        console.error('Database error fetching categories:', categoriesError);
        return null;
      }

      // Transform the data structure
      console.log('Raw categories data:', JSON.stringify(categoriesData, null, 2));
      
      const categories = (categoriesData || [])
        .map(category => {
          console.log(`Processing category: ${category.name}`);
          console.log('category_menu_items:', category.category_menu_items);
          
          const items = (category.category_menu_items || [])
            .filter(cmi => {
              console.log('cmi:', cmi);
              console.log('cmi.menu_items type:', typeof cmi.menu_items);
              console.log('cmi.menu_items isArray:', Array.isArray(cmi.menu_items));
              console.log('cmi.menu_items:', cmi.menu_items);
              return cmi.menu_items;
            })
            .map(cmi => {
              // Handle both object and array cases
              const menuItem = Array.isArray(cmi.menu_items) ? cmi.menu_items[0] : cmi.menu_items;
              return {
                id: menuItem.id,
                name: menuItem.name,
                slug: menuItem.slug,
                description: menuItem.description,
                long_description: menuItem.long_description,
                price: menuItem.price,
                discount_price: menuItem.discount_price,
                image_url: menuItem.image_url,
                ingredients: menuItem.ingredients,
                allergens: menuItem.allergens,
                spice_level: menuItem.spice_level,
                is_featured: menuItem.is_featured,
                sort_order: cmi.sort_order
              };
            })
            .sort((a, b) => a.sort_order - b.sort_order);
            
          console.log(`Items for ${category.name}:`, items);
          
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image_url: category.image_url,
            sort_order: category.sort_order,
            items
          };
        })
        .sort((a, b) => a.sort_order - b.sort_order);

      // Get display settings (with defaults)
      const displaySettings = await this.getDisplaySettings(restaurant.id);

      return {
        restaurant,
        menu: {
          id: menuData.id,
          name: menuData.name,
          description: menuData.description,
          currency: menuData.currency,
          categories
        },
        display_settings: displaySettings
      };

    } catch (error) {
      console.error('Error fetching public menu data:', error);
      return null;
    }
  }

  /**
   * Get display settings for a restaurant (with defaults)
   */
  private async getDisplaySettings(restaurantId: string): Promise<MenuDisplaySettings> {
    // For now, return default settings
    // In the future, this could be stored in a restaurant_settings table
    return {
      template: 'classic',
      theme: 'warm',
      show_prices: true,
      show_descriptions: true,
      show_images: true,
      show_allergens: true,
      show_spice_levels: true,
      show_categories: true,
      enable_search: false,
      enable_filters: false,
      typography: {
        heading_font: 'Georgia',
        body_font: 'Inter',
        font_size: 'medium'
      },
      layout: {
        columns: 3,
        spacing: 'normal',
        border_radius: 'medium'
      }
    };
  }

  /**
   * Update display settings for a restaurant
   */
  async updateDisplaySettings(
    restaurantId: string, 
    settings: Partial<MenuDisplaySettings>
  ): Promise<boolean> {
    try {
      // This would update the restaurant_settings table
      // For now, we'll just return true as a placeholder
      console.log('Updating display settings for restaurant:', restaurantId, settings);
      return true;
    } catch (error) {
      console.error('Error updating display settings:', error);
      return false;
    }
  }

  /**
   * Get available templates (simplified to just Classic with different themes)
   */
  getAvailableTemplates() {
    return [
      {
        id: 'classic-warm',
        name: 'Classic Warm',
        description: 'Traditional menu with warm, inviting colors',
        template: 'classic' as const,
        theme: 'warm' as const,
        preview: '/templates/classic-warm.jpg'
      },
      {
        id: 'classic-cool',
        name: 'Classic Cool',
        description: 'Traditional menu with cool, calming colors',
        template: 'classic' as const,
        theme: 'cool' as const,
        preview: '/templates/classic-cool.jpg'
      },
      {
        id: 'classic-neutral',
        name: 'Classic Neutral',
        description: 'Traditional menu with neutral, professional colors',
        template: 'classic' as const,
        theme: 'neutral' as const,
        preview: '/templates/classic-neutral.jpg'
      },
      {
        id: 'classic-vibrant',
        name: 'Classic Vibrant',
        description: 'Traditional menu with vibrant, energetic colors',
        template: 'classic' as const,
        theme: 'vibrant' as const,
        preview: '/templates/classic-vibrant.jpg'
      },
      {
        id: 'classic-earth',
        name: 'Classic Earth',
        description: 'Traditional menu with natural, earthy colors',
        template: 'classic' as const,
        theme: 'earth' as const,
        preview: '/templates/classic-earth.jpg'
      },
      {
        id: 'minimal-basic',
        name: 'Minimal Basic',
        description: 'Minimal template showing only restaurant name',
        template: 'minimal' as const,
        theme: 'neutral' as const,
        preview: '/templates/minimal-basic.jpg'
      }
    ];
  }

  /**
   * Generate mock data for development/preview
   * todo: remove this after testing...
   */
  generateMockMenuData(restaurantSlug: string): PublicMenuData {
    return {
      restaurant: {
        id: 'mock-restaurant-id',
        name: restaurantSlug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        slug: restaurantSlug,
        description: 'Experience authentic flavors and exceptional dining in a warm, welcoming atmosphere.',
        logo_url: '/logo-placeholder.png',
        cuisine: 'Italian',
        address: '123 Main Street, City, State 12345',
        phone: '(555) 123-4567',
        website: `https://${restaurantSlug}.com`,
        hours: {
          'Monday': '11:00 AM - 10:00 PM',
          'Tuesday': '11:00 AM - 10:00 PM',
          'Wednesday': '11:00 AM - 10:00 PM',
          'Thursday': '11:00 AM - 10:00 PM',
          'Friday': '11:00 AM - 11:00 PM',
          'Saturday': '11:00 AM - 11:00 PM',
          'Sunday': '12:00 PM - 9:00 PM'
        }
      },
      menu: {
        id: 'mock-menu-id',
        name: 'Main Menu',
        description: 'Our carefully crafted selection of dishes made with the finest ingredients.',
        currency: 'USD',
        categories: [
          {
            id: 'appetizers',
            name: 'Appetizers',
            slug: 'appetizers',
            description: 'Start your meal with our delicious appetizers',
            image_url: '/category-appetizers.jpg',
            sort_order: 1,
            items: [
              {
                id: 'bruschetta',
                name: 'Classic Bruschetta',
                slug: 'classic-bruschetta',
                description: 'Toasted bread topped with fresh tomatoes, basil, and garlic',
                price: 12.99,
                image_url: '/food-bruschetta.jpg',
                ingredients: ['Tomatoes', 'Basil', 'Garlic', 'Olive Oil', 'Bread'],
                allergens: ['gluten'],
                is_featured: true,
                sort_order: 1
              },
              {
                id: 'calamari',
                name: 'Fried Calamari',
                slug: 'fried-calamari',
                description: 'Crispy squid rings served with marinara sauce',
                price: 15.99,
                discount_price: 12.99,
                image_url: '/food-calamari.jpg',
                ingredients: ['Squid', 'Flour', 'Marinara Sauce'],
                allergens: ['gluten', 'shellfish'],
                spice_level: 'mild',
                is_featured: false,
                sort_order: 2
              }
            ]
          },
          {
            id: 'mains',
            name: 'Main Courses',
            slug: 'main-courses',
            description: 'Our signature dishes and hearty main courses',
            image_url: '/category-mains.jpg',
            sort_order: 2,
            items: [
              {
                id: 'margherita-pizza',
                name: 'Margherita Pizza',
                slug: 'margherita-pizza',
                description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
                price: 18.99,
                image_url: '/food-margherita.jpg',
                ingredients: ['Mozzarella', 'Tomatoes', 'Basil', 'Pizza Dough'],
                allergens: ['dairy', 'gluten'],
                is_featured: true,
                sort_order: 1
              },
              {
                id: 'chicken-parm',
                name: 'Chicken Parmigiana',
                slug: 'chicken-parmigiana',
                description: 'Breaded chicken breast with marinara sauce and melted cheese',
                price: 24.99,
                image_url: '/food-chicken-parm.jpg',
                ingredients: ['Chicken', 'Marinara Sauce', 'Mozzarella', 'Breadcrumbs'],
                allergens: ['dairy', 'gluten', 'eggs'],
                is_featured: false,
                sort_order: 2
              }
            ]
          }
        ]
      },
      display_settings: {
        template: 'classic',
        theme: 'warm',
        show_prices: true,
        show_descriptions: true,
        show_images: true,
        show_allergens: true,
        show_spice_levels: true,
        show_categories: true,
        enable_search: false,
        enable_filters: false
      }
    };
  }
}

// Export singleton instance
export const menuShowcaseService = new MenuShowcaseService();
