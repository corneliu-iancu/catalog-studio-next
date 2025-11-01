'use client';

import { PublicMenuData } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { ArrowLeft, ChefHat, AlertTriangle, Star, ImageIcon, Loader2, UtensilsCrossed, FileText, MapPin, Phone } from 'lucide-react';
import { ItemImage } from './templates/classic-template';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TemplateWrapper } from './template-engine';
import { useDisplayImage } from '@/lib/utils/image-display';

interface ProductPageProps {
  item: PublicMenuData['menu']['categories'][0]['items'][0];
  restaurant: PublicMenuData['restaurant'];
  currency?: SupportedCurrency;
  onBack?: () => void;
}

// Hero Image component with dark theme styling
function HeroImage({ imageUrl, itemName }: { 
  imageUrl?: string | null; 
  itemName: string;
}) {
  const { displayUrl, loading } = useDisplayImage(imageUrl || null);
  
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800">
        <Loader2 className="h-12 w-12 text-amber-400/50 animate-spin" />
      </div>
    );
  }
  
  if (!displayUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-800">
        <ImageIcon className="h-16 w-16 text-amber-400/30" />
      </div>
    );
  }
  
  return (
    <img 
      src={displayUrl} 
      alt={`${itemName} image`}
      className="w-full h-full object-cover aspect-square border border-amber-400/20 rounded-2xl"
    />
  );
}

export function ProductPage({ item, restaurant, currency = 'USD', onBack }: ProductPageProps) {
  const router = useRouter();
  const getSpiceLevelIcon = (level?: string) => {
    if (!level) return null;
    const spiceCount = {
      'mild': 1,
      'medium': 2, 
      'hot': 3,
      'very-hot': 4
    }[level] || 1;
    
    return Array.from({ length: spiceCount }).map((_, i) => (
      <ChefHat key={i} className="w-4 h-4 text-amber-400 fill-current" />
    ));
  };

  return (
    <TemplateWrapper className="classic-template bg-[#1A202C]">
      <div className="min-h-screen">
        {/* Minimalistic Header */}
        <header className="py-6 px-4 md:px-8 border-b border-amber-400/20">
          <div className="max-w-7xl mx-auto flex items-center justify-center relative">
            {/* Back button */}
            <button
              onClick={onBack || (() => router.back())}
              className="absolute left-0 p-2 rounded-full hover:bg-gray-800/50 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-amber-400" />
            </button>
            
            {/* Centered menu text */}
            <span className="text-xs text-gray-400 uppercase tracking-wider">
              {restaurant.cuisine || 'Restaurant'} Menu
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-4 md:px-8 pb-0 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="overflow-hidden">
              {item.image_url ? (
                <div className="flex flex-col lg:flex-row lg:gap-12">
                  {/* Image Container - Square aspect ratio */}
                  <div className="w-full lg:w-96 mx-auto lg:mx-0 aspect-square bg-gray-800 overflow-hidden flex-shrink-0 rounded-2xl">
                    <HeroImage 
                      imageUrl={item.image_url} 
                      itemName={item.name}
                    />
                  </div>
                  
                  {/* Item Information */}
                  <div className="py-6 lg:py-0 flex-1 flex items-center">
                    <div className="space-y-6 w-full text-center lg:text-left">
                      <div>
                        <div className="flex items-start justify-center lg:justify-start gap-3 mb-3">
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide">{item.name}</h2>
                          {item.is_featured && (
                            <div className="bg-amber-400 text-[#1A202C] rounded-full p-1.5 mt-1">
                              <Star className="w-4 h-4 fill-current" />
                            </div>
                          )}
                        </div>
                        
                        <p className="text-lg md:text-xl text-gray-300 font-light">{restaurant.name}</p>
                      </div>
                    
                      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                        {formatPrice(item.price, currency)}
                        {item.discount_price && item.discount_price < item.price && (
                          <span className="text-2xl md:text-3xl text-gray-400 line-through ml-3">
                            {formatPrice(item.discount_price, currency)}
                          </span>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-300 leading-relaxed text-base md:text-lg max-w-2xl mx-auto lg:mx-0 font-light">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Quick meta info */}
                      <div className="flex items-center justify-center lg:justify-start gap-4 text-sm md:text-base text-gray-400">
                        {item.is_featured && (
                          <div className="flex items-center gap-2 bg-amber-400/20 text-amber-400 px-4 py-2 rounded-full border border-amber-400/30">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="uppercase tracking-wide">Featured</span>
                          </div>
                        )}
                        {item.spice_level && (
                          <div className="flex items-center gap-2 text-amber-400/80">
                            {getSpiceLevelIcon(item.spice_level)}
                            <span className="capitalize">{item.spice_level}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* No image layout */
                <div className="py-8">
                  <div className="space-y-6 max-w-3xl mx-auto text-center">
                    <div>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white uppercase tracking-wide mb-3">{item.name}</h2>
                      <p className="text-lg md:text-xl text-gray-300 font-light">{restaurant.name}</p>
                    </div>
                    
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                      {formatPrice(item.price, currency)}
                      {item.discount_price && item.discount_price < item.price && (
                        <span className="text-2xl md:text-3xl text-gray-400 line-through ml-3">
                          {formatPrice(item.discount_price, currency)}
                        </span>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-300 leading-relaxed text-base md:text-lg max-w-2xl mx-auto font-light">
                        {item.description}
                      </p>
                    )}
                    
                    {/* Quick meta info */}
                    <div className="flex items-center justify-center gap-4 text-sm md:text-base text-gray-400">
                      {item.is_featured && (
                        <div className="flex items-center gap-2 bg-amber-400/20 text-amber-400 px-4 py-2 rounded-full border border-amber-400/30">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="uppercase tracking-wide">Featured</span>
                        </div>
                      )}
                      {item.spice_level && (
                        <div className="flex items-center gap-2 text-amber-400/80">
                          {getSpiceLevelIcon(item.spice_level)}
                          <span className="capitalize">{item.spice_level}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main content */}
        <main className="px-4 md:px-8 pb-12 pt-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gray-800/30 border border-amber-400/20 rounded-lg backdrop-blur-sm">
              <div className="p-6 md:p-8">
                
                {/* Additional Details Header */}
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wider mb-1">Details</h3>
                  <div className="w-12 h-px bg-amber-400 mt-2"></div>
                </div>

                {/* Meta information in compact rows */}
                <div className="space-y-4">
                  {/* Spice level */}
                  {item.spice_level && (
                    <div className="flex items-center justify-between py-3 border-b border-amber-400/10">
                      <span className="text-sm font-medium text-gray-300 uppercase tracking-wide">Spice Level</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {getSpiceLevelIcon(item.spice_level)}
                        </div>
                        <span className="text-sm text-amber-400 capitalize">{item.spice_level}</span>
                      </div>
                    </div>
                  )}

                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex items-start justify-between py-3 border-b border-amber-400/10">
                      <span className="text-sm font-medium text-gray-300 flex items-center gap-2 uppercase tracking-wide">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Allergens
                      </span>
                      <span className="text-sm text-gray-300 text-right max-w-64 font-light">
                        {item.allergens.join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Ingredients */}
                  {item.ingredients && (
                    <div className="py-4 border-b border-amber-400/10">
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <UtensilsCrossed className="w-4 h-4 text-amber-400" />
                        Ingredients
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-light">
                        {item.ingredients}
                      </p>
                    </div>
                  )}

                  {/* Long description */}
                  {item.long_description && (
                    <div className="py-4 border-b border-amber-400/10">
                      <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <FileText className="w-4 h-4 text-amber-400" />
                        Description
                      </h4>
                      <p className="text-sm text-gray-300 leading-relaxed font-light">
                        {item.long_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6">
              <div className="border-t border-amber-400/20 pt-6 text-center">
                <div className="text-xs text-gray-400 space-y-2">
                  <p className="font-medium text-white text-sm uppercase tracking-wider">{restaurant.name}</p>
                  {restaurant.address && (
                    <p className="flex items-center justify-center gap-1.5 font-light">
                      <MapPin className="w-3 h-3 text-amber-400/60" />
                      {restaurant.address}
                    </p>
                  )}
                  {restaurant.phone && (
                    <p className="flex items-center justify-center gap-1.5 font-light">
                      <Phone className="w-3 h-3 text-amber-400/60" />
                      {restaurant.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </TemplateWrapper>
  );
}