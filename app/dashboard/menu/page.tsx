import Link from 'next/link';

export default function MenuManagementPage() {
  // TODO: Fetch categories and items data
  const menuData = {
    categories: [
      {
        id: 1,
        name: 'Appetizers',
        slug: 'appetizers',
        itemCount: 5,
        lastUpdated: '2 hours ago'
      },
      {
        id: 2,
        name: 'Main Courses',
        slug: 'main-courses',
        itemCount: 12,
        lastUpdated: '1 day ago'
      },
      {
        id: 3,
        name: 'Desserts',
        slug: 'desserts',
        itemCount: 4,
        lastUpdated: '3 days ago'
      },
      {
        id: 4,
        name: 'Beverages',
        slug: 'beverages',
        itemCount: 8,
        lastUpdated: '1 week ago'
      }
    ],
    recentItems: [
      {
        id: 1,
        name: 'Margherita Pizza',
        category: 'Main Courses',
        price: 18.99,
        status: 'active'
      },
      {
        id: 2,
        name: 'Caesar Salad',
        category: 'Appetizers',
        price: 12.99,
        status: 'active'
      },
      {
        id: 3,
        name: 'Tiramisu',
        category: 'Desserts',
        price: 8.99,
        status: 'inactive'
      }
    ]
  };

  return (
    <div>
      <header>
        <h1>Menu Management</h1>
        <p>Organize your menu categories and items</p>
      </header>

      <nav>
        <Link href="/dashboard">← Back to Dashboard</Link>
      </nav>

      <section>
        <div>
          <h2>Quick Actions</h2>
          <Link href="/dashboard/menu/categories/new">Add New Category</Link>
          <Link href="/dashboard/menu/items/new">Add New Item</Link>
          <Link href="/dashboard/menu/items">View All Items</Link>
        </div>
      </section>

      <section>
        <h2>Menu Categories</h2>
        <div>
          {menuData.categories.map((category) => (
            <div key={category.id}>
              <div>
                <h3>{category.name}</h3>
                <p>{category.itemCount} items</p>
                <p>Last updated: {category.lastUpdated}</p>
              </div>
              <div>
                <Link href={`/dashboard/menu/categories/${category.id}/edit`}>Edit</Link>
                <button type="button">Delete</button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <Link href="/dashboard/menu/categories">Manage All Categories</Link>
        </div>
      </section>

      <section>
        <h2>Recent Menu Items</h2>
        <div>
          <div>
            <div>Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          
          {menuData.recentItems.map((item) => (
            <div key={item.id}>
              <div>{item.name}</div>
              <div>{item.category}</div>
              <div>${item.price}</div>
              <div>{item.status}</div>
              <div>
                <Link href={`/dashboard/menu/items/${item.id}`}>View</Link>
                <Link href={`/dashboard/menu/items/${item.id}/edit`}>Edit</Link>
                <button type="button">Delete</button>
              </div>
            </div>
          ))}
        </div>
        
        <div>
          <Link href="/dashboard/menu/items">View All Items</Link>
        </div>
      </section>

      <section>
        <h2>Menu Statistics</h2>
        <div>
          <div>
            <h3>Total Categories</h3>
            <p>{menuData.categories.length}</p>
          </div>
          <div>
            <h3>Total Items</h3>
            <p>{menuData.categories.reduce((sum, cat) => sum + cat.itemCount, 0)}</p>
          </div>
          <div>
            <h3>Active Items</h3>
            <p>{menuData.recentItems.filter(item => item.status === 'active').length}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Menu Management - Dashboard',
  description: 'Manage your restaurant menu categories and items.',
};
