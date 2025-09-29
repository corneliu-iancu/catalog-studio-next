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

// Hero Image component that properly covers the container
function HeroImage({ imageUrl, itemName }: { 
  imageUrl?: string | null; 
  itemName: string;
}) {
  const { displayUrl, loading } = useDisplayImage(imageUrl || null);
  
  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
      </div>
    );
  }
  
  if (!displayUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <ImageIcon className="h-16 w-16 text-gray-400 " />
      </div>
    );
  }
  
  return (
    <img 
      src={displayUrl} 
      alt={`${itemName} image`}
      className="w-full h-full object-cover aspect-square border border-gray-200 rounded-2xl"
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
      <ChefHat key={i} className="w-4 h-4 text-red-500 fill-current" />
    ));
  };

  return (
    <TemplateWrapper className="classic-template bg-gray-50">
      {/* Decorative Border Container */}
      <div className="max-w-5xl mx-auto p-2 md:p-8">
        <div>
          {/* Minimalistic Header */}
          <header className="py-8 px-3 md:px-12">
            <div className="flex items-center justify-center relative">
              {/* Back button - minimalistic arrow only */}
              <button
                onClick={onBack || (() => router.back())}
                className="absolute left-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Centered menu text */}
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                {restaurant.cuisine || 'Restaurant'} Menu
              </span>
            </div>
          </header>

          {/* Hero Section */}
          <section className="px-4 md:px-12 pb-0 pt-6">
            <div className="max-w-2xl sm:max-w-4xl mx-auto">
              <div className="overflow-hidden">
                {item.image_url ? (
                  <div className="flex flex-col sm:flex-row sm:gap-6">
                    {/* Image Container - Square aspect ratio */}
                    <div className="w-full sm:w-80 max-w-sm md:max-w-md lg:max-w-lg mx-auto sm:mx-0 aspect-square bg-gray-100 overflow-hidden flex-shrink-0">
                      <HeroImage 
                        imageUrl={item.image_url} 
                        itemName={item.name}
                      />
                    </div>
                    
                    {/* Item Information */}
                    <div className="p-6 sm:p-0 sm:py-6 flex-1">
                      <div className="space-y-4 max-w-2xl mx-auto sm:mx-0 text-center sm:text-left">
                          <div>
                            <div className="flex items-start justify-center sm:justify-start gap-3 mb-2">
                              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">{item.name}</h2>
                              {item.is_featured && (
                                <div className="bg-amber-500 text-white rounded-full p-1 mt-1.5">
                                  <Star className="w-3 h-3 fill-current" />
                                </div>
                              )}
                            </div>
                            
                            <p className="text-lg md:text-xl text-gray-600">{restaurant.name}</p>
                          </div>
                        
                        <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                          {formatPrice(item.price, currency)}
                          {item.discount_price && item.discount_price < item.price && (
                            <span className="text-xl md:text-2xl text-gray-500 line-through ml-2">
                              {formatPrice(item.discount_price, currency)}
                            </span>
                          )}
                        </div>
                        
                        {item.description && (
                          <p className="text-gray-700 leading-relaxed text-base md:text-lg max-w-xl mx-auto sm:mx-0">
                            {item.description}
                          </p>
                        )}
                        
                        {/* Quick meta info */}
                        <div className="flex items-center justify-center sm:justify-start gap-4 text-sm md:text-base text-gray-600">
                          {item.is_featured && (
                            <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                              <Star className="w-4 h-4 fill-current" />
                              Featured
                            </div>
                          )}
                          {item.spice_level && (
                            <div className="flex items-center gap-1">
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
                  <div className="p-6">
                    <div className="space-y-4 max-w-2xl mx-auto text-center">
                      <div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{item.name}</h2>
                        <p className="text-lg md:text-xl text-gray-600">{restaurant.name}</p>
                      </div>
                      
                      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                        {formatPrice(item.price, currency)}
                        {item.discount_price && item.discount_price < item.price && (
                          <span className="text-xl md:text-2xl text-gray-500 line-through ml-2">
                            {formatPrice(item.discount_price, currency)}
                          </span>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg max-w-xl mx-auto">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Quick meta info */}
                      <div className="flex items-center justify-center gap-4 text-sm md:text-base text-gray-600">
                        {item.is_featured && (
                          <div className="flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-current" />
                            Featured
                          </div>
                        )}
                        {item.spice_level && (
                          <div className="flex items-center gap-1">
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
          <main className="px-4 md:px-12 pb-8 pt-6">
            <div className="max-w-2xl sm:max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                
                {/* Additional Details Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Details</h3>
                </div>

                {/* Meta information in compact rows */}
                <div className="space-y-3">
                  {/* Spice level */}
                  {item.spice_level && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-900">Spice Level</span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {getSpiceLevelIcon(item.spice_level)}
                        </div>
                        <span className="text-sm text-gray-600 capitalize">{item.spice_level}</span>
                      </div>
                    </div>
                  )}

                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex items-start justify-between py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Allergens
                      </span>
                      <span className="text-sm text-gray-600 text-right max-w-48">
                        {item.allergens.join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Ingredients */}
                  {item.ingredients && (
                    <div className="py-3 border-b border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-gray-600" />
                        Ingredients
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.ingredients}
                      </p>
                    </div>
                  )}

                  {/* Long description */}
                  {item.long_description && (
                    <div className="py-3 border-b border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        Description
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.long_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Traditional footer */}
            <div className="mt-8 pt-4 max-w-2xl sm:max-w-4xl mx-auto">
              <div className="border-t border-gray-200 pt-4 text-center">
                <div className="text-xs text-gray-500 space-y-2">
                  <p className="font-medium text-gray-700">{restaurant.name}</p>
                  {restaurant.address && (
                    <p className="flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {restaurant.address}
                    </p>
                  )}
                  {restaurant.phone && (
                    <p className="flex items-center justify-center gap-1">
                      <Phone className="w-3 h-3" />
                      {restaurant.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TemplateWrapper>
  );
}