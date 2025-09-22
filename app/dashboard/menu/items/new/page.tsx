import Link from 'next/link';

export default function NewMenuItemPage() {
  // TODO: Fetch categories for dropdown
  const categories = [
    { id: 1, name: 'Appetizers', slug: 'appetizers' },
    { id: 2, name: 'Main Courses', slug: 'main-courses' },
    { id: 3, name: 'Desserts', slug: 'desserts' },
    { id: 4, name: 'Beverages', slug: 'beverages' }
  ];

  return (
    <div>
      <header>
        <h1>Add New Menu Item</h1>
        <p>Create a new item for your menu</p>
      </header>

      <nav>
        <Link href="/dashboard/menu/items">← Back to Menu Items</Link>
      </nav>

      <form>
        <fieldset>
          <legend>Basic Information</legend>
          
          <div>
            <label htmlFor="name">Item Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="e.g., Margherita Pizza"
              required 
            />
          </div>

          <div>
            <label htmlFor="slug">URL Slug</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              placeholder="e.g., margherita-pizza"
              required 
            />
            <small>This will be used in the URL: /restaurant/category/item-slug</small>
          </div>

          <div>
            <label htmlFor="category">Category</label>
            <select id="category" name="category" required>
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
              placeholder="Brief description that appears in category listings"
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="longDescription">Detailed Description</label>
            <textarea 
              id="longDescription" 
              name="longDescription" 
              rows={4}
              placeholder="Detailed description for the item page"
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
              placeholder="0.00"
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
              placeholder="0.00"
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
              placeholder="List ingredients separated by commas"
            ></textarea>
            <small>e.g., Fresh mozzarella, tomato sauce, basil, olive oil</small>
          </div>

          <div>
            <label htmlFor="allergens">Allergens</label>
            <div>
              <label><input type="checkbox" name="allergens" value="dairy" /> Dairy</label>
              <label><input type="checkbox" name="allergens" value="gluten" /> Gluten</label>
              <label><input type="checkbox" name="allergens" value="nuts" /> Nuts</label>
              <label><input type="checkbox" name="allergens" value="eggs" /> Eggs</label>
              <label><input type="checkbox" name="allergens" value="soy" /> Soy</label>
              <label><input type="checkbox" name="allergens" value="shellfish" /> Shellfish</label>
              <label><input type="checkbox" name="allergens" value="fish" /> Fish</label>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Nutritional Information (Optional)</legend>
          
          <div>
            <label htmlFor="calories">Calories</label>
            <input type="number" id="calories" name="calories" min="0" />
          </div>

          <div>
            <label htmlFor="protein">Protein (g)</label>
            <input type="text" id="protein" name="protein" placeholder="e.g., 12g" />
          </div>

          <div>
            <label htmlFor="carbs">Carbohydrates (g)</label>
            <input type="text" id="carbs" name="carbs" placeholder="e.g., 45g" />
          </div>

          <div>
            <label htmlFor="fat">Fat (g)</label>
            <input type="text" id="fat" name="fat" placeholder="e.g., 18g" />
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
              placeholder="e.g., 15-20 minutes"
            />
          </div>

          <div>
            <label htmlFor="spiceLevel">Spice Level</label>
            <select id="spiceLevel" name="spiceLevel">
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
              placeholder="e.g., Serves 2-3 people"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Item Image</legend>
          
          <div>
            <label htmlFor="image">Product Image</label>
            <input type="file" id="image" name="image" accept="image/*" />
            <small>Recommended size: 800x800px or larger, square aspect ratio</small>
          </div>

          <div>
            <label htmlFor="imageAlt">Image Alt Text</label>
            <input 
              type="text" 
              id="imageAlt" 
              name="imageAlt" 
              placeholder="Describe the image for accessibility"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Display Settings</legend>
          
          <div>
            <label>
              <input type="checkbox" name="isActive" defaultChecked />
              Active (visible to customers)
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" name="isFeatured" />
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
              defaultValue="0"
            />
            <small>Lower numbers appear first within the category</small>
          </div>
        </fieldset>

        <div>
          <button type="submit">Create Menu Item</button>
          <button type="button">Save as Draft</button>
          <Link href="/dashboard/menu/items">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export const metadata = {
  title: 'Add New Menu Item - Dashboard',
  description: 'Create a new menu item for your restaurant.',
};
