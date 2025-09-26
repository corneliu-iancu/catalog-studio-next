'use client';

import { PublicMenuData } from '@/lib/types/templates';
import { formatPrice, type SupportedCurrency } from '@/lib/utils/currency';

import { TemplateWrapper, MenuHeader, CategorySection, MenuItem } from '../template-engine';

interface ClassicTemplateProps {
  menuData: PublicMenuData;
}

export function ClassicTemplate({ menuData }: ClassicTemplateProps) {
  const { restaurant, menu, display_settings } = menuData;

  // Get menu currency or default to USD
  const menuCurrency = (menu.currency as SupportedCurrency) || 'USD';


  return (
    <TemplateWrapper className="classic-template bg-gray-50">
      {/* Decorative Border Container */}
      <div className="max-w-5xl mx-auto p-8">
        <div className="bg-white border-4 border-gray-800 relative">
          {/* Corner decorations */}
          <div className="absolute -top-2 -left-2 w-8 h-8 bg-gray-800"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800"></div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gray-800"></div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-800"></div>

          {/* Header */}
          <MenuHeader 
            restaurant={restaurant} 
            menu={menu}
            showLogo={false}
            showDescription={true}
          />

          {/* Main Menu Content */}
          <main className="px-12 pb-8">
            
            {/* Categories - Each with Two Column Layout */}
            {menu.categories.map((category, categoryIndex) => (
              <div key={category.id} className="mb-16">
                
                {/* Category Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-8 bg-gray-800 rounded-full mr-4"></div>
                    <div className="bg-gray-800 text-white px-6 py-2 rounded-full">
                      <span className="text-lg font-bold tracking-wider uppercase">{category.name}</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-800 rounded-full ml-4"></div>
                  </div>
                </div>

                {/* Category Items in Two Columns */}
                <div className="relative">
                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Left Column */}
                    <div className="space-y-4">
                      {category.items
                        .filter((_, index) => index % 2 === 0)
                        .map((item) => (
                          <div key={item.id} className="mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="px-2 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                                  {formatPrice(item.price, menuCurrency)}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg uppercase tracking-wide text-gray-800">{item.name}</h3>
                                  <div className="border-b border-dotted border-gray-400 my-1"></div>
                                  {display_settings.show_descriptions && (
                                    <p className="text-sm text-gray-600 italic mt-1">
                                      {item.description.length > 100 
                                        ? `${item.description.substring(0, 100)}...` 
                                        : item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      {category.items
                        .filter((_, index) => index % 2 === 1)
                        .map((item) => (
                          <div key={item.id} className="mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="px-2 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm mr-4">
                                  {formatPrice(item.price, menuCurrency)}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg uppercase tracking-wide text-gray-800">{item.name}</h3>
                                  <div className="border-b border-dotted border-gray-400 my-1"></div>
                                  {display_settings.show_descriptions && (
                                    <p className="text-sm text-gray-600 italic mt-1">
                                      {item.description.length > 100 
                                        ? `${item.description.substring(0, 100)}...` 
                                        : item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Vertical Dotted Line for each category */}
                  {category.items.length > 1 && (
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px border-l border-dotted border-gray-400 transform -translate-x-1/2"></div>
                  )}
                </div>
              </div>
            ))}

          </main>
        </div>
      </div>

      {/* Custom Styles for Classic Template */}
      <style jsx>{`
        .classic-template {
          font-family: 'Georgia', serif;
          min-height: 100vh;
        }
        
        .classic-template h1, .classic-template h2, .classic-template h3 {
          font-family: 'Georgia', serif;
        }
      `}</style>
    </TemplateWrapper>
  );
}
