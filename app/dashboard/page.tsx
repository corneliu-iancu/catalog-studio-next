import Link from 'next/link';

export default function DashboardPage() {
  // TODO: Fetch restaurant data and stats
  const restaurantData = {
    name: "Tony's Pizza",
    slug: "tonys-pizza",
    totalCategories: 4,
    totalItems: 23,
    recentViews: 156,
    lastUpdated: "2 hours ago"
  };

  return (
    <div>
      <header>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's an overview of your restaurant.</p>
      </header>

      <section>
        <h2>Restaurant Overview</h2>
        <div>
          <h3>{restaurantData.name}</h3>
          <p>URL: /{restaurantData.slug}</p>
          <p>Last updated: {restaurantData.lastUpdated}</p>
        </div>
      </section>

      <section>
        <h2>Quick Stats</h2>
        <div>
          <div>
            <h3>Menu Categories</h3>
            <p>{restaurantData.totalCategories}</p>
          </div>
          <div>
            <h3>Menu Items</h3>
            <p>{restaurantData.totalItems}</p>
          </div>
          <div>
            <h3>Recent Views</h3>
            <p>{restaurantData.recentViews}</p>
          </div>
        </div>
      </section>

      <section>
        <h2>Quick Actions</h2>
        <div>
          <Link href="/dashboard/menu/items/new">Add New Menu Item</Link>
          <Link href="/dashboard/menu/categories/new">Add New Category</Link>
          <Link href="/dashboard/menu">Manage Menu</Link>
          <Link href="/dashboard/profile">Edit Restaurant Profile</Link>
        </div>
      </section>

      <section>
        <h2>Recent Activity</h2>
        <div>
          <div>
            <p>Added "Margherita Pizza" to Main Courses</p>
            <small>2 hours ago</small>
          </div>
          <div>
            <p>Updated pricing for "Caesar Salad"</p>
            <small>1 day ago</small>
          </div>
          <div>
            <p>Created new category "Desserts"</p>
            <small>3 days ago</small>
          </div>
        </div>
      </section>

      <section>
        <h2>Public Menu</h2>
        <p>
          <Link href={`/${restaurantData.slug}`}>View your public menu</Link>
        </p>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Dashboard - Catalog Studio',
  description: 'Restaurant management dashboard for menu and profile management.',
};
