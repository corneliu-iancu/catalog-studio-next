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
      .select(`
        id,
        restaurants!inner (
          id,
          user_id
        )
      `)
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
    const restaurant = menuData.restaurants;
    if (restaurant.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let createdCategories = 0;
    let createdItems = 0;
    const errors: string[] = [];

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
          createdCategories++;
        }

        // Process menu items for this category
        for (const itemData of categoryData.items) {
          try {
            // Check if item already exists (by slug)
            const { data: existingItem } = await supabase
              .from('menu_items')
              .select('id, name')
              .eq('slug', itemData.slug)
              .maybeSingle();

            let menuItemId: string;

            if (existingItem) {
              // Use existing item
              menuItemId = existingItem.id;
              console.log(`Using existing menu item: ${existingItem.name}`);
            } else {
              // Create new menu item
              const { data: newItem, error: itemError } = await supabase
                .from('menu_items')
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
                console.error('Error creating menu item:', itemError);
                errors.push(`Failed to create item "${itemData.name}": ${itemError.message}`);
                continue;
              }

              menuItemId = newItem.id;
              createdItems++;
            }

            // Check if the item is already linked to this category
            const { data: existingLink } = await supabase
              .from('category_menu_items')
              .select('id')
              .eq('category_id', categoryId)
              .eq('menu_item_id', menuItemId)
              .maybeSingle();

            if (!existingLink) {
              // Link the item to the category
              const { error: linkError } = await supabase
                .from('category_menu_items')
                .insert({
                  category_id: categoryId,
                  menu_item_id: menuItemId,
                  sort_order: 1 // Could be enhanced to maintain order from CSV
                });

              if (linkError) {
                console.error('Error linking item to category:', linkError);
                errors.push(`Failed to link item "${itemData.name}" to category "${categoryData.name}": ${linkError.message}`);
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

    // Return results
    const result = {
      success: true,
      summary: {
        categoriesCreated: createdCategories,
        itemsCreated: createdItems,
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
