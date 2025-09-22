import Link from "next/link";

export default function Home() {
  const sampleRestaurants = [
    {
      slug: 'tonys-pizza',
      name: "Tony's Pizza",
      description: "Authentic Italian pizza and pasta"
    },
    {
      slug: 'burger-palace',
      name: "Burger Palace",
      description: "Gourmet burgers and fries"
    },
    {
      slug: 'sushi-zen',
      name: "Sushi Zen",
      description: "Fresh sushi and Japanese cuisine"
    }
  ];

  return (
    <div>
      <header>
        <h1>Catalog Studio</h1>
        <p>Restaurant Menu Management & Showcase Platform</p>
      </header>

      <section>
        <h2>Featured Restaurants</h2>
        <div>
          {sampleRestaurants.map((restaurant) => (
            <Link key={restaurant.slug} href={`/${restaurant.slug}`}>
              <h3>{restaurant.name}</h3>
              <p>{restaurant.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>Quick Test Links</h2>
        <div>
          <h3>Menu Routes</h3>
          <div>
            <Link href="/tonys-pizza">Tony's Pizza - Main Menu</Link>
          </div>
          <div>
            <Link href="/tonys-pizza/appetizers">Tony's Pizza - Appetizers Category</Link>
          </div>
          <div>
            <Link href="/tonys-pizza/appetizers/buffalo-wings">Tony's Pizza - Buffalo Wings Product</Link>
          </div>
        </div>

        <div>
          <h3>Authentication Routes</h3>
          <div>
            <Link href="/auth/signin">Sign In</Link>
          </div>
          <div>
            <Link href="/auth/signup">Restaurant Registration</Link>
          </div>
          <div>
            <Link href="/auth/forgot-password">Forgot Password</Link>
          </div>
          <div>
            <Link href="/auth/reset-password?token=sample-token&email=test@example.com">Reset Password (with token)</Link>
          </div>
        </div>

        <div>
          <h3>Dashboard Routes</h3>
          <div>
            <Link href="/dashboard">Main Dashboard</Link>
          </div>
          <div>
            <Link href="/dashboard/profile">Restaurant Profile</Link>
          </div>
          <div>
            <Link href="/dashboard/settings">Account Settings</Link>
          </div>
          <div>
            <Link href="/dashboard/menu">Menu Management</Link>
          </div>
          <div>
            <Link href="/dashboard/menu/categories">Categories</Link>
          </div>
          <div>
            <Link href="/dashboard/menu/items">Menu Items</Link>
          </div>
          <div>
            <Link href="/dashboard/menu/items/new">Add New Item</Link>
          </div>
          <div>
            <Link href="/dashboard/media">Media Library</Link>
          </div>
        </div>

        <div>
          <h3>Legal & Info Pages</h3>
          <div>
            <Link href="/about">About Us</Link>
          </div>
          <div>
            <Link href="/contact">Contact</Link>
          </div>
          <div>
            <Link href="/faq">FAQ</Link>
          </div>
          <div>
            <Link href="/terms">Terms of Service</Link>
          </div>
          <div>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
