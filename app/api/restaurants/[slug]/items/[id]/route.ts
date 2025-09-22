import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params;

    // TODO: Replace with actual database query
    // Mock item data for development
    const mockItems: Record<string, Record<string, any>> = {
      'tonys-pizza': {
        '1': {
          id: 1,
          name: 'Caesar Salad',
          slug: 'caesar-salad',
          category: {
            id: 1,
            name: 'Appetizers',
            slug: 'appetizers'
          },
          description: 'Fresh romaine lettuce with parmesan cheese and croutons',
          longDescription: 'Our Caesar salad features crisp romaine lettuce tossed with our house-made Caesar dressing, fresh parmesan cheese, and homemade croutons. A classic appetizer that pairs perfectly with any main course.',
          price: 12.99,
          discountPrice: 10.99,
          ingredients: [
            'Fresh romaine lettuce',
            'Parmesan cheese',
            'Homemade croutons',
            'Caesar dressing',
            'Black pepper',
            'Lemon juice'
          ],
          allergens: ['Dairy', 'Gluten'],
          nutritionalInfo: {
            calories: 280,
            protein: '8g',
            carbs: '15g',
            fat: '22g'
          },
          preparationTime: '5-8 minutes',
          spiceLevel: 'Mild',
          servingSize: 'Individual portion',
          imageUrl: '/items/caesar-salad.jpg',
          imageAlt: 'Fresh Caesar salad with parmesan and croutons',
          isActive: true,
          isFeatured: false,
          sortOrder: 0,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z'
        },
        '2': {
          id: 2,
          name: 'Buffalo Wings',
          slug: 'buffalo-wings',
          category: {
            id: 1,
            name: 'Appetizers',
            slug: 'appetizers'
          },
          description: 'Spicy chicken wings served with blue cheese dip',
          longDescription: 'Our buffalo wings are made with fresh chicken wings, tossed in our signature buffalo sauce with the perfect balance of heat and flavor. Served with cool blue cheese dressing and celery sticks.',
          price: 14.99,
          discountPrice: null,
          ingredients: [
            'Chicken wings',
            'Buffalo sauce',
            'Blue cheese dressing',
            'Celery sticks',
            'Hot sauce',
            'Butter'
          ],
          allergens: ['Dairy'],
          nutritionalInfo: {
            calories: 420,
            protein: '28g',
            carbs: '2g',
            fat: '34g'
          },
          preparationTime: '15-20 minutes',
          spiceLevel: 'Hot',
          servingSize: '8 pieces',
          imageUrl: '/items/buffalo-wings.jpg',
          imageAlt: 'Spicy buffalo wings with blue cheese dip',
          isActive: true,
          isFeatured: true,
          sortOrder: 1,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-19T14:30:00Z'
        },
        '3': {
          id: 3,
          name: 'Margherita Pizza',
          slug: 'margherita-pizza',
          category: {
            id: 2,
            name: 'Main Courses',
            slug: 'main-courses'
          },
          description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil',
          longDescription: 'Our signature Margherita pizza features hand-stretched dough topped with San Marzano tomato sauce, fresh mozzarella di bufala, and aromatic basil leaves. Baked in our wood-fired oven at 900°F for the perfect crispy yet chewy crust.',
          price: 18.99,
          discountPrice: null,
          ingredients: [
            'Fresh mozzarella di bufala',
            'San Marzano tomato sauce',
            'Fresh basil',
            'Extra virgin olive oil',
            'Sea salt',
            'Pizza dough'
          ],
          allergens: ['Dairy', 'Gluten'],
          nutritionalInfo: {
            calories: 320,
            protein: '14g',
            carbs: '42g',
            fat: '12g'
          },
          preparationTime: '12-15 minutes',
          spiceLevel: 'Mild',
          servingSize: 'Serves 2-3 people',
          imageUrl: '/items/margherita-pizza.jpg',
          imageAlt: 'Fresh Margherita pizza with melted mozzarella and basil',
          isActive: true,
          isFeatured: true,
          sortOrder: 0,
          createdAt: '2024-01-15T00:00:00Z',
          updatedAt: '2024-01-20T12:00:00Z'
        }
      }
    };

    const restaurantItems = mockItems[slug];
    if (!restaurantItems) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    const item = restaurantItems[id];
    if (!item) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }

    // Only return active items for public API
    if (!item.isActive) {
      return NextResponse.json(
        { error: 'Menu item not available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        restaurant: {
          slug: slug
        },
        item: item
      }
    });

  } catch (error) {
    console.error('Error fetching menu item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
