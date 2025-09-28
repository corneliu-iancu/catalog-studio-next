'use client';

import { PublicMenuData } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';
import { ArrowLeft, Clock, Users, ChefHat, AlertTriangle, Star } from 'lucide-react';
import { ItemImage } from './templates/classic-template';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

          {/* Header matching template style */}
          <header className="bg-white border-b-4 border-gray-800 p-8 pt-16">            
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {restaurant.cuisine || 'Restaurant'} Menu
                </Badge>
                {item.is_featured && (
                  <Badge className="bg-amber-500 hover:bg-amber-600">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {item.name}
              </h1>
              
              <p className="text-gray-600 text-lg">
                {restaurant.name} - {restaurant.cuisine || 'Fine Dining'}
              </p>
            </div>
          </header>

          {/* Main content */}
          <main className="px-4 md:px-12 pb-8 pt-8">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              
              {/* Left column - Image and basic info */}
              <div className="space-y-6">
                {/* Product image */}
                {item.image_url && (
                  <div className="relative">
                    <div className="rounded-xl overflow-hidden shadow-lg border">
                      <ItemImage 
                        imageUrl={item.image_url} 
                        itemName={item.name}
                        size="hero"
                      />
                    </div>
                  </div>
                )}

                {/* Price card */}
                <Card className="border-2">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {formatPrice(item.price, currency)}
                    </div>
                    {item.discount_price && item.discount_price < item.price && (
                      <div className="text-lg text-gray-500 line-through">
                        {formatPrice(item.discount_price, currency)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Details */}
              <div className="space-y-6">
                {/* Description */}
                {item.description && (
                  <Card>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed text-lg pt-6">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Meta information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Spice level */}
                  {item.spice_level && (
                    <Card className="">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {getSpiceLevelIcon(item.spice_level)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Spice Level</h4>
                            <p className="text-gray-600 capitalize">{item.spice_level}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <Card className="">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900">Allergens</h4>
                            <p className="text-gray-600 text-sm">
                              {item.allergens.join(', ')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Ingredients */}
                {item.ingredients && (
                  <Card className="">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-900">Ingredients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {item.ingredients}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Long description */}
                {item.long_description && (
                  <>
                    <h4 className="text-3xl pt-4 px-6 text-gray-900">Details</h4>
                    <p className="text-gray-700 leading-relaxed px-6">
                        {item.long_description}
                    </p>
                  </>
                )}

                
              </div>
            </div>

            {/* Footer with restaurant info */}
            <div className="mt-12 pt-8 border-t-4 border-gray-800">
              <div className="text-center text-gray-600">
                <p className="text-lg font-medium">{restaurant.name}</p>
                {restaurant.address && (
                  <p className="text-sm mt-1">{restaurant.address}</p>
                )}
                {restaurant.phone && (
                  <p className="text-sm">{restaurant.phone}</p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </TemplateWrapper>
  );
}