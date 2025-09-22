import Link from 'next/link';
import { notFound } from 'next/navigation';

interface MenuItemDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MenuItemDetailPage({ params }: MenuItemDetailPageProps) {
  const { id } = await params;

  // TODO: Fetch menu item data by ID
  // For now, we'll use mock data
  const itemData = {
    id: parseInt(id),
    name: 'Margherita Pizza',
    slug: 'margherita-pizza',
    category: 'Main Courses',
    categoryId: 2,
    categorySlug: 'main-courses',
    description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil',
    longDescription: 'Our signature Margherita pizza features hand-stretched dough topped with San Marzano tomato sauce, fresh mozzarella di bufala, and aromatic basil leaves. Baked in our wood-fired oven at 900°F for the perfect crispy yet chewy crust.',
    price: 18.99,
    discountPrice: null,
    ingredients: ['Fresh mozzarella di bufala', 'San Marzano tomato sauce', 'Fresh basil', 'Extra virgin olive oil', 'Sea salt', 'Pizza dough'],
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
    imageUrl: '/margherita-pizza.jpg',
    imageAlt: 'Fresh Margherita pizza with melted mozzarella and basil',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: '2024-01-15',
    lastUpdated: '2 hours ago',
    views: 156,
    orders: 23
  };

  if (!itemData) {
    notFound();
  }

  return (
    <div>
      <header>
        <h1>{itemData.name}</h1>
        <p>Menu item details and management</p>
      </header>

      <nav>
        <Link href="/dashboard/menu/items">← Back to Menu Items</Link>
        <Link href={`/dashboard/menu/items/${itemData.id}/edit`}>Edit Item</Link>
      </nav>

      <section>
        <h2>Item Overview</h2>
        <div>
          <div>
            <h3>Basic Information</h3>
            <p><strong>Name:</strong> {itemData.name}</p>
            <p><strong>Category:</strong> {itemData.category}</p>
            <p><strong>Status:</strong> {itemData.isActive ? 'Active' : 'Inactive'}</p>
            <p><strong>Featured:</strong> {itemData.isFeatured ? 'Yes' : 'No'}</p>
            <p><strong>Created:</strong> {itemData.createdAt}</p>
            <p><strong>Last Updated:</strong> {itemData.lastUpdated}</p>
          </div>

          <div>
            <h3>Performance</h3>
            <p><strong>Views:</strong> {itemData.views}</p>
            <p><strong>Orders:</strong> {itemData.orders}</p>
            <p><strong>Conversion Rate:</strong> {((itemData.orders / itemData.views) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Item Details</h2>
        
        <div>
          <h3>Description</h3>
          <p><strong>Short:</strong> {itemData.description}</p>
          <p><strong>Detailed:</strong> {itemData.longDescription}</p>
        </div>

        <div>
          <h3>Pricing</h3>
          <p><strong>Regular Price:</strong> ${itemData.price}</p>
          {itemData.discountPrice && (
            <p><strong>Sale Price:</strong> ${itemData.discountPrice}</p>
          )}
        </div>

        <div>
          <h3>Ingredients</h3>
          <ul>
            {itemData.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Allergen Information</h3>
          <p>{itemData.allergens.join(', ')}</p>
        </div>

        <div>
          <h3>Nutritional Information</h3>
          <p><strong>Calories:</strong> {itemData.nutritionalInfo.calories}</p>
          <p><strong>Protein:</strong> {itemData.nutritionalInfo.protein}</p>
          <p><strong>Carbohydrates:</strong> {itemData.nutritionalInfo.carbs}</p>
          <p><strong>Fat:</strong> {itemData.nutritionalInfo.fat}</p>
        </div>

        <div>
          <h3>Additional Details</h3>
          <p><strong>Preparation Time:</strong> {itemData.preparationTime}</p>
          <p><strong>Spice Level:</strong> {itemData.spiceLevel}</p>
          <p><strong>Serving Size:</strong> {itemData.servingSize}</p>
          <p><strong>Sort Order:</strong> {itemData.sortOrder}</p>
        </div>
      </section>

      <section>
        <h2>Item Image</h2>
        {itemData.imageUrl ? (
          <div>
            <img src={itemData.imageUrl} alt={itemData.imageAlt} width="400" />
            <p><strong>Alt Text:</strong> {itemData.imageAlt}</p>
          </div>
        ) : (
          <p>No image uploaded</p>
        )}
      </section>

      <section>
        <h2>Public Links</h2>
        <div>
          <p>
            <strong>Category Page:</strong> 
            <Link href={`/tonys-pizza/${itemData.categorySlug}`}>
              View in category
            </Link>
          </p>
          <p>
            <strong>Item Page:</strong> 
            <Link href={`/tonys-pizza/${itemData.categorySlug}/${itemData.slug}`}>
              View item page
            </Link>
          </p>
        </div>
      </section>

      <section>
        <h2>Quick Actions</h2>
        <div>
          <button type="button">
            {itemData.isActive ? 'Deactivate Item' : 'Activate Item'}
          </button>
          <button type="button">
            {itemData.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
          </button>
          <button type="button">Duplicate Item</button>
          <Link href={`/dashboard/menu/items/${itemData.id}/edit`}>Edit Item</Link>
        </div>
      </section>

      <section>
        <h2>Danger Zone</h2>
        <div>
          <h3>Delete Item</h3>
          <p>Permanently delete this menu item. This action cannot be undone.</p>
          <button type="button">Delete Item</button>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: MenuItemDetailPageProps) {
  const { id } = await params;
  
  return {
    title: `Menu Item Details - Dashboard`,
    description: `View and manage menu item details.`,
  };
}
