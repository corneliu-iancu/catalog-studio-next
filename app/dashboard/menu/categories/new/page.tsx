import Link from 'next/link';

export default function NewCategoryPage() {
  return (
    <div>
      <header>
        <h1>Create New Category</h1>
        <p>Add a new category to organize your menu items</p>
      </header>

      <nav>
        <Link href="/dashboard/menu/categories">← Back to Categories</Link>
      </nav>

      <form>
        <fieldset>
          <legend>Category Information</legend>
          
          <div>
            <label htmlFor="name">Category Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="e.g., Appetizers, Main Courses, Desserts"
              required 
            />
          </div>

          <div>
            <label htmlFor="slug">URL Slug</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              placeholder="e.g., appetizers, main-courses, desserts"
              required 
            />
            <small>This will be used in the URL: /restaurant-name/category-slug</small>
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              placeholder="Brief description of this category"
            ></textarea>
          </div>
        </fieldset>

        <fieldset>
          <legend>Display Settings</legend>
          
          <div>
            <label htmlFor="sortOrder">Sort Order</label>
            <input 
              type="number" 
              id="sortOrder" 
              name="sortOrder" 
              min="0"
              defaultValue="0"
            />
            <small>Lower numbers appear first (0 = first position)</small>
          </div>

          <div>
            <label>
              <input type="checkbox" name="isActive" defaultChecked />
              Active (visible to customers)
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" name="isFeatured" />
              Featured category
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Category Image (Optional)</legend>
          
          <div>
            <label htmlFor="image">Category Image</label>
            <input type="file" id="image" name="image" accept="image/*" />
            <small>Recommended size: 800x600px or larger</small>
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
          <legend>SEO Settings</legend>
          
          <div>
            <label htmlFor="metaTitle">Meta Title</label>
            <input 
              type="text" 
              id="metaTitle" 
              name="metaTitle" 
              maxLength={60}
              placeholder="SEO title for this category page"
            />
            <small>Recommended: 50-60 characters</small>
          </div>

          <div>
            <label htmlFor="metaDescription">Meta Description</label>
            <textarea 
              id="metaDescription" 
              name="metaDescription" 
              rows={2}
              maxLength={160}
              placeholder="SEO description for this category page"
            ></textarea>
            <small>Recommended: 150-160 characters</small>
          </div>
        </fieldset>

        <div>
          <button type="submit">Create Category</button>
          <button type="button">Save as Draft</button>
          <Link href="/dashboard/menu/categories">Cancel</Link>
        </div>
      </form>

      <section>
        <h2>Category Guidelines</h2>
        <ul>
          <li>Use clear, descriptive names that customers will understand</li>
          <li>Keep category names short and memorable</li>
          <li>Use consistent naming conventions across your menu</li>
          <li>Consider the logical flow of a meal when ordering categories</li>
          <li>Add descriptions to help customers understand what's included</li>
        </ul>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Create New Category - Dashboard',
  description: 'Create a new menu category for your restaurant.',
};
