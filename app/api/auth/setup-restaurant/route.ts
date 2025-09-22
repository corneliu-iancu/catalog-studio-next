import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      user_id,
      name,
      slug,
      description,
      cuisine,
      owner_name,
      email,
      phone
    } = body;

    // Validate required fields
    if (!user_id || !name || !slug || !owner_name || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key for admin operations
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return []
          },
          setAll() {
            // No-op for service role
          },
        },
      }
    );

    // Check if slug is already taken
    const { data: existingRestaurant } = await supabase
      .from('restaurants')
      .select('slug')
      .eq('slug', slug)
      .single();

    if (existingRestaurant) {
      return NextResponse.json(
        { error: 'Restaurant slug is already taken. Please choose a different one.' },
        { status: 400 }
      );
    }

    // Create restaurant record
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        user_id,
        name,
        slug,
        description: description || '',
        cuisine: cuisine || null,
        owner_name,
        email,
        phone: phone || '',
        hours: {},
        settings: {
          currency: 'USD',
          showNutrition: true,
          showAllergens: true,
          showIngredients: true
        },
        is_active: true
      })
      .select()
      .single();

    if (restaurantError) {
      console.error('Restaurant creation error:', restaurantError);
      return NextResponse.json(
        { error: 'Failed to create restaurant: ' + restaurantError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant
    });

  } catch (error) {
    console.error('Setup restaurant error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
