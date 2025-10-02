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

    // Create the product with all fields
    const { data: newItem, error: itemError } = await supabase
      .from('products')
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
      console.error('Error creating product:', itemError);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    // Link the product to the category
    const { error: linkError } = await supabase
      .from('category_products')
      .insert({
        category_id: categoryId,
        product_id: newItem.id,
        sort_order: sortOrder || 1
      });

    if (linkError) {
      console.error('Error linking product to category:', linkError);
      // Try to clean up the created product
      await supabase.from('products').delete().eq('id', newItem.id);
      return NextResponse.json({ error: 'Failed to link product to category' }, { status: 500 });
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

    // Verify that the user owns the restaurant that contains this product
    const { data: itemDataArray, error: itemError } = await supabase
      .from('category_products')
      .select(`
        product_id,
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
      .eq('product_id', itemId)
      .eq('category_id', categoryId);

    // Handle potential duplicates by taking the first result
    const itemData = itemDataArray && itemDataArray.length > 0 ? itemDataArray[0] : null;

    if (itemError || !itemData) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check if user owns the restaurant (singular objects, not arrays)
    const restaurant = (itemData as any)?.categories?.menus?.restaurants;
    
    if (!restaurant || restaurant.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // FIRST: Check if this product is linked to any other categories
    // (do this BEFORE unlinking to preserve RLS permissions)
    const { data: allLinks, error: linkCheckError } = await supabase
      .from('category_products')
      .select('id')
      .eq('product_id', itemId);
    
    if (linkCheckError) {
      console.error('Error checking other links:', linkCheckError);
      return NextResponse.json({ error: 'Failed to check product links' }, { status: 500 });
    }

    // If this is the only link, delete the product (CASCADE will remove the link)
    if (allLinks && allLinks.length === 1) {
      // First, get all images associated with this product
      const { data: productImages, error: imagesError } = await supabase
        .from('product_images')
        .select('s3_key')
        .eq('product_id', itemId);

      // Delete images from S3
      if (productImages && productImages.length > 0) {
        for (const img of productImages) {
          try {
            const deleteResponse = await fetch(
              `${request.url.split('/api')[0]}/api/images/${encodeURIComponent(img.s3_key)}`,
              { method: 'DELETE' }
            );
            if (!deleteResponse.ok) {
              console.error(`Failed to delete image from S3: ${img.s3_key}`);
            }
          } catch (s3Error) {
            console.error('Error deleting image from S3:', s3Error);
            // Continue even if S3 deletion fails
          }
        }
      }

      // Now delete the product (CASCADE will remove product_images and category_products)
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', itemId);

      if (deleteError) {
        console.error('Error deleting product:', deleteError);
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
      }
    } else {
      // If there are other links, just remove this specific link
      const { error: unlinkError } = await supabase
        .from('category_products')
        .delete()
        .eq('product_id', itemId)
        .eq('category_id', categoryId);

      if (unlinkError) {
        console.error('Error unlinking product from category:', unlinkError);
        return NextResponse.json({ error: 'Failed to remove product from category' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Error in menu-items DELETE API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
