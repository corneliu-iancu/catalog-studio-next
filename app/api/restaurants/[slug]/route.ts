import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // TODO: Replace with actual database query
    // Mock restaurant data for development
    const mockRestaurants: Record<string, any> = {
      'tonys-pizza': {
        id: 1,
        name: "Tony's Pizza",
        slug: 'tonys-pizza',
        description: 'Authentic Italian pizza and pasta made with fresh ingredients',
        cuisine: 'italian',
        owner: {
          name: 'Tony Rossi',
          email: 'tony@tonyspizza.com',
          phone: '(555) 123-4567'
        },
        address: '123 Main Street, Food City, FC 12345',
        website: 'https://tonyspizza.com',
        hours: {
          monday: '11:00 AM - 10:00 PM',
          tuesday: '11:00 AM - 10:00 PM',
          wednesday: '11:00 AM - 10:00 PM',
          thursday: '11:00 AM - 10:00 PM',
          friday: '11:00 AM - 11:00 PM',
          saturday: '11:00 AM - 11:00 PM',
          sunday: '12:00 PM - 9:00 PM'
        },
        isActive: true,
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-20T12:00:00Z'
      },
      'burger-palace': {
        id: 2,
        name: 'Burger Palace',
        slug: 'burger-palace',
        description: 'Gourmet burgers and fries made with premium ingredients',
        cuisine: 'american',
        owner: {
          name: 'Mike Johnson',
          email: 'mike@burgerpalace.com',
          phone: '(555) 987-6543'
        },
        address: '456 Food Street, Burger City, BC 67890',
        website: 'https://burgerpalace.com',
        hours: {
          monday: '10:00 AM - 11:00 PM',
          tuesday: '10:00 AM - 11:00 PM',
          wednesday: '10:00 AM - 11:00 PM',
          thursday: '10:00 AM - 11:00 PM',
          friday: '10:00 AM - 12:00 AM',
          saturday: '10:00 AM - 12:00 AM',
          sunday: '11:00 AM - 10:00 PM'
        },
        isActive: true,
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-18T15:30:00Z'
      }
    };

    const restaurant = mockRestaurants[slug];

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: restaurant
    });

  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
