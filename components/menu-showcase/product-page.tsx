'use client';

import { PublicMenuData } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { ArrowLeft, Clock, Users, ChefHat, AlertTriangle } from 'lucide-react';

interface ProductPageProps {
  item: PublicMenuData['menu']['categories'][0]['items'][0];
  restaurant: PublicMenuData['restaurant'];
  currency?: SupportedCurrency;
  onBack?: () => void;
}

export function ProductPage({ item, restaurant, currency = 'USD', onBack }: ProductPageProps) {
  // Oriental decorative SVG pattern (reused from classic template)
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

  const getSpiceLevelIcon = (level?: string) => {
    if (!level) return null;
    const spiceCount = {
      'mild': 1,
      'medium': 2, 
      'hot': 3,
      'very-hot': 4
    }[level] || 1;
    
    return '🌶️'.repeat(spiceCount);
  };

  return (
    <div className="oriental-theme min-h-screen">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-900 -z-10"></div>
      
      {/* Main content container */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-amber-300 transition-colors mb-6 text-lg"
          >
            <ArrowLeft size={20} />
            <span className="font-serif">Back to Menu</span>
          </button>
        )}

        {/* Product card */}
        <div className="bg-gradient-to-br from-emerald-50/95 to-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-amber-600/30 overflow-hidden">
          
          {/* Header with ornate decoration */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 py-8 px-6 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 to-emerald-800/50"></div>
            <div className="relative z-10">
              <div className="text-amber-400 mb-4">
                <OrientalPattern />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 mb-2">
                {item.name.toUpperCase()}
              </h1>
              <p className="text-emerald-100 text-lg font-serif italic">
                {restaurant.name}
              </p>
              <div className="text-amber-400 mt-4 transform rotate-180">
                <OrientalPattern />
              </div>
            </div>
          </div>

          {/* Content grid */}
          <div className="grid lg:grid-cols-2 gap-8 p-6 md:p-12">
            
            {/* Left column - Image and basic info */}
            <div className="space-y-6">
              {/* Product image */}
              {item.image_url && (
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-amber-400/30">
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  {item.is_featured && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-amber-400 to-amber-600 text-emerald-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      Featured
                    </div>
                  )}
                </div>
              )}

              {/* Price section */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-emerald-700 text-sm font-semibold mb-1">Price</p>
                    <div className="flex items-baseline gap-3">
                      {item.discount_price ? (
                        <>
                          <span className="text-4xl font-bold text-amber-600 price-text">
                            {formatPrice(item.discount_price, currency)}
                          </span>
                          <span className="text-2xl text-emerald-600/60 line-through">
                            {formatPrice(item.price, currency)}
                          </span>
                        </>
                      ) : (
                        <span className="text-4xl font-bold text-amber-600 price-text">
                          {formatPrice(item.price, currency)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick info cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50/80 rounded-lg p-4 border border-emerald-200/50">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <Clock size={18} />
                    <span className="text-sm font-semibold">Prep Time</span>
                  </div>
                  <p className="text-emerald-800 font-medium">15-20 minutes</p>
                </div>
                
                <div className="bg-emerald-50/80 rounded-lg p-4 border border-emerald-200/50">
                  <div className="flex items-center gap-2 text-emerald-700 mb-1">
                    <Users size={18} />
                    <span className="text-sm font-semibold">Serving</span>
                  </div>
                  <p className="text-emerald-800 font-medium">1-2 people</p>
                </div>
              </div>
            </div>

            {/* Right column - Detailed information */}
            <div className="space-y-8">
              
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-emerald-800 mb-4 font-serif">About This Dish</h2>
                <div className="space-y-4">
                  <p className="text-emerald-700 leading-relaxed menu-description text-lg">
                    {item.description}
                  </p>
                  {item.long_description && (
                    <p className="text-emerald-600 leading-relaxed menu-description">
                      {item.long_description}
                    </p>
                  )}
                </div>
              </div>

              {/* Ingredients */}
              {item.ingredients && item.ingredients.trim().length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-3 font-serif flex items-center gap-2">
                    <ChefHat size={20} />
                    Ingredients
                  </h3>
                  <div className="bg-emerald-50/60 rounded-lg p-4 border border-emerald-200/50">
                    {/* Handle both string and array formats */}
                    {Array.isArray(item.ingredients) ? (
                      <div className="flex flex-wrap gap-2">
                        {item.ingredients.map((ingredient, index) => (
                          <span key={index} className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {item.ingredients.split(',').map((ingredient, index) => (
                          <span key={index} className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                            {ingredient.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Allergens and spice level */}
              <div className="grid md:grid-cols-2 gap-6">
                {item.allergens && item.allergens.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-emerald-800 mb-3 font-serif flex items-center gap-2">
                      <AlertTriangle size={18} />
                      Allergens
                    </h3>
                    <div className="space-y-2">
                      {item.allergens.map((allergen, index) => (
                        <span key={index} className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-1">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {item.spice_level && (
                  <div>
                    <h3 className="text-lg font-bold text-emerald-800 mb-3 font-serif">Spice Level</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getSpiceLevelIcon(item.spice_level)}</span>
                      <span className="text-emerald-700 font-medium capitalize">{item.spice_level.replace('-', ' ')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info Note */}
              <div className="bg-amber-50/60 rounded-lg p-6 border border-amber-200/50 text-center">
                <p className="text-emerald-700 menu-description text-lg">
                  This elegant dish is carefully prepared with traditional techniques and the finest ingredients.
                </p>
              </div>

            </div>
          </div>

          {/* Footer decoration */}
          <div className="border-t border-amber-200 bg-gradient-to-r from-emerald-50 to-amber-50/30 py-6">
            <div className="text-amber-600 text-center">
              <div className="transform scale-75 opacity-60">
                <OrientalPattern />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Oriental Theme Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Dancing+Script:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        
        .oriental-theme {
          font-family: 'Lora', 'Georgia', serif;
        }
        
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
        
        .menu-description {
          font-family: 'Lora', serif;
          font-style: italic;
          line-height: 1.6;
          letter-spacing: 0.025em;
        }
        
        .price-text {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        
        /* Elegant animations */
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
        
        .oriental-theme > * {
          animation: orientalFade 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
