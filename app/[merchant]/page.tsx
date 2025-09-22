import { notFound } from 'next/navigation';

interface MerchantPageProps {
  params: Promise<{
    merchant: string;
  }>;
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  const { merchant } = await params;

  // TODO: Fetch restaurant data based on merchant slug
  // For now, we'll use mock data
  const restaurant = {
    name: merchant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: "Welcome to our restaurant! Browse our delicious menu categories below.",
    categories: [
      { slug: 'appetizers', name: 'Appetizers', description: 'Start your meal right' },
      { slug: 'main-courses', name: 'Main Courses', description: 'Our signature dishes' },
      { slug: 'desserts', name: 'Desserts', description: 'Sweet endings' },
      { slug: 'beverages', name: 'Beverages', description: 'Drinks and refreshments' }
    ]
  };

  if (!restaurant) {
    notFound();
  }

  return (
    <div>
      <header>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.description}</p>
      </header>

      <section>
        <h2>Menu Categories</h2>
        <div>
          {restaurant.categories.map((category) => (
            <a key={category.slug} href={`/${merchant}/${category.slug}`}>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: MerchantPageProps) {
  const { merchant } = await params;
  const restaurantName = merchant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${restaurantName} - Menu`,
    description: `Browse the menu at ${restaurantName}. View our categories and delicious dishes.`,
  };
}
