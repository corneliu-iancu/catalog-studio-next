import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// Type definitions for Supabase relations
interface RestaurantData {
  id: string;
  user_id: string;
  name: string;
}

interface MenuData {
  id: string;
  restaurants: RestaurantData[];
}

interface CategoryWithMenus {
  id: string;
  name: string;
  menus: MenuData[];
}

interface ItemWithCategories {
  id: string;
  categories: {
    menus: MenuData[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      description,
      price,
      discountPrice,
      ingredients,
      allergens,
      spiceLevel,
      isActive,
      isFeatured,
      categoryId,
      sortOrder
    } = body;

    // Validate required fields
    if (!name || !slug || !categoryId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify that the user owns the restaurant that contains this category
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select(`
        id,
        menus!inner (
          id,
          restaurants!inner (
            id,
            user_id
          )
        )
      `)
      .eq('id', categoryId)
      .maybeSingle();

    if (categoryError) {
      console.error('Error fetching category:', categoryError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!categoryData) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if user owns the restaurant
    const restaurant = (categoryData as CategoryWithMenus)?.menus?.[0]?.restaurants?.[0];
    if (!restaurant || restaurant.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Create the menu item with all fields
    const { data: newItem, error: itemError } = await supabase
      .from('menu_items')
      .insert({
        name: name.trim(),
        slug: slug,
        description: description || '',
        price: price || 0,
        discount_price: discountPrice || null,
        ingredients: ingredients ? ingredients.join(', ') : null,
        allergens: allergens || null,
        spice_level: spiceLevel || null,
        is_active: isActive !== false, // Default to true
        is_featured: isFeatured || false
      })
      .select()
      .single();

    if (itemError) {
      console.error('Error creating menu item:', itemError);
      return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
    }

    // Link the item to the category
    const { error: linkError } = await supabase
      .from('category_menu_items')
      .insert({
        category_id: categoryId,
        menu_item_id: newItem.id,
        sort_order: sortOrder || 1
      });

    if (linkError) {
      console.error('Error linking item to category:', linkError);
      // Try to clean up the created item
      await supabase.from('menu_items').delete().eq('id', newItem.id);
      return NextResponse.json({ error: 'Failed to link item to category' }, { status: 500 });
    }

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });

  } catch (error) {
    console.error('Error in menu-items API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const itemId = url.searchParams.get('id');
    const categoryId = url.searchParams.get('categoryId');

    if (!itemId || !categoryId) {
      return NextResponse.json({ error: 'Missing item ID or category ID' }, { status: 400 });
    }

    // Verify that the user owns the restaurant that contains this item
    const { data: itemDataArray, error: itemError } = await supabase
      .from('category_menu_items')
      .select(`
        menu_item_id,
        categories!inner (
          id,
          menus!inner (
            id,
            restaurants!inner (
              id,
              user_id
            )
          )
        )
      `)
      .eq('menu_item_id', itemId)
      .eq('category_id', categoryId);

    // Handle potential duplicates by taking the first result
    const itemData = itemDataArray && itemDataArray.length > 0 ? itemDataArray[0] : null;

    if (itemError || !itemData) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Check if user owns the restaurant
    const restaurant = (itemData as ItemWithCategories)?.categories?.menus?.[0]?.restaurants?.[0];
    if (!restaurant || restaurant.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Remove the link between category and item
    const { error: unlinkError } = await supabase
      .from('category_menu_items')
      .delete()
      .eq('menu_item_id', itemId)
      .eq('category_id', categoryId);

    if (unlinkError) {
      console.error('Error unlinking item from category:', unlinkError);
      return NextResponse.json({ error: 'Failed to remove item from category' }, { status: 500 });
    }

    // Check if this item is linked to any other categories
    const { data: otherLinks, error: linkCheckError } = await supabase
      .from('category_menu_items')
      .select('id')
      .eq('menu_item_id', itemId);

    if (linkCheckError) {
      console.error('Error checking other links:', linkCheckError);
      return NextResponse.json({ error: 'Failed to check item links' }, { status: 500 });
    }

    // If no other links exist, delete the menu item entirely
    if (!otherLinks || otherLinks.length === 0) {
      const { error: deleteError } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (deleteError) {
        console.error('Error deleting menu item:', deleteError);
        return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error in menu-items DELETE API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
