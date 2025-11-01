'use client';

import { PublicMenuData, MenuItem as MenuItemType } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { useDisplayImage } from '@/lib/utils/image-display';
import { ImageIcon, Loader2, Star, ChefHat } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { TemplateWrapper } from '../template-engine';
import { TrackableMenuItem, TrackableCategory } from '../analytics-provider';

interface ClassicTemplateProps {
  menuData: PublicMenuData;
}

// Sophisticated gold decorative ornament component - Art Deco inspired
function GoldOrnament({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { width: 10, height: 10, stroke: 1.2 },
    md: { width: 14, height: 14, stroke: 1.5 },
    lg: { width: 18, height: 18, stroke: 2 }
  };
  
  const { width, height, stroke } = sizes[size];
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 10 10" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="text-amber-400"
    >
      {/* Elegant geometric ornament - star/flower pattern */}
      <path 
        d="M5 0 L5.8 3.2 L9 2 L6.5 5 L9 8 L5.8 6.8 L5 10 L4.2 6.8 L1 8 L3.5 5 L1 2 L4.2 3.2 Z" 
        stroke="currentColor" 
        strokeWidth={stroke} 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      {/* Inner decorative circle */}
      <circle 
        cx="5" 
        cy="5" 
        r="1.5" 
        stroke="currentColor"
        strokeWidth={stroke * 0.6}
        fill="none"
      />
    </svg>
  );
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
    <div className={`${sizeClasses[size]} bg-gray-800 border border-amber-400/20 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center`}>
      {loading ? (
        <Loader2 className={`${iconSizes[size]} text-amber-400/50 animate-spin`} />
      ) : displayUrl ? (
        <img 
          src={displayUrl} 
          alt={`${itemName} image`}
          className="w-full h-full object-cover"
        />
      ) : (
        <ImageIcon className={`${iconSizes[size]} text-amber-400/30`} />
      )}
    </div>
  );
}

// Luxury menu-style MenuItem component with dark theme
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
      className="group cursor-pointer hover:bg-gray-800/30 transition-colors duration-200 py-4 px-2"
      onClick={() => onItemClick(item)}
    >
      <div className="flex flex-col">
        {/* Header with name and price on same line */}
        <div className="flex items-baseline justify-between gap-3 mb-2">
          <h3 className="font-medium text-sm md:text-base text-white leading-tight uppercase tracking-wide">
            {item.name}
          </h3>
          <div className="flex-1 border-b border-dotted border-amber-400/40 mx-2 mb-1"></div>
          <span className="font-semibold text-sm md:text-base text-white whitespace-nowrap">
            {formatPrice(item.price, menuCurrency)}
          </span>
        </div>

        {/* Description */}
        {showDescriptions && item.description && (
          <p className="text-xs text-gray-300 leading-relaxed mb-2 line-clamp-2 font-light">
            {item.description.length > 100 
              ? `${item.description.substring(0, 100)}...` 
              : item.description}
          </p>
        )}

        {/* Meta info in compact format */}
        {(item.spice_level || item.ingredients) && (
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {item.spice_level && (
              <span className="capitalize flex items-center gap-1">
                <ChefHat className="w-3 h-3 text-amber-400/60" />
                {item.spice_level}
              </span>
            )}
            {item.ingredients && (
              <span className="truncate max-w-48 font-light">
                {item.ingredients}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


export function ClassicTemplate({ menuData }: ClassicTemplateProps) {
  const { restaurant, menu, display_settings } = menuData;
  const router = useRouter();
  const { displayUrl: logoUrl } = useDisplayImage(restaurant.logo_url || null);

  // Get menu currency or default to USD
  const menuCurrency = (menu.currency as SupportedCurrency) || 'USD';

  // Handle item click to navigate to product page
  const handleItemClick = (item: (typeof menu.categories)[0]['items'][0]) => {
    // Use restaurant slug directly from menu data instead of params
    router.push(`/${restaurant.slug}/item/${item.id}`);
  };

  // Balance categories into two columns based on item counts while maintaining sort order
  const balanceCategories = () => {
    if (!menu.categories || menu.categories.length === 0) return [[], []];
    
    // Ensure categories are sorted by sort_order
    const sortedCategories = [...menu.categories].sort((a, b) => a.sort_order - b.sort_order);
    
    // Calculate weight for each category (items + header overhead)
    const categoriesWithWeights = sortedCategories.map(cat => ({
      category: cat,
      weight: (cat.items?.length || 0) + 3 // +3 for header overhead
    }));

    const column1: typeof menu.categories = [];
    const column2: typeof menu.categories = [];
    let weight1 = 0;
    let weight2 = 0;

    // Distribute categories sequentially while balancing weights
    // This maintains visual sort order (left-to-right, top-to-bottom reading)
    categoriesWithWeights.forEach(({ category, weight }) => {
      if (weight1 <= weight2) {
        column1.push(category);
        weight1 += weight;
      } else {
        column2.push(category);
        weight2 += weight;
      }
    });

    return [column1, column2];
  };

  const [column1, column2] = balanceCategories();

  return (
    <TemplateWrapper className="classic-template">
      <div className="min-h-screen bg-[#1A202C]">
        {/* Hero Section */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          {logoUrl ? (
            <div className="absolute inset-0">
              <img 
                src={logoUrl} 
                alt={`${restaurant.name} logo`}
                className="w-full h-full object-cover opacity-99"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A202C]/50 via-[#1A202C]/20 to-[#1A202C]"></div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#1A202C] to-[#1A202C]"></div>
          )}
          
          {/* Hero Text Overlay */}
          <div className="relative h-full flex items-center justify-end pr-8 md:pr-16">
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif italic tracking-wide" style={{ fontFamily: 'serif' }}>
              {restaurant.name || 'True Taste'}
            </h1>
          </div>
        </section>

        {/* Main Menu Content */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          {/* Main Menu Title */}
          <div className="text-center mb-12">
            {menu.description && (
              <p className="text-amber-400/80 italic text-sm md:text-base mb-2 font-serif">
                {menu.description}
              </p>
            )}
            <div className="flex items-center justify-center gap-4 mb-4">
              <GoldOrnament size="md" />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wider">
                MAIN MENU
              </h2>
              <GoldOrnament size="md" />
            </div>
          </div>

          {/* Categories - Two Column Layout with Smart Balancing */}
          {menu.categories && menu.categories.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Column 1 */}
              <div className="space-y-12">
                {column1.map((category, index) => (
                  <TrackableCategory key={category.id} categoryId={category.id}>
                    {/* Category Header */}
                    <div className="text-center mb-8">
                      <p className="text-amber-400/70 italic text-xs md:text-sm mb-2 font-serif">
                        {index % 2 === 0 ? 'Drinks' : 'Our choice'}
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <GoldOrnament size="sm" />
                        <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                          {category.name}
                        </h3>
                        <GoldOrnament size="sm" />
                      </div>
                    </div>

                    {/* Menu Items */}
                    {category.items && category.items.length > 0 ? (
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <TrackableMenuItem key={item.id} itemId={item.id}>
                            <MenuItemCard
                              item={item}
                              menuCurrency={menuCurrency}
                              showDescriptions={display_settings.show_descriptions}
                              onItemClick={handleItemClick}
                            />
                          </TrackableMenuItem>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4">No items in this category</p>
                    )}
                  </TrackableCategory>
                ))}
              </div>

              {/* Column 2 */}
              <div className="space-y-12">
                {column2.map((category, index) => (
                  <TrackableCategory key={category.id} categoryId={category.id}>
                    {/* Category Header */}
                    <div className="text-center mb-8">
                      <p className="text-amber-400/70 italic text-xs md:text-sm mb-2 font-serif">
                        {index % 2 === 0 ? 'Drinks' : 'Our choice'}
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <GoldOrnament size="sm" />
                        <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider">
                          {category.name}
                        </h3>
                        <GoldOrnament size="sm" />
                      </div>
                    </div>

                    {/* Menu Items */}
                    {category.items && category.items.length > 0 ? (
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <TrackableMenuItem key={item.id} itemId={item.id}>
                            <MenuItemCard
                              item={item}
                              menuCurrency={menuCurrency}
                              showDescriptions={display_settings.show_descriptions}
                              onItemClick={handleItemClick}
                            />
                          </TrackableMenuItem>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-4">No items in this category</p>
                    )}
                  </TrackableCategory>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No menu categories available</p>
            </div>
          )}
        </main>
      </div>
    </TemplateWrapper>
  );
}
