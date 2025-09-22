import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditMenuItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditMenuItemPage({ params }: EditMenuItemPageProps) {
  const { id } = await params;

  // TODO: Fetch menu item data by ID and categories
  const itemData = {
    id: parseInt(id),
    name: 'Margherita Pizza',
    slug: 'margherita-pizza',
    categoryId: 2,
    description: 'Classic Italian pizza with fresh mozzarella, tomato sauce, and basil',
    longDescription: 'Our signature Margherita pizza features hand-stretched dough topped with San Marzano tomato sauce, fresh mozzarella di bufala, and aromatic basil leaves. Baked in our wood-fired oven at 900°F for the perfect crispy yet chewy crust.',
    price: 18.99,
    discountPrice: null,
    ingredients: 'Fresh mozzarella di bufala, San Marzano tomato sauce, Fresh basil, Extra virgin olive oil, Sea salt, Pizza dough',
    allergens: ['dairy', 'gluten'],
    calories: 320,
    protein: '14g',
    carbs: '42g',
    fat: '12g',
    preparationTime: '12-15 minutes',
    spiceLevel: 'mild',
    servingSize: 'Serves 2-3 people',
    imageUrl: '/margherita-pizza.jpg',
    imageAlt: 'Fresh Margherita pizza with melted mozzarella and basil',
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  };

  const categories = [
    { id: 1, name: 'Appetizers', slug: 'appetizers' },
    { id: 2, name: 'Main Courses', slug: 'main-courses' },
    { id: 3, name: 'Desserts', slug: 'desserts' },
    { id: 4, name: 'Beverages', slug: 'beverages' }
  ];

  if (!itemData) {
    notFound();
  }

  return (
    <div>
      <header>
        <h1>Edit Menu Item: {itemData.name}</h1>
        <p>Update menu item information and settings</p>
      </header>

      <nav>
        <Link href={`/dashboard/menu/items/${itemData.id}`}>← Back to Item Details</Link>
      </nav>

      <form>
        <input type="hidden" name="id" value={itemData.id} />
        
        <fieldset>
          <legend>Basic Information</legend>
          
          <div>
            <label htmlFor="name">Item Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              defaultValue={itemData.name}
              required 
            />
          </div>

          <div>
            <label htmlFor="slug">URL Slug</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              defaultValue={itemData.slug}
              required 
            />
            <small>This will be used in the URL: /restaurant/category/{itemData.slug}</small>
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" defaultValue={itemData.categoryId} required>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description">Short Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={2}
              defaultValue={itemData.description}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="longDescription">Detailed Description</label>
            <textarea 
              id="longDescription" 
              name="longDescription" 
              rows={4}
              defaultValue={itemData.longDescription}
            ></textarea>
          </div>
        </fieldset>

        <fieldset>
          <legend>Pricing</legend>
          
          <div>
            <label htmlFor="price">Regular Price</label>
            <input 
              type="number" 
              id="price" 
              name="price" 
              step="0.01"
              min="0"
              defaultValue={itemData.price}
              required 
            />
          </div>

          <div>
            <label htmlFor="discountPrice">Sale Price (Optional)</label>
            <input 
              type="number" 
              id="discountPrice" 
              name="discountPrice" 
              step="0.01"
              min="0"
              defaultValue={itemData.discountPrice || ''}
            />
            <small>Leave empty if not on sale</small>
          </div>
        </fieldset>

        <fieldset>
          <legend>Ingredients & Allergens</legend>
          
          <div>
            <label htmlFor="ingredients">Ingredients</label>
            <textarea 
              id="ingredients" 
              name="ingredients" 
              rows={3}
              defaultValue={itemData.ingredients}
            ></textarea>
            <small>List ingredients separated by commas</small>
          </div>

          <div>
            <label htmlFor="allergens">Allergens</label>
            <div>
              <label><input type="checkbox" name="allergens" value="dairy" defaultChecked={itemData.allergens.includes('dairy')} /> Dairy</label>
              <label><input type="checkbox" name="allergens" value="gluten" defaultChecked={itemData.allergens.includes('gluten')} /> Gluten</label>
              <label><input type="checkbox" name="allergens" value="nuts" defaultChecked={itemData.allergens.includes('nuts')} /> Nuts</label>
              <label><input type="checkbox" name="allergens" value="eggs" defaultChecked={itemData.allergens.includes('eggs')} /> Eggs</label>
              <label><input type="checkbox" name="allergens" value="soy" defaultChecked={itemData.allergens.includes('soy')} /> Soy</label>
              <label><input type="checkbox" name="allergens" value="shellfish" defaultChecked={itemData.allergens.includes('shellfish')} /> Shellfish</label>
              <label><input type="checkbox" name="allergens" value="fish" defaultChecked={itemData.allergens.includes('fish')} /> Fish</label>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Nutritional Information</legend>
          
          <div>
            <label htmlFor="calories">Calories</label>
            <input type="number" id="calories" name="calories" min="0" defaultValue={itemData.calories} />
          </div>

          <div>
            <label htmlFor="protein">Protein (g)</label>
            <input type="text" id="protein" name="protein" defaultValue={itemData.protein} />
          </div>

          <div>
            <label htmlFor="carbs">Carbohydrates (g)</label>
            <input type="text" id="carbs" name="carbs" defaultValue={itemData.carbs} />
          </div>

          <div>
            <label htmlFor="fat">Fat (g)</label>
            <input type="text" id="fat" name="fat" defaultValue={itemData.fat} />
          </div>
        </fieldset>

        <fieldset>
          <legend>Additional Details</legend>
          
          <div>
            <label htmlFor="preparationTime">Preparation Time</label>
            <input 
              type="text" 
              id="preparationTime" 
              name="preparationTime" 
              defaultValue={itemData.preparationTime}
            />
          </div>

          <div>
            <label htmlFor="spiceLevel">Spice Level</label>
            <select id="spiceLevel" name="spiceLevel" defaultValue={itemData.spiceLevel}>
              <option value="">Not specified</option>
              <option value="mild">Mild</option>
              <option value="medium">Medium</option>
              <option value="hot">Hot</option>
              <option value="very-hot">Very Hot</option>
            </select>
          </div>

          <div>
            <label htmlFor="servingSize">Serving Size</label>
            <input 
              type="text" 
              id="servingSize" 
              name="servingSize" 
              defaultValue={itemData.servingSize}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Item Image</legend>
          
          {itemData.imageUrl && (
            <div>
              <p>Current Image:</p>
              <img src={itemData.imageUrl} alt={itemData.imageAlt} width="200" />
            </div>
          )}
          
          <div>
            <label htmlFor="image">Update Product Image</label>
            <input type="file" id="image" name="image" accept="image/*" />
            <small>Leave empty to keep current image</small>
          </div>

          <div>
            <label htmlFor="imageAlt">Image Alt Text</label>
            <input 
              type="text" 
              id="imageAlt" 
              name="imageAlt" 
              defaultValue={itemData.imageAlt}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Display Settings</legend>
          
          <div>
            <label>
              <input type="checkbox" name="isActive" defaultChecked={itemData.isActive} />
              Active (visible to customers)
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" name="isFeatured" defaultChecked={itemData.isFeatured} />
              Featured item
            </label>
          </div>

          <div>
            <label htmlFor="sortOrder">Sort Order</label>
            <input 
              type="number" 
              id="sortOrder" 
              name="sortOrder" 
              min="0"
              defaultValue={itemData.sortOrder}
            />
            <small>Lower numbers appear first within the category</small>
          </div>
        </fieldset>

        <div>
          <button type="submit">Update Menu Item</button>
          <button type="button">Save as Draft</button>
          <Link href={`/dashboard/menu/items/${itemData.id}`}>Cancel</Link>
        </div>
      </form>

      <section>
        <h2>Danger Zone</h2>
        <div>
          <h3>Delete Menu Item</h3>
          <p>Permanently delete this menu item. This action cannot be undone.</p>
          <button type="button">Delete Menu Item</button>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: EditMenuItemPageProps) {
  const { id } = await params;
  
  return {
    title: `Edit Menu Item - Dashboard`,
    description: `Edit menu item information and settings.`,
  };
}
