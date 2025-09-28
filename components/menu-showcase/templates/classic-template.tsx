'use client';

import { useState } from 'react';
import { PublicMenuData } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { useDisplayImage } from '@/lib/utils/image-display';
import { ImageIcon, Loader2 } from 'lucide-react';

import { TemplateWrapper, MenuHeader, CategorySection, MenuItem } from '../template-engine';
import { ProductPage } from '../product-page';

interface ClassicTemplateProps {
  menuData: PublicMenuData;
}

// Component for displaying menu item images with fallback
function ItemImage({ imageUrl, itemName, isOrientalTheme, size = 'md' }: { 
  imageUrl?: string | null; 
  itemName: string;
  isOrientalTheme: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const { displayUrl, loading } = useDisplayImage(imageUrl);
  
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16', 
    lg: 'w-20 h-20'
  };
  
  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`${sizeClasses[size]} ${isOrientalTheme ? 'bg-gradient-to-br from-amber-100 to-emerald-100 border border-amber-200' : 'bg-gray-100 border border-gray-200'} rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center`}>
      {loading ? (
        <Loader2 className={`${iconSizes[size]} ${isOrientalTheme ? 'text-amber-600' : 'text-gray-400'} animate-spin`} />
      ) : displayUrl ? (
        <img 
          src={displayUrl} 
          alt={`${itemName} image`}
          className="w-full h-full object-cover"
        />
      ) : (
        <ImageIcon className={`${iconSizes[size]} ${isOrientalTheme ? 'text-amber-600' : 'text-gray-400'}`} />
      )}
    </div>
  );
}

export function ClassicTemplate({ menuData }: ClassicTemplateProps) {
  const { restaurant, menu, display_settings } = menuData;
  const [selectedItem, setSelectedItem] = useState<(typeof menu.categories)[0]['items'][0] | null>(null);

  // Get menu currency or default to USD
  const menuCurrency = (menu.currency as SupportedCurrency) || 'USD';

  // Check if Oriental theme is selected
  const isOrientalTheme = display_settings.theme === 'oriental';

  // Handle item click to show product page
  const handleItemClick = (item: (typeof menu.categories)[0]['items'][0]) => {
    if (isOrientalTheme) {
      setSelectedItem(item);
    }
  };

  // Handle back from product page
  const handleBackToMenu = () => {
    setSelectedItem(null);
  };

  // If Oriental theme and item is selected, show product page
  if (isOrientalTheme && selectedItem) {
    return (
      <ProductPage
        item={selectedItem}
        restaurant={restaurant}
        currency={menuCurrency}
        onBack={handleBackToMenu}
      />
    );
  }

  // Oriental decorative SVG pattern
  const OrientalPattern = () => (
    <svg className="w-full h-12" viewBox="0 0 400 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g className="opacity-80">
        {/* Central ornate motif */}
        <path d="M200 8 Q190 16 200 24 Q210 16 200 8 Z" fill="currentColor" />
        <path d="M200 24 Q190 32 200 40 Q210 32 200 24 Z" fill="currentColor" />
        
        {/* Left ornamental flourishes */}
        <path d="M160 16 Q150 12 140 16 Q150 20 160 16 Z" fill="currentColor" />
        <path d="M140 16 Q130 20 120 16 Q130 12 140 16 Z" fill="currentColor" />
        <path d="M120 16 Q110 12 100 16 Q110 20 120 16 Z" fill="currentColor" />
        
        {/* Right ornamental flourishes */}
        <path d="M240 16 Q250 12 260 16 Q250 20 240 16 Z" fill="currentColor" />
        <path d="M260 16 Q270 20 280 16 Q270 12 260 16 Z" fill="currentColor" />
        <path d="M280 16 Q290 12 300 16 Q290 20 280 16 Z" fill="currentColor" />
        
        {/* Corner decorative elements */}
        <circle cx="80" cy="24" r="2" fill="currentColor" />
        <circle cx="320" cy="24" r="2" fill="currentColor" />
        
        {/* Connecting flourishes */}
        <path d="M160 24 Q170 20 180 24 Q170 28 160 24 Z" fill="currentColor" />
        <path d="M220 24 Q230 20 240 24 Q230 28 220 24 Z" fill="currentColor" />
      </g>
    </svg>
  );

  return (
    <TemplateWrapper className={`classic-template ${isOrientalTheme ? 'oriental-theme' : 'bg-gray-50'}`}>
      {/* Decorative Border Container */}
      <div className="max-w-5xl mx-auto p-2 md:p-8">
        <div className={`${isOrientalTheme ? 'bg-gradient-to-b from-emerald-50 to-white' : 'bg-white'} ${isOrientalTheme ? '' : 'border-4 border-gray-800'} relative ${isOrientalTheme ? 'shadow-2xl' : ''}`}>
          {/* Header */}
          {isOrientalTheme ? (
            <header className="bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-900 py-16 relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="text-amber-400/20 transform scale-150">
                  <OrientalPattern />
                </div>
              </div>
              <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                {/* Ornate header decoration */}
                <div className="text-amber-400 mb-8">
                  <OrientalPattern />
                </div>
                
                {/* Menu Title with elegant script */}
                <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-4 font-serif tracking-wider">
                  MENU
                </h1>
                
                {/* Restaurant name in elegant script */}
                <div className="text-4xl md:text-5xl text-amber-300 mb-6 restaurant-name">
                  {restaurant.name.split(' ').map((word, index) => (
                    <span key={index} className={index === restaurant.name.split(' ').length - 1 ? 'block text-amber-200 text-3xl md:text-4xl mt-2' : ''}>
                      {word}{index < restaurant.name.split(' ').length - 1 ? ' ' : ''}
                    </span>
                  ))}
                </div>
                
                {/* Restaurant info */}
                <div className="text-emerald-100 space-y-2">
                  {restaurant.cuisine && (
                    <p className="text-lg italic">{restaurant.cuisine} Cuisine</p>
                  )}
                  
                  {(restaurant.description || menu.description) && (
                    <p className="text-base max-w-2xl mx-auto mt-4 menu-description">
                      {restaurant.description || menu.description}
                    </p>
                  )}
                  
                  {restaurant.address && (
                    <p className="text-sm opacity-90">{restaurant.address}</p>
                  )}
                  
                  {restaurant.phone && (
                    <p className="text-sm opacity-90">{restaurant.phone}</p>
                  )}
                </div>
                
                {/* Bottom ornate decoration */}
                <div className="text-amber-400 mt-8 transform rotate-180">
                  <OrientalPattern />
                </div>
              </div>
            </header>
          ) : (
            <MenuHeader 
              restaurant={restaurant} 
              menu={menu}
              showLogo={false}
              showDescription={true}
            />
          )}

          {/* Main Menu Content */}
          <main className="px-4 md:px-12 pb-8">
            
            {/* Categories - Each with Two Column Layout */}
            {menu.categories.map((category, categoryIndex) => (
              <div key={category.id} className="mb-16">
                
                {/* Category Header */}
                {isOrientalTheme ? (
                  <div className="text-center mb-12 py-8">
                    {/* Ornate category decoration */}
                    <div className="text-amber-600 mb-4">
                      <OrientalPattern />
                    </div>
                    
                    {/* Category name in elegant Arabic-style script */}
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 to-emerald-900 mb-4 font-serif tracking-wide">
                      {category.name.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </h2>
                    
                    {/* Category description in elegant script */}
                    {category.description && (
                      <p className="text-emerald-600 italic text-lg max-w-2xl mx-auto menu-description">
                        {category.description}
                      </p>
                    )}
                    
                    {/* Bottom ornate decoration */}
                    <div className="text-amber-600 mt-4 transform rotate-180 scale-75">
                      <OrientalPattern />
                    </div>
                  </div>
                ) : (
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-8 bg-gray-800 rounded-full mr-4"></div>
                      <div className="bg-gray-800 text-white px-6 py-2 rounded-full">
                        <span className="text-lg font-bold tracking-wider uppercase">{category.name}</span>
                      </div>
                      <div className="w-12 h-8 bg-gray-800 rounded-full ml-4"></div>
                    </div>
                  </div>
                )}

                {/* Category Items in Two Columns */}
                <div className="relative">
                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Left Column */}
                    <div className="space-y-6">
                      {category.items
                        .filter((_, index) => index % 2 === 0)
                        .map((item) => (
                          <div 
                            key={item.id} 
                            className={`${isOrientalTheme ? 'bg-gradient-to-r from-emerald-50/50 to-transparent rounded-lg p-4 border border-emerald-200/50 cursor-pointer hover:from-emerald-100/60 hover:to-amber-50/30 hover:border-amber-300/60 transition-all duration-300 hover:shadow-lg' : ''} mb-4`}
                            onClick={() => handleItemClick(item)}
                          >
                            <div className="flex items-start justify-between">
                              {isOrientalTheme ? (
                                <div className="flex-1">
                                  {/* Item name with elegant styling */}
                                  <div className="flex items-baseline justify-between mb-2">
                                    <h3 className="font-bold text-xl text-emerald-800 font-serif tracking-wide flex-1 hover:text-amber-700 transition-colors">
                                      {item.name.toUpperCase()}
                                    </h3>
                                    <div className="text-right ml-4">
                                      <span className="text-2xl font-bold text-amber-600 price-text">
                                        {formatPrice(item.price, menuCurrency)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Decorative line */}
                                  <div className="h-px bg-gradient-to-r from-amber-400 via-amber-600 to-transparent mb-3"></div>
                                  
                                  {/* Description */}
                                  {display_settings.show_descriptions && (
                                    <p className="text-slate-500 menu-description">
                                      {item.description.length > 120 
                                        ? `${item.description.substring(0, 120)}...` 
                                        : item.description}
                                    </p>
                                  )}
                                  
                                  {/* Click to view more indicator for Oriental theme */}
                                  <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-amber-700/60 text-xs">
                                      <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
                                      <span>Tap for full details</span>
                                    </div>
                                    <button 
                                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(item);
                                      }}
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="px-2 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                                    {formatPrice(item.price, menuCurrency)}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg uppercase tracking-wide text-gray-800">{item.name}</h3>
                                    <div className="border-b border-dashed border-gray-400 my-1"></div>
                                    {display_settings.show_descriptions && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {item.description.length > 100 
                                          ? `${item.description.substring(0, 100)}...` 
                                          : item.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {category.items
                        .filter((_, index) => index % 2 === 1)
                        .map((item) => (
                          <div key={item.id} className={`${isOrientalTheme ? 'bg-gradient-to-l from-emerald-50/50 to-transparent rounded-lg p-4 border border-emerald-200/50' : ''} mb-4`}>
                            <div className="flex items-start justify-between">
                              {isOrientalTheme ? (
                                <div className="flex-1">
                                  {/* Item name with elegant styling */}
                                  <div className="flex items-baseline justify-between mb-2">
                                    <h3 className="font-bold text-xl text-emerald-800 font-serif tracking-wide flex-1 hover:text-amber-700 transition-colors">
                                      {item.name.toUpperCase()}
                                    </h3>
                                    <div className="text-right ml-4">
                                      <span className="text-2xl font-bold text-amber-600 price-text">
                                        {formatPrice(item.price, menuCurrency)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {/* Decorative line */}
                                  <div className="h-px bg-gradient-to-l from-amber-400 via-amber-600 to-transparent mb-3"></div>
                                  
                                  {/* Description */}
                                  {display_settings.show_descriptions && (
                                    <p className="text-slate-500 menu-description">
                                      {item.description.length > 120 
                                        ? `${item.description.substring(0, 120)}...` 
                                        : item.description}
                                    </p>
                                  )}
                                  
                                  {/* Click to view more indicator for Oriental theme */}
                                  <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-amber-700/60 text-xs">
                                      <div className="w-8 h-px bg-gradient-to-r from-amber-400 to-transparent"></div>
                                      <span>Tap for full details</span>
                                    </div>
                                    <button 
                                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(item);
                                      }}
                                    >
                                      View Details
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center">
                                  <div className="px-2 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                                    {formatPrice(item.price, menuCurrency)}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg uppercase tracking-wide text-gray-800">{item.name}</h3>
                                    <div className="border-b border-dashed border-gray-400 my-1"></div>
                                    {display_settings.show_descriptions && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {item.description.length > 100 
                                          ? `${item.description.substring(0, 100)}...` 
                                          : item.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="ml-4">
                                    <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Vertical Dotted Line for each category */}
                  {category.items.length > 1 && (
                    <div className={`hidden md:block absolute left-1/2 top-0 bottom-0 w-px ${isOrientalTheme ? 'border-l border-dotted border-amber-400/50' : 'border-l border-dotted border-gray-400'} transform -translate-x-1/2`}></div>
                  )}
                </div>
              </div>
            ))}

          </main>
        </div>
      </div>

      {/* Custom Styles for Classic Template */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Dancing+Script:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        
        .classic-template {
          font-family: 'Georgia', serif;
          min-height: 100vh;
        }
        
        .classic-template h1, .classic-template h2, .classic-template h3 {
          font-family: 'Georgia', serif;
        }
        
        /* Oriental Theme Styles */
        .oriental-theme {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 25%, #047857 50%, #059669 75%, #10b981 100%);
          background-attachment: fixed;
          font-family: 'Lora', 'Georgia', serif;
        }
        
        /* Oriental Typography Hierarchy */
        .oriental-theme h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          text-shadow: 3px 3px 6px rgba(0,0,0,0.4);
          letter-spacing: 0.15em;
        }
        
        .oriental-theme h2 {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          letter-spacing: 0.1em;
        }
        
        .oriental-theme h3 {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          letter-spacing: 0.05em;
        }
        
        /* Elegant script for restaurant name */
        .oriental-theme .restaurant-name {
          font-family: 'Dancing Script', cursive;
          font-weight: 700;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          letter-spacing: 0.02em;
        }
        
        /* Refined body text */
        .oriental-theme .menu-description {
          font-family: 'Lora', serif;
          font-style: italic;
          line-height: 1.6;
          letter-spacing: 0.025em;
        }
        
        /* Elegant price styling */
        .oriental-theme .price-text {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        
        /* Elegant fade-in animation */
        @keyframes orientalFade {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .oriental-theme .menu-item {
          animation: orientalFade 0.6s ease-out forwards;
        }
        
        /* Custom scrollbar for Oriental theme */
        .oriental-theme::-webkit-scrollbar {
          width: 8px;
        }
        
        .oriental-theme::-webkit-scrollbar-track {
          background: rgba(16, 185, 129, 0.1);
        }
        
        .oriental-theme::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f59e0b, #d97706);
          border-radius: 4px;
        }
      `}</style>
    </TemplateWrapper>
  );
}
