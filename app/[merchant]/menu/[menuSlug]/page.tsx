import { notFound } from 'next/navigation';
import { TemplateEngine } from '@/components/menu-showcase/template-engine';
import { AnalyticsProvider } from '@/components/menu-showcase/analytics-provider';
import { menuShowcaseService } from '@/lib/services/menu-showcase';

interface MenuPageProps {
  params: Promise<{
    merchant: string;
    menuSlug: string;
  }>;
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { merchant, menuSlug } = await params;

  // Fetch restaurant menu data with specific menu slug
  const menuData = await menuShowcaseService.getPublicMenuData(merchant, menuSlug);

  // If no menu found, show 404
  if (!menuData) {
    notFound();
  }

  return (
    <AnalyticsProvider restaurantId={menuData.restaurant.id} menuId={menuData.menu.id}>
      <TemplateEngine menuData={menuData} />
    </AnalyticsProvider>
  );
}

export async function generateMetadata({ params }: MenuPageProps) {
  const { merchant, menuSlug } = await params;
  
  // Fetch the actual restaurant and menu data
  const menuData = await menuShowcaseService.getPublicMenuData(merchant, menuSlug);
  
  if (!menuData) {
    // Fallback to slug-based name if menu not found
    const restaurantName = merchant.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const menuName = menuSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      title: `${restaurantName} - ${menuName}`,
      description: `Browse the ${menuName} at ${restaurantName}.`,
    };
  }

  // Use actual restaurant name and menu name
  const title = `${menuData.restaurant.name} - ${menuData.menu.name}`;
  
  return {
    title,
    description: `Browse the ${menuData.menu.name} at ${menuData.restaurant.name}. View our categories and delicious dishes.`,
  };
}

