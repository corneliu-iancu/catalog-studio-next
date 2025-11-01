import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { ProcessedImportData } from '@/lib/types/csv-import';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { menuId, data }: { menuId: string; data: ProcessedImportData } = body;

    if (!menuId || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify that the user owns the restaurant that contains this menu
    const { data: menuData, error: menuError } = await supabase
      .from('menus')
      .select('id, restaurant_id')
      .eq('id', menuId)
      .maybeSingle();

    if (menuError) {
      console.error('Error fetching menu:', menuError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!menuData) {
      return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
    }

    // Check if user owns the restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, user_id')
      .eq('id', menuData.restaurant_id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let createdCategories = 0;
    let createdItems = 0;
    let linkedItems = 0;
    const errors: string[] = [];
    const createdCategoryIds: string[] = [];
    const createdProductIds: string[] = [];
    const createdLinkIds: string[] = [];

    // Process each category and its items
    for (const categoryData of data.categories) {
      try {
        // Check if category already exists in this menu
        const { data: existingCategory } = await supabase
          .from('categories')
          .select('id, name')
          .eq('menu_id', menuId)
          .eq('slug', categoryData.slug)
          .maybeSingle();

        let categoryId: string;

        if (existingCategory) {
          // Use existing category
          categoryId = existingCategory.id;
          console.log(`Using existing category: ${existingCategory.name}`);
        } else {
          // Create new category
          const { data: newCategory, error: categoryError } = await supabase
            .from('categories')
            .insert({
              menu_id: menuId,
              name: categoryData.name,
              slug: categoryData.slug,
              description: categoryData.description || null,
              sort_order: categoryData.sort_order,
              is_active: categoryData.is_active,
              is_featured: categoryData.is_featured
            })
            .select('id')
            .single();

          if (categoryError) {
            console.error('Error creating category:', categoryError);
            errors.push(`Failed to create category "${categoryData.name}": ${categoryError.message}`);
            continue;
          }

          categoryId = newCategory.id;
          createdCategoryIds.push(categoryId);
          createdCategories++;
        }

        // Process menu items for this category with proper sort order
        for (let itemIndex = 0; itemIndex < categoryData.items.length; itemIndex++) {
          const itemData = categoryData.items[itemIndex];
          try {
            // Check if product already exists in this menu's categories
            // This prevents global slug collisions while allowing menu-scoped products
            const { data: existingItem } = await supabase
              .from('products')
              .select(`
                id, 
                name, 
                price,
                category_products!inner (
                  category_id,
                  categories!inner (
                    menu_id
                  )
                )
              `)
              .eq('slug', itemData.slug)
              .eq('category_products.categories.menu_id', menuId)
              .maybeSingle();

            let productId: string;

            if (existingItem) {
              // Product exists in this menu - check if we should update or reuse
              productId = existingItem.id;
              
              // Check if price differs - warn user
              if (existingItem.price !== itemData.price) {
                errors.push(`Warning: Item "${itemData.name}" already exists in this menu with different price ($${existingItem.price} vs $${itemData.price}). Using existing product.`);
              }
              
              console.log(`Using existing product in menu: ${existingItem.name}`);
            } else {
              // Create new product
              const { data: newItem, error: itemError } = await supabase
                .from('products')
                .insert({
                  name: itemData.name,
                  slug: itemData.slug,
                  description: itemData.description,
                  long_description: itemData.long_description || null,
                  price: itemData.price,
                  discount_price: itemData.discount_price || null,
                  ingredients: itemData.ingredients || null,
                  allergens: itemData.allergens.length > 0 ? itemData.allergens : null,
                  spice_level: itemData.spice_level || null,
                  preparation_time: itemData.preparation_time || null,
                  serving_size: itemData.serving_size || null,
                  is_active: itemData.is_active,
                  is_featured: itemData.is_featured
                })
                .select('id')
                .single();

              if (itemError) {
                console.error('Error creating product:', itemError);
                errors.push(`Failed to create item "${itemData.name}": ${itemError.message}`);
                continue;
              }

              productId = newItem.id;
              createdProductIds.push(productId);
              createdItems++;
            }

            // Check if the product is already linked to this category
            const { data: existingLink } = await supabase
              .from('category_products')
              .select('id')
              .eq('category_id', categoryId)
              .eq('product_id', productId)
              .maybeSingle();

            if (!existingLink) {
              // Link the product to the category with proper sort order
              const { data: linkData, error: linkError } = await supabase
                .from('category_products')
                .insert({
                  category_id: categoryId,
                  product_id: productId,
                  sort_order: itemIndex + 1 // Maintain order from CSV (1-based)
                })
                .select('id')
                .single();

              if (linkError) {
                console.error('Error linking product to category:', linkError);
                errors.push(`Failed to link item "${itemData.name}" to category "${categoryData.name}": ${linkError.message}`);
              } else {
                if (linkData?.id) {
                  createdLinkIds.push(linkData.id);
                }
                linkedItems++;
              }
            }

          } catch (itemError) {
            console.error('Error processing menu item:', itemError);
            errors.push(`Failed to process item "${itemData.name}": ${itemError instanceof Error ? itemError.message : 'Unknown error'}`);
          }
        }

      } catch (categoryError) {
        console.error('Error processing category:', categoryError);
        errors.push(`Failed to process category "${categoryData.name}": ${categoryError instanceof Error ? categoryError.message : 'Unknown error'}`);
      }
    }

    // Check if we had critical errors and should rollback
    const criticalErrorThreshold = Math.ceil(data.totalItems * 0.3); // 30% failure rate
    const shouldRollback = errors.length >= criticalErrorThreshold && (createdCategories > 0 || createdItems > 0);

    if (shouldRollback) {
      console.error('Critical errors detected, rolling back changes...');
      
      // Rollback in reverse order: links -> products -> categories
      try {
        if (createdLinkIds.length > 0) {
          await supabase
            .from('category_products')
            .delete()
            .in('id', createdLinkIds);
        }
        
        if (createdProductIds.length > 0) {
          await supabase
            .from('products')
            .delete()
            .in('id', createdProductIds);
        }
        
        if (createdCategoryIds.length > 0) {
          await supabase
            .from('categories')
            .delete()
            .in('id', createdCategoryIds);
        }
        
        return NextResponse.json({ 
          error: 'Import failed with too many errors and has been rolled back',
          details: errors,
          summary: {
            totalErrors: errors.length,
            totalItems: data.totalItems,
            rollbackPerformed: true
          }
        }, { status: 400 });
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
        return NextResponse.json({ 
          error: 'Import failed and rollback was unsuccessful. Manual cleanup may be required.',
          details: errors,
          rollbackError: rollbackError instanceof Error ? rollbackError.message : 'Unknown error'
        }, { status: 500 });
      }
    }

    // Return results
    const result = {
      success: true,
      summary: {
        categoriesCreated: createdCategories,
        itemsCreated: createdItems,
        itemsLinked: linkedItems,
        totalCategories: data.totalCategories,
        totalItems: data.totalItems,
        errors: errors.length > 0 ? errors : undefined
      }
    };

    if (errors.length > 0) {
      console.warn('Import completed with errors:', errors);
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Error in CSV import API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
