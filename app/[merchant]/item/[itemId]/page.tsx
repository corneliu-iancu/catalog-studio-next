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

  // Fetch restaurant menu data
  const menuData = await menuShowcaseService.getPublicMenuData(merchant);

  // If no restaurant found, show 404
  if (!menuData) {
    notFound();
  }

  // Find the specific item across all categories
  let foundItem = null;
  for (const category of menuData.menu.categories) {
    const item = category.items.find(item => item.id === itemId);
    if (item) {
      foundItem = item;
      break;
    }
  }

  // If item not found, show 404
  if (!foundItem) {
    notFound();
  }

  const menuCurrency = (menuData.menu.currency as SupportedCurrency) || 'USD';

  return (
    <AnalyticsProvider restaurantId={menuData.restaurant.id} menuId={menuData.menu.id}>
      <ProductPage
        item={foundItem}
        restaurant={menuData.restaurant}
        currency={menuCurrency}
        // No onBack prop - we'll use browser navigation
      />
    </AnalyticsProvider>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { merchant, itemId } = await params;
  
  // Fetch the actual restaurant and menu data
  const menuData = await menuShowcaseService.getPublicMenuData(merchant);
  
  if (!menuData) {
    return {
      title: 'Menu Item Not Found',
      description: 'The requested menu item could not be found.',
    };
  }

  // Find the specific item across all categories
  let foundItem = null;
  for (const category of menuData.menu.categories) {
    const item = category.items.find(item => item.id === itemId);
    if (item) {
      foundItem = item;
      break;
    }
  }

  if (!foundItem) {
    return {
      title: 'Menu Item Not Found',
      description: 'The requested menu item could not be found.',
    };
  }

  // Use actual item name and restaurant name
  const title = `${foundItem.name} - ${menuData.restaurant.name}`;
  const description = foundItem.description 
    ? `${foundItem.description} Available at ${menuData.restaurant.name}.`
    : `${foundItem.name} available at ${menuData.restaurant.name}. View details, ingredients, and pricing.`;
  
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
