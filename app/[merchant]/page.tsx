import { notFound } from 'next/navigation';
import { TemplateEngine } from '@/components/menu-showcase/template-engine';
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
    <div className="min-h-screen">
      {/* Debug Info - Remove in production */}
      {/* <div className="bg-yellow-50 border-b border-yellow-200 p-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            🐛 Template Debug Info (Development Only) - REAL DATA LOADED ✅
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <strong className="text-yellow-700">Template:</strong>
              <span className="ml-2 bg-yellow-100 px-2 py-1 rounded capitalize">
                {menuData.display_settings.template}
              </span>
            </div>
            <div>
              <strong className="text-yellow-700">Theme:</strong>
              <span className="ml-2 bg-yellow-100 px-2 py-1 rounded capitalize">
                {menuData.display_settings.theme}
              </span>
            </div>
            <div>
              <strong className="text-yellow-700">Restaurant:</strong>
              <span className="ml-2 bg-yellow-100 px-2 py-1 rounded">
                {menuData.restaurant.name} ({menuData.restaurant.slug})
              </span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${menuData.display_settings.show_prices ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Prices: {menuData.display_settings.show_prices ? 'ON' : 'OFF'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${menuData.display_settings.show_images ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Images: {menuData.display_settings.show_images ? 'ON' : 'OFF'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${menuData.display_settings.show_descriptions ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Descriptions: {menuData.display_settings.show_descriptions ? 'ON' : 'OFF'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${menuData.display_settings.enable_search ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>Search: {menuData.display_settings.enable_search ? 'ON' : 'OFF'}</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-600">
            <strong>Menu Items:</strong> {menuData.menu.categories.reduce((total, cat) => total + cat.items.length, 0)} items across {menuData.menu.categories.length} categories
          </div>
        </div>
      </div> */}
      <TemplateEngine menuData={menuData} />
    </div>
  );
}

export async function generateMetadata({ params }: MerchantPageProps) {
  const { merchant } = await params;
  const restaurantName = merchant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${restaurantName} - Menu`,
    description: `Browse the menu at ${restaurantName}. View our categories and delicious dishes.`,
  };
}
