'use client';

import { PublicMenuData, MenuItem as MenuItemType } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { useDisplayImage } from '@/lib/utils/image-display';
import { ImageIcon, Loader2, Star, ChefHat } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { TemplateWrapper, MenuHeader } from '../template-engine';

interface ClassicTemplateProps {
  menuData: PublicMenuData;
}

// Component for displaying menu item images with fallback
export function ItemImage({ imageUrl, itemName, size = 'md' }: { 
  imageUrl?: string | null; 
  itemName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'cover' | 'hero';
}) {
  const { displayUrl, loading } = useDisplayImage(imageUrl || null);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
    '2xl': 'w-28 h-28',
    '3xl': 'w-64 h-64',
    cover: 'w-full h-80',
    hero: 'w-full h-96'
  };
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
    '2xl': 'h-12 w-12',
    '3xl': 'h-24 w-24',
    cover: 'h-20 w-20',
    hero: 'h-24 w-24'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-100 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center`}>
      {loading ? (
        <Loader2 className={`${iconSizes[size]} text-gray-400 animate-spin`} />
      ) : displayUrl ? (
        <img 
          src={displayUrl} 
          alt={`${itemName} image`}
          className="w-full h-full object-cover"
        />
      ) : (
        <ImageIcon className={`${iconSizes[size]} text-gray-400`} />
      )}
    </div>
  );
}

// Traditional menu-style MenuItem component 
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
      className="group cursor-pointer hover:bg-gray-50/50 transition-colors duration-200 py-3 px-4"
      onClick={() => onItemClick(item)}
    >
      <div className="flex gap-3 items-start">
        {/* Smaller Image */}
        <div className="relative flex-shrink-0">
          <ItemImage 
            imageUrl={item.image_url} 
            itemName={item.name}
            size="sm"
          />
          {item.is_featured && (
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white rounded-full p-0.5">
              <Star className="w-2 h-2 fill-current" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          {/* Header with name and price on same line */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <h3 className="font-medium text-base text-gray-900 leading-tight">
              {item.name}
            </h3>
            <div className="flex-1 border-b border-dotted border-gray-300 mx-2 mb-1"></div>
            <span className="font-semibold text-base text-gray-900 whitespace-nowrap">
              {formatPrice(item.price, menuCurrency)}
            </span>
          </div>

          {/* Description */}
          {showDescriptions && item.description && (
            <p className="text-xs text-gray-600 leading-snug mb-1 line-clamp-2">
              {item.description.length > 100 
                ? `${item.description.substring(0, 100)}...` 
                : item.description}
            </p>
          )}

          {/* Meta info in compact format */}
          {(item.spice_level || item.ingredients) && (
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {item.spice_level && (
                <span className="capitalize flex items-center gap-1">
                  <ChefHat className="w-3 h-3" />
                  {item.spice_level}
                </span>
              )}
              {item.ingredients && (
                <span className="truncate max-w-32">
                  {item.ingredients}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export function ClassicTemplate({ menuData }: ClassicTemplateProps) {
  const { restaurant, menu, display_settings } = menuData;
  const router = useRouter();
  const params = useParams();

  // Get menu currency or default to USD
  const menuCurrency = (menu.currency as SupportedCurrency) || 'USD';

  // Handle item click to navigate to product page
  const handleItemClick = (item: (typeof menu.categories)[0]['items'][0]) => {
    const merchantSlug = params.merchant as string;
    router.push(`/${merchantSlug}/item/${item.id}`);
  };


  return (
    <TemplateWrapper className="classic-template bg-gray-50">
      {/* Decorative Border Container */}
      <div className="max-w-5xl mx-auto p-2 md:p-8">
        <div className="bg-white border-4 border-gray-800 relative">
          {/* Header */}
          <MenuHeader 
            restaurant={restaurant} 
            menu={menu}
            showLogo={false}
            showDescription={true}
          />

          {/* Main Menu Content */}
          <main className="px-4 md:px-12 pb-8">
            
            {/* Categories - Each with Two Column Layout */}
            {menu.categories.map((category) => (
              <div key={category.id} className="mb-16">
                
                {/* Category Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-8 bg-gray-800 rounded-full mr-4"></div>
                    <div className="bg-gray-800 text-white px-6 py-2 rounded-full">
                      <span className="text-lg font-bold tracking-wider uppercase">{category.name}</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-800 rounded-full ml-4"></div>
                  </div>
                </div>

                {/* Traditional Menu List Layout */}
                <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="divide-y divide-gray-100">
                    {category.items.map((item) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        menuCurrency={menuCurrency}
                        showDescriptions={display_settings.show_descriptions}
                        onItemClick={handleItemClick}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}

          </main>
        </div>
      </div>

    </TemplateWrapper>
  );
}
