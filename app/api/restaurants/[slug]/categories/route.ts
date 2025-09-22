import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // TODO: Replace with actual database query
    // Mock categories data for development
    const mockCategories: Record<string, any> = {
      'tonys-pizza': [
        {
          id: 1,
          name: 'Appetizers',
          slug: 'appetizers',
          description: 'Start your meal right with our delicious appetizers',
          sortOrder: 0,
          isActive: true,
          itemCount: 5,
          imageUrl: '/categories/appetizers.jpg',
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
          itemCount: 12,
          imageUrl: '/categories/main-courses.jpg',
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
          itemCount: 4,
          imageUrl: '/categories/desserts.jpg',
          createdAt: '2024-01-16T00:00:00Z',
          updatedAt: '2024-01-18T16:45:00Z'
        },
        {
          id: 4,
          name: 'Beverages',
          slug: 'beverages',
          description: 'Refreshing drinks and specialty beverages',
          sortOrder: 3,
          isActive: true,
          itemCount: 8,
          imageUrl: '/categories/beverages.jpg',
          createdAt: '2024-01-17T00:00:00Z',
          updatedAt: '2024-01-17T12:00:00Z'
        }
      ]
    };

    const categories = mockCategories[slug];

    if (!categories) {
      return NextResponse.json(
        { error: 'Restaurant categories not found' },
        { status: 404 }
      );
    }

    // Filter only active categories and sort by sortOrder
    const activeCategories = categories
      .filter((category: any) => category.isActive)
      .sort((a: any, b: any) => a.sortOrder - b.sortOrder);

    return NextResponse.json({
      success: true,
      data: {
        restaurantSlug: slug,
        categories: activeCategories,
        totalCategories: activeCategories.length,
        lastUpdated: Math.max(...categories.map((c: any) => new Date(c.updatedAt).getTime()))
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
