'use client';

import { PublicMenuData } from '@/lib/types/templates';

import { TemplateWrapper, MenuHeader, CategorySection, MenuItem } from '../template-engine';

interface ClassicTemplateProps {
  menuData: PublicMenuData;
}

export function ClassicTemplate({ menuData }: ClassicTemplateProps) {
  const { restaurant, menu, display_settings } = menuData;

  return (
    <TemplateWrapper className="classic-template">
      {/* Header */}
      <MenuHeader 
        restaurant={restaurant} 
        menu={menu}
        showLogo={true}
        showDescription={true}
      />

      {/* Menu Content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        {menu.categories.map((category) => (
          <CategorySection 
            key={category.id} 
            category={category}
            showDescription={display_settings.show_descriptions}
          >
            <div className="space-y-4">
              {category.items.map((item) => (
                <div key={item.id} className="border-b border-[var(--menu-text)]/10 pb-4 last:border-b-0">
                  <MenuItem
                    item={item}
                    showImage={display_settings.show_images}
                    showDescription={display_settings.show_descriptions}
                    showPrice={display_settings.show_prices}
                    showAllergens={display_settings.show_allergens}
                    showSpiceLevel={display_settings.show_spice_levels}
                    layout="horizontal"
                  />
                </div>
              ))}
            </div>
          </CategorySection>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--menu-primary)]/5 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold text-[var(--menu-primary)] mb-4">
            Visit Us
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            {restaurant.address && (
              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <p className="text-[var(--menu-text)]/70">{restaurant.address}</p>
              </div>
            )}
            
            {restaurant.phone && (
              <div>
                <h4 className="font-medium mb-2">Phone</h4>
                <p className="text-[var(--menu-text)]/70">{restaurant.phone}</p>
              </div>
            )}
            
            {restaurant.hours && (
              <div>
                <h4 className="font-medium mb-2">Hours</h4>
                <div className="text-[var(--menu-text)]/70">
                  {Object.entries(restaurant.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span>{day}:</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Custom Styles for Classic Template */}
      <style jsx>{`
        .classic-template {
          font-family: 'Georgia', serif;
        }
        
        .classic-template h1 {
          font-family: 'Georgia', serif;
          letter-spacing: -0.02em;
        }
        
        .classic-template h2 {
          font-family: 'Georgia', serif;
          border-bottom: 2px solid var(--menu-primary);
          padding-bottom: 0.5rem;
          display: inline-block;
        }
        
        .classic-template .menu-item {
          transition: all 0.2s ease;
        }
        
        .classic-template .menu-item:hover {
          transform: translateX(4px);
          background-color: var(--menu-background);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </TemplateWrapper>
  );
}
