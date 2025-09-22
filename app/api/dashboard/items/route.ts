import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all menu items for dashboard
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // TODO: Replace with actual database query

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    // Mock menu items data for development
    const allItems = [
      {
        id: 1,
        name: 'Caesar Salad',
        slug: 'caesar-salad',
        categoryId: 1,
        categoryName: 'Appetizers',
        description: 'Fresh romaine lettuce with parmesan cheese and croutons',
        price: 12.99,
        discountPrice: 10.99,
        isActive: true,
        isFeatured: false,
        hasImage: true,
        sortOrder: 0,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
      },
      {
        id: 2,
        name: 'Buffalo Wings',
        slug: 'buffalo-wings',
        categoryId: 1,
        categoryName: 'Appetizers',
        description: 'Spicy chicken wings served with blue cheese dip',
        price: 14.99,
        discountPrice: null,
        isActive: true,
        isFeatured: true,
        hasImage: true,
        sortOrder: 1,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-19T14:30:00Z'
      },
      {
        id: 3,
        name: 'Margherita Pizza',
        slug: 'margherita-pizza',
        categoryId: 2,
        categoryName: 'Main Courses',
        description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil',
        price: 18.99,
        discountPrice: null,
        isActive: true,
        isFeatured: true,
        hasImage: true,
        sortOrder: 0,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-20T12:00:00Z'
      },
      {
        id: 4,
        name: 'Pepperoni Pizza',
        slug: 'pepperoni-pizza',
        categoryId: 2,
        categoryName: 'Main Courses',
        description: 'Traditional pizza with pepperoni and mozzarella cheese',
        price: 20.99,
        discountPrice: null,
        isActive: false,
        isFeatured: false,
        hasImage: false,
        sortOrder: 1,
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z'
      }
    ];

    // Apply filters
    let filteredItems = allItems;

    if (search) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filteredItems = filteredItems.filter(item =>
        item.categoryId === parseInt(category)
      );
    }

    if (status) {
      switch (status) {
        case 'active':
          filteredItems = filteredItems.filter(item => item.isActive);
          break;
        case 'inactive':
          filteredItems = filteredItems.filter(item => !item.isActive);
          break;
        case 'featured':
          filteredItems = filteredItems.filter(item => item.isFeatured);
          break;
        case 'on-sale':
          filteredItems = filteredItems.filter(item => item.discountPrice);
          break;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        items: filteredItems,
        totalItems: allItems.length,
        filteredCount: filteredItems.length,
        activeItems: allItems.filter(item => item.isActive).length,
        featuredItems: allItems.filter(item => item.isFeatured).length,
        itemsOnSale: allItems.filter(item => item.discountPrice).length
      }
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new menu item
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const body = await request.json();
    
    const {
      name,
      slug,
      categoryId,
      description,
      longDescription,
      price,
      discountPrice,
      ingredients,
      allergens,
      nutritionalInfo,
      preparationTime,
      spiceLevel,
      servingSize,
      imageAlt,
      isActive,
      isFeatured,
      sortOrder
    } = body;

    // TODO: Add validation
    if (!name || !slug || !categoryId || !description || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Check if slug is already taken
    // TODO: Validate category exists
    // TODO: Save to database

    // Mock creation response
    const newItem = {
      id: Date.now(), // Mock ID
      name,
      slug,
      categoryId: parseInt(categoryId),
      categoryName: 'Mock Category', // TODO: Get from database
      description,
      longDescription: longDescription || '',
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      ingredients: ingredients || '',
      allergens: allergens || [],
      nutritionalInfo: nutritionalInfo || {},
      preparationTime: preparationTime || '',
      spiceLevel: spiceLevel || '',
      servingSize: servingSize || '',
      imageUrl: null,
      imageAlt: imageAlt || '',
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      hasImage: false,
      sortOrder: sortOrder || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Menu item created successfully',
      data: newItem
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
