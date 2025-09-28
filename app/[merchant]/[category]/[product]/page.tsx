import { notFound } from 'next/navigation';
import Link from 'next/link';

interface ProductPageProps {
  params: Promise<{
    merchant: string;
    category: string;
    product: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { merchant, category, product } = await params;

  // TODO: Fetch product data based on merchant, category, and product slugs
  // For now, we'll use mock data
  const productData = {
    name: product.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'A delicious dish prepared with the finest ingredients and traditional cooking methods. Perfect for any occasion.',
    longDescription: 'This signature dish represents the best of our culinary tradition. Made with locally sourced ingredients and prepared by our experienced chefs, it offers a perfect balance of flavors that will satisfy your taste buds. Each portion is carefully crafted to ensure consistency and quality.',
    price: 18.99,
    discountPrice: null,
    image: '/placeholder-food.jpg',
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
      calories: 320,
      protein: '12g',
      carbs: '18g',
      fat: '24g'
    },
    preparationTime: '10-15 minutes',
    spiceLevel: 'Mild'
  };

  const restaurantName = merchant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const categoryName = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());

  if (!productData) {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav>
        <Link href={`/${merchant}`}>{restaurantName}</Link>
        <span> / </span>
        <Link href={`/${merchant}/${category}`}>{categoryName}</Link>
        <span> / </span>
        <span>{productData.name}</span>
      </nav>

      {/* Product Details */}
      <div>
        {/* Product Image */}
        <div>
          <span>Product Image Placeholder</span>
        </div>

        {/* Product Information */}
        <div>
          <div>
            <h1>{productData.name}</h1>
            <p>{productData.description}</p>
            <p>{productData.longDescription}</p>
          </div>

          {/* Price */}
          <div>
            {productData.discountPrice ? (
              <>
                <span>${productData.discountPrice}</span>
                <span>${productData.price}</span>
                <span>Sale</span>
              </>
            ) : (
              <span>${productData.price}</span>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <h3>Ingredients</h3>
            <div>
              {productData.ingredients.map((ingredient, index) => (
                <span key={index}>{ingredient}</span>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div>
            <div>
              <span>Preparation Time:</span>
              <p>{productData.preparationTime}</p>
            </div>
            <div>
              <span>Spice Level:</span>
              <p>{productData.spiceLevel}</p>
            </div>
          </div>

          {/* Allergens */}
          {productData.allergens.length > 0 && (
            <div>
              <h3>Allergen Information</h3>
              <div>
                {productData.allergens.map((allergen, index) => (
                  <span key={index}>Contains {allergen}</span>
                ))}
              </div>
            </div>
          )}

          {/* Nutritional Info */}
          <div>
            <h3>Nutritional Information</h3>
            <div>
              <div>
                <span>Calories:</span>
                <p>{productData.nutritionalInfo.calories}</p>
              </div>
              <div>
                <span>Protein:</span>
                <p>{productData.nutritionalInfo.protein}</p>
              </div>
              <div>
                <span>Carbs:</span>
                <p>{productData.nutritionalInfo.carbs}</p>
              </div>
              <div>
                <span>Fat:</span>
                <p>{productData.nutritionalInfo.fat}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { merchant, product } = await params;
  const restaurantName = merchant.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const productName = product.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    title: `${productName} - ${restaurantName}`,
    description: `View details for ${productName} at ${restaurantName}. See ingredients, price, and nutritional information.`,
  };
}
