'use client';

import { PublicMenuData } from '@/lib/types/templates';

interface MinimalTemplateProps {
  menuData: PublicMenuData;
}

export function MinimalTemplate({ menuData }: MinimalTemplateProps) {
  const { restaurant, menu } = menuData;

  return (
    <div className="minimal-template min-h-screen bg-green-900">
      <div className="container mx-auto p-6">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          
          {/* Restaurant Name Section */}
          <div className="grid-item bg-white/95 p-6 rounded-lg border border-white/20 row-span-2">
            <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
            {restaurant.cuisine && (
              <p className="text-gray-600 mt-2">{restaurant.cuisine}</p>
            )}
            {restaurant.description && (
              <p className="text-gray-600 text-sm">
                {restaurant.description}
              </p>
            )}
          </div>

          {/* Restaurant Info Section */}
          {(restaurant.address || restaurant.phone) && (
            <div className="grid-item bg-white/95 p-6 rounded-lg border border-white/20">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
              {restaurant.address && (
                <p className="text-gray-600 text-sm mb-2">{restaurant.address}</p>
              )}
              {restaurant.phone && (
                <p className="text-gray-600 text-sm">{restaurant.phone}</p>
              )}
            </div>
          )}

          {/* Menu Categories Grid */}
          {menu.categories.map((category) => (
            <div key={category.id} className="grid-item bg-white/95 p-6 rounded-lg border border-white/20">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">{category.name}</h2>
              {category.description && (
                <p className="text-gray-600 text-sm mb-3">{category.description}</p>
              )}
              <div className="text-sm text-gray-500">
                {category.items.length} item{category.items.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
