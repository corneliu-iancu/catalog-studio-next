import Link from 'next/link';
import { notFound } from 'next/navigation';

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  // TODO: Fetch category data by ID
  // For now, we'll use mock data
  const categoryData = {
    id: parseInt(id),
    name: 'Appetizers',
    slug: 'appetizers',
    description: 'Start your meal right with our delicious appetizers',
    sortOrder: 0,
    isActive: true,
    isFeatured: false,
    imageUrl: '/category-appetizers.jpg',
    imageAlt: 'Delicious appetizers on a wooden board',
    metaTitle: 'Appetizers - Tony\'s Pizza',
    metaDescription: 'Explore our selection of fresh appetizers including salads, wings, and more.',
    itemCount: 5,
    createdAt: '2024-01-15',
    lastUpdated: '2 hours ago'
  };

  if (!categoryData) {
    notFound();
  }

  return (
    <div>
      <header>
        <h1>Edit Category: {categoryData.name}</h1>
        <p>Update category information and settings</p>
      </header>

      <nav>
        <Link href="/dashboard/menu/categories">← Back to Categories</Link>
      </nav>

      <section>
        <h2>Category Details</h2>
        <div>
          <p><strong>Created:</strong> {categoryData.createdAt}</p>
          <p><strong>Last Updated:</strong> {categoryData.lastUpdated}</p>
          <p><strong>Items in Category:</strong> {categoryData.itemCount}</p>
        </div>
      </section>

      <form>
        <input type="hidden" name="id" value={categoryData.id} />
        
        <fieldset>
          <legend>Category Information</legend>
          
          <div>
            <label htmlFor="name">Category Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              defaultValue={categoryData.name}
              required 
            />
          </div>

          <div>
            <label htmlFor="slug">URL Slug</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              defaultValue={categoryData.slug}
              required 
            />
            <small>This will be used in the URL: /restaurant-name/{categoryData.slug}</small>
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              defaultValue={categoryData.description}
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
              defaultValue={categoryData.sortOrder}
            />
            <small>Lower numbers appear first (0 = first position)</small>
          </div>

          <div>
            <label>
              <input 
                type="checkbox" 
                name="isActive" 
                defaultChecked={categoryData.isActive} 
              />
              Active (visible to customers)
            </label>
          </div>

          <div>
            <label>
              <input 
                type="checkbox" 
                name="isFeatured" 
                defaultChecked={categoryData.isFeatured} 
              />
              Featured category
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Category Image</legend>
          
          {categoryData.imageUrl && (
            <div>
              <p>Current Image:</p>
              <img src={categoryData.imageUrl} alt={categoryData.imageAlt} width="200" />
            </div>
          )}
          
          <div>
            <label htmlFor="image">Update Category Image</label>
            <input type="file" id="image" name="image" accept="image/*" />
            <small>Leave empty to keep current image</small>
          </div>

          <div>
            <label htmlFor="imageAlt">Image Alt Text</label>
            <input 
              type="text" 
              id="imageAlt" 
              name="imageAlt" 
              defaultValue={categoryData.imageAlt}
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
              defaultValue={categoryData.metaTitle}
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
              defaultValue={categoryData.metaDescription}
            ></textarea>
            <small>Recommended: 150-160 characters</small>
          </div>
        </fieldset>

        <div>
          <button type="submit">Update Category</button>
          <button type="button">Save as Draft</button>
          <Link href="/dashboard/menu/categories">Cancel</Link>
        </div>
      </form>

      <section>
        <h2>Danger Zone</h2>
        <div>
          <h3>Delete Category</h3>
          <p>
            Permanently delete this category and move all items ({categoryData.itemCount}) to "Uncategorized". 
            This action cannot be undone.
          </p>
          <button type="button">Delete Category</button>
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: EditCategoryPageProps) {
  const { id } = await params;
  
  return {
    title: `Edit Category - Dashboard`,
    description: `Edit menu category settings and information.`,
  };
}
