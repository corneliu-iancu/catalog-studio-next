'use client';

import { PublicMenuData } from '@/lib/types/templates';
import { ClassicTemplate } from './templates/classic-template';

interface TemplateEngineProps {
  menuData: PublicMenuData;
  className?: string;
}

export function TemplateEngine({ menuData, className }: TemplateEngineProps) {
  const { display_settings } = menuData;

  // Always use the Classic template (simplified)
  const renderTemplate = () => {
    return <ClassicTemplate menuData={menuData} />;
  };

  // Generate CSS custom properties for theming
  const generateThemeStyles = () => {
    const { theme, custom_colors } = display_settings;
    
    if (theme === 'custom' && custom_colors) {
      return {
        '--menu-primary': custom_colors.primary,
        '--menu-secondary': custom_colors.secondary,
        '--menu-accent': custom_colors.accent,
        '--menu-background': custom_colors.background,
        '--menu-text': custom_colors.text,
      } as React.CSSProperties;
    }

    // Predefined theme colors
    const themeColors = {
      warm: {
        '--menu-primary': '#d97706',
        '--menu-secondary': '#f59e0b',
        '--menu-accent': '#dc2626',
        '--menu-background': '#fef7ed',
        '--menu-text': '#451a03',
      },
      cool: {
        '--menu-primary': '#0369a1',
        '--menu-secondary': '#0284c7',
        '--menu-accent': '#0891b2',
        '--menu-background': '#f0f9ff',
        '--menu-text': '#0c4a6e',
      },
      neutral: {
        '--menu-primary': '#374151',
        '--menu-secondary': '#6b7280',
        '--menu-accent': '#111827',
        '--menu-background': '#f9fafb',
        '--menu-text': '#111827',
      },
      vibrant: {
        '--menu-primary': '#dc2626',
        '--menu-secondary': '#ea580c',
        '--menu-accent': '#c026d3',
        '--menu-background': '#fef2f2',
        '--menu-text': '#7f1d1d',
      },
      earth: {
        '--menu-primary': '#92400e',
        '--menu-secondary': '#a3a3a3',
        '--menu-accent': '#365314',
        '--menu-background': '#fefce8',
        '--menu-text': '#365314',
      },
    };

    return themeColors[theme] || themeColors.neutral;
  };

  return (
    <div 
      className={`menu-showcase ${className || ''}`}
      // style={generateThemeStyles()}
      data-template={display_settings.template}
      data-theme={display_settings.theme}
    >
      {renderTemplate()}
    </div>
  );
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
    <header className="text-center py-8 px-4">
      {showLogo && restaurant.logo_url && (
        <div className="mb-4">
          <img 
            src={restaurant.logo_url} 
            alt={`${restaurant.name} logo`}
            className="h-16 w-auto mx-auto"
          />
        </div>
      )}
      
      <h1 className="text-4xl md:text-5xl font-bold text-[var(--menu-primary)] mb-2">
        {restaurant.name}
      </h1>
      
      {restaurant.cuisine && (
        <p className="text-lg text-[var(--menu-secondary)] mb-4">
          {restaurant.cuisine} Cuisine
        </p>
      )}
      
      {showDescription && (restaurant.description || menu.description) && (
        <p className="text-lg max-w-2xl mx-auto text-[var(--menu-text)]/80">
          {restaurant.description || menu.description}
        </p>
      )}
      
      {restaurant.address && (
        <p className="text-sm text-[var(--menu-text)]/60 mt-4">
          📍 {restaurant.address}
        </p>
      )}
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
