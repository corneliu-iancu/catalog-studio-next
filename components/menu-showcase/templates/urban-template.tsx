'use client';

import { PublicMenuData, MenuItem as MenuItemType } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { useDisplayImage } from '@/lib/utils/image-display';
import { ImageIcon, Loader2, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { TemplateWrapper } from '../template-engine';
import { TrackableMenuItem, TrackableCategory } from '../analytics-provider';

interface UrbanTemplateProps {
  menuData: PublicMenuData;
}

// Component for displaying menu item images with fallback
function ItemImage({ imageUrl, itemName }: { 
  imageUrl?: string | null; 
  itemName: string;
}) {
  const { displayUrl, loading } = useDisplayImage(imageUrl || null);
  
  if (loading) {
    return (
      <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-amber-500/50 animate-spin" />
      </div>
    );
  }
  
  if (!displayUrl) {
    return (
      <div className="absolute inset-0 bg-zinc-900/50 flex items-center justify-center">
        <ImageIcon className="h-16 w-16 text-amber-500/30" />
      </div>
    );
  }
  
  return (
    <img 
      src={displayUrl} 
      alt={itemName}
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

// Magazine-style menu item card - text first, image below
function MenuItemCard({ 
  item, 
  menuCurrency, 
  showDescriptions, 
  onItemClick 
}: { 
  item: MenuItemType;
  menuCurrency: SupportedCurrency;
  showDescriptions: boolean;
  onItemClick: (item: MenuItemType) => void;
}) {
  return (
    <div 
      className="group cursor-pointer bg-zinc-950 transition-all duration-300 overflow-hidden"
      onClick={() => onItemClick(item)}
    >
      {/* Text Content First */}
      <div className="p-6 md:p-8">
        {/* Item Name - Handwritten/Script style */}
        <h3 className="text-2xl md:text-3xl text-amber-400 mb-3 font-dancing leading-tight">
          {item.name}
        </h3>
        
        {/* Price - Bold and prominent */}
        <p className="text-xl md:text-2xl font-bold text-zinc-400 mb-4 font-playfair">
          {formatPrice(item.price, menuCurrency)}
        </p>
        
        {/* Description */}
        {showDescriptions && item.description && (
          <p className="text-sm md:text-base text-zinc-400 leading-relaxed mb-4 font-light">
            {item.description}
          </p>
        )}
        
        {/* Meta badges */}
        <div className="flex items-center gap-2 mb-4">
          {item.is_featured && (
            <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded uppercase tracking-wider">
              Featured
            </span>
          )}
          {item.spice_level && (
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded flex items-center gap-1 capitalize">
              <Flame className="w-3 h-3" />
              {item.spice_level}
            </span>
          )}
        </div>
        
        {/* Ingredients - Small text */}
        {item.ingredients && (
          <p className="text-xs text-zinc-600 line-clamp-2 pt-3">
            {item.ingredients}
          </p>
        )}
      </div>

      {/* Image Below - Only if exists */}
      {item.image_url && (
        <div className="px-5 pb-5">
          <div className="relative w-full" style={{ aspectRatio: '1' }}>
            <ItemImage 
              imageUrl={item.image_url}
              itemName={item.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}


export function UrbanTemplate({ menuData }: UrbanTemplateProps) {
  const { restaurant, menu, display_settings } = menuData;
  const router = useRouter();
  const { displayUrl: logoUrl } = useDisplayImage(restaurant.logo_url || null);

  // Get menu currency or default to USD
  const menuCurrency = (menu.currency as SupportedCurrency) || 'USD';

  // Handle item click to navigate to product page
  const handleItemClick = (item: (typeof menu.categories)[0]['items'][0]) => {
    router.push(`/${restaurant.slug}/item/${item.id}`);
  };

  return (
    <TemplateWrapper className="urban-template">
      {/* Dark slate background */}
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* Hero Header - Minimal and elegant */}
        <header className="relative py-12 md:py-16 px-4 md:px-8 bg-gradient-to-b from-zinc-950 to-[#0a0a0a]">
          <div className="max-w-7xl mx-auto text-center">
            {/* Logo */}
            {logoUrl && (
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24">
                  <img 
                    src={logoUrl} 
                    alt={`${restaurant.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
            
            {/* Restaurant Name - Handwritten/Script style */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-amber-500 mb-3 font-dancing drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              {restaurant.name}
            </h1>
            
            {/* Tagline */}
            {(restaurant.description || menu.description) && (
              <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-light">
                {restaurant.description || menu.description}
              </p>
            )}
            
            {/* Decorative line */}
            <div className="mt-6 flex items-center justify-center">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
            </div>
          </div>
        </header>

        {/* Main Menu Grid - Magazine/Catalog Style */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          {menu.categories && menu.categories.length > 0 ? (
            <div className="space-y-16">
              {[...menu.categories]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((category) => (
                  <TrackableCategory key={category.id} categoryId={category.id}>
                    <div>
                      {/* Category Header - Minimal */}
                      <div className="mb-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-dancing text-amber-500 mb-2">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-sm md:text-base text-zinc-500 font-light">
                            {category.description}
                          </p>
                        )}
                        <div className="mt-4 h-px w-24 bg-amber-500/30 mx-auto"></div>
                      </div>

                      {/* Items Grid - CSS Columns Masonry Layout */}
                      {category.items && category.items.length > 0 ? (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
                          {category.items.map((item) => (
                            <TrackableMenuItem key={item.id} itemId={item.id}>
                              <div className="break-inside-avoid mb-6 md:mb-8">
                                <MenuItemCard
                                  item={item}
                                  menuCurrency={menuCurrency}
                                  showDescriptions={display_settings.show_descriptions}
                                  onItemClick={handleItemClick}
                                />
                              </div>
                            </TrackableMenuItem>
                          ))}
                        </div>
                      ) : (
                        <p className="text-zinc-600 text-center py-12">No items available</p>
                      )}
                    </div>
                  </TrackableCategory>
                ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-zinc-600 text-lg">Menu coming soon</p>
            </div>
          )}
        </main>

        {/* Footer - Minimal contact info */}
        <footer className="border-t border-zinc-900 bg-zinc-950 mt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
            <div className="text-center space-y-3">
              <p className="text-xl text-amber-500 font-dancing">{restaurant.name}</p>
              {restaurant.cuisine && (
                <p className="text-sm text-zinc-500 uppercase tracking-wider">{restaurant.cuisine}</p>
              )}
              <div className="flex items-center justify-center gap-6 text-sm text-zinc-600 mt-4">
                {restaurant.address && <span>{restaurant.address}</span>}
                {restaurant.phone && <span>{restaurant.phone}</span>}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TemplateWrapper>
  );
}
