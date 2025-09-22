import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // TODO: Replace with actual database query
    // Mock menu data for development
    const mockMenus: Record<string, any> = {
      'tonys-pizza': {
        restaurant: {
          id: 1,
          name: "Tony's Pizza",
          slug: 'tonys-pizza'
        },
        categories: [
          {
            id: 1,
            name: 'Appetizers',
            slug: 'appetizers',
            description: 'Start your meal right with our delicious appetizers',
            sortOrder: 0,
            isActive: true,
            items: [
              {
                id: 1,
                name: 'Caesar Salad',
                slug: 'caesar-salad',
                description: 'Fresh romaine lettuce with parmesan cheese and croutons',
                price: 12.99,
                discountPrice: 10.99,
                isActive: true,
                isFeatured: false,
                sortOrder: 0
              },
              {
                id: 2,
                name: 'Buffalo Wings',
                slug: 'buffalo-wings',
                description: 'Spicy chicken wings served with blue cheese dip',
                price: 14.99,
                discountPrice: null,
                isActive: true,
                isFeatured: true,
                sortOrder: 1
              }
            ]
          },
          {
            id: 2,
            name: 'Main Courses',
            slug: 'main-courses',
            description: 'Our signature dishes and hearty main courses',
            sortOrder: 1,
            isActive: true,
            items: [
              {
                id: 3,
                name: 'Margherita Pizza',
                slug: 'margherita-pizza',
                description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil',
                price: 18.99,
                discountPrice: null,
                isActive: true,
                isFeatured: true,
                sortOrder: 0
              },
              {
                id: 4,
                name: 'Pepperoni Pizza',
                slug: 'pepperoni-pizza',
                description: 'Traditional pizza with pepperoni and mozzarella cheese',
                price: 20.99,
                discountPrice: null,
                isActive: true,
                isFeatured: false,
                sortOrder: 1
              }
            ]
          },
          {
            id: 3,
            name: 'Desserts',
            slug: 'desserts',
            description: 'Sweet endings to your perfect meal',
            sortOrder: 2,
            isActive: true,
            items: [
              {
                id: 5,
                name: 'Tiramisu',
                slug: 'tiramisu',
                description: 'Classic Italian dessert with coffee-soaked ladyfingers',
                price: 8.99,
                discountPrice: null,
                isActive: true,
                isFeatured: true,
                sortOrder: 0
              }
            ]
          }
        ],
        lastUpdated: '2024-01-20T12:00:00Z'
      }
    };

    const menu = mockMenus[slug];

    if (!menu) {
      return NextResponse.json(
        { error: 'Restaurant menu not found' },
        { status: 404 }
      );
    }

    // Filter only active categories and items
    const activeMenu = {
      ...menu,
      categories: menu.categories
        .filter((category: any) => category.isActive)
        .map((category: any) => ({
          ...category,
          items: category.items
            .filter((item: any) => item.isActive)
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
        }))
        .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
    };

    return NextResponse.json({
      success: true,
      data: activeMenu
    });

  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
