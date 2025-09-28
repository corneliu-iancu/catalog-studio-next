'use client';

import { PublicMenuData } from '@/lib/types/templates';
import { ClassicTemplate } from './templates/classic-template';

interface TemplateEngineProps {
  menuData: PublicMenuData;
  className?: string;
}

export function TemplateEngine({ menuData, className }: TemplateEngineProps) {
  const { display_settings } = menuData;
  // Single clean template styling

  // Render the appropriate template based on display settings
  const renderTemplate = () => {
    switch (display_settings.template) {
      case 'classic':
      default:
        return <ClassicTemplate menuData={menuData} />;
    }
  };

  return renderTemplate();
}

// Template wrapper component for consistent styling
export function TemplateWrapper({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={`min-h-screen bg-[var(--menu-background)] text-[var(--menu-text)] ${className}`}>
      {children}
    </div>
  );
}

// Common components used across templates
export function MenuHeader({ 
  restaurant, 
  menu,
  showLogo = true,
  showDescription = true 
}: {
  restaurant: PublicMenuData['restaurant'];
  menu: PublicMenuData['menu'];
  showLogo?: boolean;
  showDescription?: boolean;
}) {
  return (
    <header className="bg-white py-8">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Vintage Restaurant Banner */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            {/* Left decorative element */}
            <div className="flex-1 flex justify-end pr-4">
              <div className="w-12 h-8 bg-gray-800 rounded-full"></div>
            </div>
            
            {/* Restaurant Banner */}
            <div className="bg-gray-800 text-white px-8 py-3 rounded-full">
              <span className="text-xl font-bold tracking-wider uppercase">RESTAURANT</span>
            </div>
            
            {/* Right decorative element */}
            <div className="flex-1 flex justify-start pl-4">
              <div className="w-12 h-8 bg-gray-800 rounded-full"></div>
            </div>
          </div>

          {/* Food & Drinks with decorative lines */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 border-t-2 border-gray-800 max-w-24"></div>
            <div className="flex-1 border-t border-gray-800 max-w-24"></div>
            <div className="flex-1 border-t-2 border-gray-800 max-w-24"></div>
            <span className="px-6 text-lg font-semibold tracking-widest uppercase">FOOD & DRINKS</span>
            <div className="flex-1 border-t-2 border-gray-800 max-w-24"></div>
            <div className="flex-1 border-t border-gray-800 max-w-24"></div>
            <div className="flex-1 border-t-2 border-gray-800 max-w-24"></div>
          </div>

          {/* MENU Title */}
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 tracking-wider mb-8">
            MENU
          </h1>
        </div>

        {/* Restaurant Info */}
        <div className="text-center text-gray-600 space-y-2">
          <h2 className="text-2xl font-semibold text-gray-800">{restaurant.name}</h2>
          
          {restaurant.cuisine && (
            <p className="text-lg italic">{restaurant.cuisine} Cuisine</p>
          )}
          
          {showDescription && (restaurant.description || menu.description) && (
            <p className="text-base max-w-2xl mx-auto mt-4">
              {restaurant.description || menu.description}
            </p>
          )}

          {restaurant.address && (
            <p className="text-sm">{restaurant.address}</p>
          )}
          
          {restaurant.phone && (
            <p className="text-sm">{restaurant.phone}</p>
          )}
        </div>
        
      </div>
    </header>
  );
}

export function CategorySection({ 
  category, 
  children,
  showDescription = true 
}: {
  category: PublicMenuData['menu']['categories'][0];
  children: React.ReactNode;
  showDescription?: boolean;
}) {
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--menu-primary)] mb-2">
          {category.name}
        </h2>
        {showDescription && category.description && (
          <p className="text-[var(--menu-text)]/70">
            {category.description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

export function MenuItem({
  item,
  showImage = true,
  showDescription = true,
  showPrice = true,
  showAllergens = false,
  showSpiceLevel = false,
  layout = 'horizontal'
}: {
  item: PublicMenuData['menu']['categories'][0]['items'][0];
  showImage?: boolean;
  showDescription?: boolean;
  showPrice?: boolean;
  showAllergens?: boolean;
  showSpiceLevel?: boolean;
  layout?: 'horizontal' | 'vertical';
}) {
  const isVertical = layout === 'vertical';
  
  return (
    <div className={`menu-item ${isVertical ? 'flex flex-col' : 'flex items-start gap-4'} p-4 rounded-lg hover:bg-[var(--menu-background)]/50 transition-colors`}>
      {showImage && item.image_url && (
        <div className={`${isVertical ? 'w-full h-48' : 'w-24 h-24'} flex-shrink-0`}>
          <img 
            src={item.image_url} 
            alt={item.name}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-[var(--menu-primary)]">
            {item.name}
            {item.is_featured && (
              <span className="ml-2 text-xs bg-[var(--menu-accent)] text-white px-2 py-1 rounded">
                Featured
              </span>
            )}
          </h3>
          
          {showPrice && (
            <div className="text-right">
              {item.discount_price ? (
                <div>
                  <span className="text-lg font-bold text-[var(--menu-accent)]">
                    ${item.discount_price}
                  </span>
                  <span className="text-sm text-[var(--menu-text)]/50 line-through ml-2">
                    ${item.price}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-[var(--menu-primary)]">
                  ${item.price}
                </span>
              )}
            </div>
          )}
        </div>
        
        {showDescription && item.description && (
          <p className="text-[var(--menu-text)]/80 mb-2">
            {item.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-sm">
          {showSpiceLevel && item.spice_level && (
            <span className="flex items-center gap-1">
              🌶️ {item.spice_level}
            </span>
          )}
          
          {showAllergens && item.allergens && item.allergens.length > 0 && (
            <span className="text-[var(--menu-text)]/60">
              ⚠️ Contains: {item.allergens.join(', ')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
