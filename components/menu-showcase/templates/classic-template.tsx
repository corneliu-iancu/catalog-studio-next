'use client';

import { useState } from 'react';
import { PublicMenuData, MenuItem as MenuItemType } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { useDisplayImage } from '@/lib/utils/image-display';
import { ImageIcon, Loader2, Star, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter, useParams } from 'next/navigation';

import { TemplateWrapper, MenuHeader, CategorySection } from '../template-engine';

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

// Modern, card-based MenuItem component with shadcn styling
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
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 border-0 bg-gradient-to-r from-white to-gray-50/30 mb-6"
      onClick={() => onItemClick(item)}
    >
      <CardContent className="p-0">
        <div className="flex gap-4 p-4">
          {/* Modern Image with better aspect ratio */}
          <div className="relative flex-shrink-0">
            <ItemImage 
              imageUrl={item.image_url} 
              itemName={item.name}
              size="md"
            />
            {item.is_featured && (
              <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full p-1.5 shadow-lg">
                <Star className="w-3 h-3 fill-current" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Header with name and price */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
                {item.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-3 py-1.5 whitespace-nowrap shadow-sm"
              >
                {formatPrice(item.price, menuCurrency)}
              </Badge>
            </div>

            {/* Description */}
            {showDescriptions && item.description && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {item.description.length > 120 
                  ? `${item.description.substring(0, 120)}...` 
                  : item.description}
              </p>
            )}

            {/* Bottom row with meta info */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {item.spice_level && (
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-3 h-3" />
                    <span className="capitalize">{item.spice_level}</span>
                  </div>
                )}
                {item.ingredients && (
                  <div className="flex items-center gap-1 max-w-32">
                    <span className="truncate">{item.ingredients}</span>
                  </div>
                )}
              </div>
              
              {/* Subtle arrow indicator */}
              <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                <div className="w-2 h-2 rounded-full bg-current transform group-hover:scale-110 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
            {menu.categories.map((category, categoryIndex) => (
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

                {/* Modern Card Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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
            ))}

          </main>
        </div>
      </div>

    </TemplateWrapper>
  );
}
