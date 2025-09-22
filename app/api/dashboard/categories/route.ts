import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all categories for dashboard
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication check
    // TODO: Replace with actual database query

    // Mock categories data for development
    const categories = [
      {
        id: 1,
        name: 'Appetizers',
        slug: 'appetizers',
        description: 'Start your meal right with our delicious appetizers',
        sortOrder: 0,
        isActive: true,
        isFeatured: false,
        itemCount: 5,
        imageUrl: '/categories/appetizers.jpg',
        imageAlt: 'Delicious appetizers on a wooden board',
        metaTitle: 'Appetizers - Tony\'s Pizza',
        metaDescription: 'Explore our selection of fresh appetizers including salads, wings, and more.',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
      },
      {
        id: 2,
        name: 'Main Courses',
        slug: 'main-courses',
        description: 'Our signature dishes and hearty main courses',
        sortOrder: 1,
        isActive: true,
        isFeatured: true,
        itemCount: 12,
        imageUrl: '/categories/main-courses.jpg',
        imageAlt: 'Delicious main course dishes',
        metaTitle: 'Main Courses - Tony\'s Pizza',
        metaDescription: 'Discover our signature pizzas, pastas, and main dishes.',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-19T14:30:00Z'
      },
      {
        id: 3,
        name: 'Desserts',
        slug: 'desserts',
        description: 'Sweet endings to your perfect meal',
        sortOrder: 2,
        isActive: true,
        isFeatured: false,
        itemCount: 4,
        imageUrl: '/categories/desserts.jpg',
        imageAlt: 'Sweet desserts and treats',
        metaTitle: 'Desserts - Tony\'s Pizza',
        metaDescription: 'End your meal with our delicious desserts and sweet treats.',
        createdAt: '2024-01-16T00:00:00Z',
        updatedAt: '2024-01-18T16:45:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      data: {
        categories,
        totalCategories: categories.length,
        activeCategories: categories.filter(c => c.isActive).length,
        totalItems: categories.reduce((sum, c) => sum + c.itemCount, 0)
      }
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication check
    
    const body = await request.json();
    
    const {
      name,
      slug,
      description,
      sortOrder,
      isActive,
      isFeatured,
      imageAlt,
      metaTitle,
      metaDescription
    } = body;

    // TODO: Add validation
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // TODO: Check if slug is already taken
    // TODO: Save to database

    // Mock creation response
    const newCategory = {
      id: Date.now(), // Mock ID
      name,
      slug,
      description: description || '',
      sortOrder: sortOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
      itemCount: 0,
      imageUrl: null,
      imageAlt: imageAlt || '',
      metaTitle: metaTitle || `${name} - Restaurant Name`,
      metaDescription: metaDescription || `Browse our ${name.toLowerCase()} selection.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      data: newCategory
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
