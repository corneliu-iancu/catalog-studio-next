import Link from 'next/link';

export default function MenuItemsPage() {
  // TODO: Fetch all menu items data
  const menuItems = [
    {
      id: 1,
      name: 'Margherita Pizza',
      slug: 'margherita-pizza',
      category: 'Main Courses',
      categoryId: 2,
      price: 18.99,
      discountPrice: null,
      isActive: true,
      isFeatured: true,
      hasImage: true,
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Caesar Salad',
      slug: 'caesar-salad',
      category: 'Appetizers',
      categoryId: 1,
      price: 12.99,
      discountPrice: 10.99,
      isActive: true,
      isFeatured: false,
      hasImage: true,
      lastUpdated: '1 day ago'
    },
    {
      id: 3,
      name: 'Buffalo Wings',
      slug: 'buffalo-wings',
      category: 'Appetizers',
      categoryId: 1,
      price: 14.99,
      discountPrice: null,
      isActive: false,
      isFeatured: false,
      hasImage: false,
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      name: 'Tiramisu',
      slug: 'tiramisu',
      category: 'Desserts',
      categoryId: 3,
      price: 8.99,
      discountPrice: null,
      isActive: true,
      isFeatured: true,
      hasImage: true,
      lastUpdated: '1 week ago'
    }
  ];

  const categories = [
    { id: 1, name: 'Appetizers' },
    { id: 2, name: 'Main Courses' },
    { id: 3, name: 'Desserts' },
    { id: 4, name: 'Beverages' }
  ];

  return (
    <div>
      <header>
        <h1>Menu Items</h1>
        <p>Manage all your menu items in one place</p>
      </header>

      <nav>
        <Link href="/dashboard/menu">← Back to Menu Management</Link>
      </nav>

      <section>
        <div>
          <h2>Items ({menuItems.length})</h2>
          <Link href="/dashboard/menu/items/new">Add New Item</Link>
        </div>
      </section>

      <section>
        <h2>Filter & Search</h2>
        <form>
          <div>
            <label htmlFor="search">Search Items</label>
            <input 
              type="text" 
              id="search" 
              name="search" 
              placeholder="Search by name or description"
            />
          </div>

          <div>
            <label htmlFor="category">Filter by Category</label>
            <select id="category" name="category">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status">Filter by Status</label>
            <select id="status" name="status">
              <option value="">All Items</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
              <option value="featured">Featured Only</option>
              <option value="on-sale">On Sale</option>
            </select>
          </div>

          <button type="submit">Apply Filters</button>
          <button type="button">Clear Filters</button>
        </form>
      </section>

      <section>
        <h2>Menu Items List</h2>
        <div>
          <div>
            <div>Item</div>
            <div>Category</div>
            <div>Price</div>
            <div>Status</div>
            <div>Image</div>
            <div>Last Updated</div>
            <div>Actions</div>
          </div>
          
          {menuItems.map((item) => (
            <div key={item.id}>
              <div>
                <strong>{item.name}</strong>
                {item.isFeatured && <span> ⭐ Featured</span>}
              </div>
              <div>{item.category}</div>
              <div>
                {item.discountPrice ? (
                  <>
                    <span>${item.discountPrice}</span>
                    <span> (was ${item.price})</span>
                  </>
                ) : (
                  <span>${item.price}</span>
                )}
              </div>
              <div>{item.isActive ? 'Active' : 'Inactive'}</div>
              <div>{item.hasImage ? '✓' : '✗'}</div>
              <div>{item.lastUpdated}</div>
              <div>
                <Link href={`/dashboard/menu/items/${item.id}`}>View</Link>
                <Link href={`/dashboard/menu/items/${item.id}/edit`}>Edit</Link>
                <button type="button">
                  {item.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button type="button">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Bulk Actions</h2>
        <div>
          <button type="button">Activate Selected</button>
          <button type="button">Deactivate Selected</button>
          <button type="button">Delete Selected</button>
          <button type="button">Export Selected</button>
        </div>
      </section>

      <section>
        <h2>Item Statistics</h2>
        <div>
          <div>
            <h3>Total Items</h3>
            <p>{menuItems.length}</p>
          </div>
          <div>
            <h3>Active Items</h3>
            <p>{menuItems.filter(item => item.isActive).length}</p>
          </div>
          <div>
            <h3>Featured Items</h3>
            <p>{menuItems.filter(item => item.isFeatured).length}</p>
          </div>
          <div>
            <h3>Items on Sale</h3>
            <p>{menuItems.filter(item => item.discountPrice).length}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Menu Items - Dashboard',
  description: 'Manage all your menu items in one place.',
};
