import { notFound } from 'next/navigation';
import { TemplateEngine } from '@/components/menu-showcase/template-engine';
import { AnalyticsProvider } from '@/components/menu-showcase/analytics-provider';
import { menuShowcaseService } from '@/lib/services/menu-showcase';

interface MerchantPageProps {
  params: Promise<{
    merchant: string;
  }>;
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  const { merchant } = await params;

  // Fetch restaurant menu data
  const menuData = await menuShowcaseService.getPublicMenuData(merchant);

  // If no restaurant found, show 404
  if (!menuData) {
    notFound();
  }

  return (
    <AnalyticsProvider restaurantId={menuData.restaurant.id} menuId={menuData.menu.id}>
      <TemplateEngine menuData={menuData} />
    </AnalyticsProvider>
  );
}

export async function generateMetadata({ params }: MerchantPageProps) {
  const { merchant } = await params;
  
  // Fetch the actual restaurant and menu data
  const menuData = await menuShowcaseService.getPublicMenuData(merchant);
  
  if (!menuData) {
    // Fallback to slug-based name if restaurant not found
    const restaurantName = merchant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: `${restaurantName} - Menu`,
      description: `Browse the menu at ${restaurantName}. View our categories and delicious dishes.`,
    };
  }

  // Use actual restaurant name and menu name
  const title = `${menuData.restaurant.name} - ${menuData.menu.name}`;
  
  return {
    title,
    description: `Browse the ${menuData.menu.name} at ${menuData.restaurant.name}. View our categories and delicious dishes.`,
  };
}
