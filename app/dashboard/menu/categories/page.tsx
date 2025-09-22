import Link from 'next/link';

export default function CategoriesPage() {
  // TODO: Fetch all categories data
  const categories = [
    {
      id: 1,
      name: 'Appetizers',
      slug: 'appetizers',
      description: 'Start your meal right with our delicious appetizers',
      itemCount: 5,
      isActive: true,
      createdAt: '2024-01-15',
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Main Courses',
      slug: 'main-courses',
      description: 'Our signature dishes and hearty main courses',
      itemCount: 12,
      isActive: true,
      createdAt: '2024-01-15',
      lastUpdated: '1 day ago'
    },
    {
      id: 3,
      name: 'Desserts',
      slug: 'desserts',
      description: 'Sweet endings to your perfect meal',
      itemCount: 4,
      isActive: true,
      createdAt: '2024-01-20',
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      name: 'Beverages',
      slug: 'beverages',
      description: 'Refreshing drinks and specialty beverages',
      itemCount: 8,
      isActive: false,
      createdAt: '2024-01-22',
      lastUpdated: '1 week ago'
    }
  ];

  return (
    <div>
      <header>
        <h1>Menu Categories</h1>
        <p>Manage your menu categories and organization</p>
      </header>

      <nav>
        <Link href="/dashboard/menu">← Back to Menu Management</Link>
      </nav>

      <section>
        <div>
          <h2>Categories ({categories.length})</h2>
          <Link href="/dashboard/menu/categories/new">Add New Category</Link>
        </div>
      </section>

      <section>
        <div>
          <div>
            <div>Name</div>
            <div>Slug</div>
            <div>Items</div>
            <div>Status</div>
            <div>Last Updated</div>
            <div>Actions</div>
          </div>
          
          {categories.map((category) => (
            <div key={category.id}>
              <div>
                <strong>{category.name}</strong>
                <p>{category.description}</p>
              </div>
              <div>{category.slug}</div>
              <div>{category.itemCount}</div>
              <div>{category.isActive ? 'Active' : 'Inactive'}</div>
              <div>{category.lastUpdated}</div>
              <div>
                <Link href={`/dashboard/menu/categories/${category.id}/edit`}>Edit</Link>
                <button type="button">
                  {category.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button type="button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Category Management</h2>
        <div>
          <div>
            <h3>Bulk Actions</h3>
            <button type="button">Activate All</button>
            <button type="button">Deactivate All</button>
            <button type="button">Reorder Categories</button>
          </div>
          
          <div>
            <h3>Import/Export</h3>
            <button type="button">Export Categories</button>
            <input type="file" accept=".json,.csv" />
            <button type="button">Import Categories</button>
          </div>
        </div>
      </section>

      <section>
        <h2>Category Statistics</h2>
        <div>
          <div>
            <h3>Total Categories</h3>
            <p>{categories.length}</p>
          </div>
          <div>
            <h3>Active Categories</h3>
            <p>{categories.filter(cat => cat.isActive).length}</p>
          </div>
          <div>
            <h3>Total Items</h3>
            <p>{categories.reduce((sum, cat) => sum + cat.itemCount, 0)}</p>
          </div>
          <div>
            <h3>Average Items per Category</h3>
            <p>{Math.round(categories.reduce((sum, cat) => sum + cat.itemCount, 0) / categories.length)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Menu Categories - Dashboard',
  description: 'Manage all your menu categories in one place.',
};
