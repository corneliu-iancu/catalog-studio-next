import { notFound } from 'next/navigation';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{
    merchant: string;
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { merchant, category } = await params;

  // TODO: Fetch category and products data based on merchant and category slugs
  // For now, we'll use mock data
  const categoryData = {
    name: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `Delicious ${category.replace('-', ' ')} from our kitchen`,
    products: [
      {
        slug: 'classic-caesar-salad',
        name: 'Classic Caesar Salad',
        description: 'Fresh romaine lettuce with parmesan cheese and croutons',
        price: 12.99,
        image: '/placeholder-food.jpg'
      },
      {
        slug: 'buffalo-wings',
        name: 'Buffalo Wings',
        description: 'Spicy chicken wings served with blue cheese dip',
        price: 14.99,
        discountPrice: 11.99,
        image: '/placeholder-food.jpg'
      },
      {
        slug: 'mozzarella-sticks',
        name: 'Mozzarella Sticks',
        description: 'Golden fried mozzarella with marinara sauce',
        price: 9.99,
        image: '/placeholder-food.jpg'
      }
    ]
  };

  const restaurantName = merchant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (!categoryData) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav>
        <Link href={`/${merchant}`}>{restaurantName}</Link>
        <span> / </span>
        <span>{categoryData.name}</span>
      </nav>

      {/* Category Header */}
      <header>
        <h1>{categoryData.name}</h1>
        <p>{categoryData.description}</p>
      </header>

      {/* Products List */}
      <section>
        <div>
          {categoryData.products.map((product) => (
            <Link key={product.slug} href={`/${merchant}/${category}/${product.slug}`}>
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div>
                  {product.discountPrice ? (
                    <>
                      <span>${product.discountPrice}</span>
                      <span>${product.price}</span>
                    </>
                  ) : (
                    <span>${product.price}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { merchant, category } = await params;
  const restaurantName = merchant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${categoryName} - ${restaurantName}`,
    description: `Browse ${categoryName.toLowerCase()} at ${restaurantName}. View our delicious menu items and prices.`,
  };
}
