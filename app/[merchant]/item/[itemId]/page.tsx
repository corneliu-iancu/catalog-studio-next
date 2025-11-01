import { notFound } from 'next/navigation';
import { ProductPage } from '@/components/menu-showcase/product-page';
import { AnalyticsProvider } from '@/components/menu-showcase/analytics-provider';
import { menuShowcaseService } from '@/lib/services/menu-showcase';
import type { SupportedCurrency } from '@/lib/utils/currency';

interface ProductPageProps {
  params: Promise<{
    merchant: string;
    itemId: string;
  }>;
}

export default async function ItemPage({ params }: ProductPageProps) {
  const { merchant, itemId } = await params;

  // Search for the item across ALL active menus in the restaurant
  const result = await menuShowcaseService.findItemInRestaurant(merchant, itemId);

  // If no item found, show 404
  if (!result) {
    console.error(`[ItemPage] Item not found: ${itemId} in restaurant: ${merchant}`);
    notFound();
  }

  const { item: foundItem, menu, category, restaurant } = result;
  
  console.log(`[ItemPage] Found item "${foundItem.name}" in menu "${menu.name}" category "${category.name}"`);

  const menuCurrency = (menu.currency as SupportedCurrency) || 'USD';
  
  // Load display settings to get the template
  const displaySettings = await menuShowcaseService.loadDisplaySettings(restaurant.id);

  return (
    <AnalyticsProvider restaurantId={restaurant.id} menuId={menu.id}>
      <ProductPage
        item={foundItem}
        restaurant={restaurant}
        currency={menuCurrency}
        template={displaySettings.template}
        // No onBack prop - we'll use browser navigation
      />
    </AnalyticsProvider>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { merchant, itemId } = await params;
  
  // Search for the item across all menus
  const result = await menuShowcaseService.findItemInRestaurant(merchant, itemId);
  
  if (!result) {
    return {
      title: 'Menu Item Not Found',
      description: 'The requested menu item could not be found.',
    };
  }

  const { item: foundItem, restaurant } = result;

  // Use actual item name and restaurant name
  const title = `${foundItem.name} - ${restaurant.name}`;
  const description = foundItem.description 
    ? `${foundItem.description} Available at ${restaurant.name}.`
    : `${foundItem.name} available at ${restaurant.name}. View details, ingredients, and pricing.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: foundItem.image_url ? [foundItem.image_url] : [],
    },
  };
}
