'use client';

import { PublicMenuData } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { ArrowLeft, ChefHat, AlertTriangle, Star } from 'lucide-react';
import { ItemImage } from './templates/classic-template';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { TemplateWrapper } from './template-engine';

interface ProductPageProps {
  item: PublicMenuData['menu']['categories'][0]['items'][0];
  restaurant: PublicMenuData['restaurant'];
  currency?: SupportedCurrency;
  onBack?: () => void;
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
        <div className="bg-white border-4 border-gray-800 relative">
          {/* Back button */}
          <div className="absolute top-4 left-4 z-10">
            <Button
              onClick={onBack || (() => router.back())}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>

          {/* Traditional Menu Header */}
          <header className="bg-white border-b border-gray-200 p-6 pt-16">            
            <div className="max-w-2xl mx-auto">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {restaurant.cuisine || 'Restaurant'} Menu
                  </span>
                  {item.is_featured && (
                    <div className="bg-amber-500 text-white rounded-full p-1">
                      <Star className="w-3 h-3 fill-current" />
                    </div>
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-tight">
                  {item.name}
                </h1>
                
                <p className="text-gray-600 text-sm">
                  {restaurant.name}
                </p>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="px-4 md:px-12 pb-8 pt-6">
            <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-6">
                
                {/* Traditional item header with price */}
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Smaller product image */}
                    {item.image_url && (
                      <div className="relative flex-shrink-0">
                        <ItemImage 
                          imageUrl={item.image_url} 
                          itemName={item.name}
                          size="lg"
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                      <p className="text-sm text-gray-600">{restaurant.name}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatPrice(item.price, currency)}
                    </div>
                    {item.discount_price && item.discount_price < item.price && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(item.discount_price, currency)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <div className="py-3 border-b border-gray-100">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                )}

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
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Ingredients</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.ingredients}
                      </p>
                    </div>
                  )}

                  {/* Long description */}
                  {item.long_description && (
                    <div className="py-3 border-b border-gray-100">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Details</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.long_description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Traditional footer */}
            <div className="mt-8 pt-4 max-w-2xl mx-auto">
              <div className="border-t border-gray-200 pt-4 text-center">
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="font-medium">{restaurant.name}</p>
                  {restaurant.address && (
                    <p>{restaurant.address}</p>
                  )}
                  {restaurant.phone && (
                    <p>{restaurant.phone}</p>
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