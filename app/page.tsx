import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const sampleRestaurants = [
    {
      slug: 'tonys-pizza',
      name: "Tony's Pizza",
      description: "Authentic Italian pizza and pasta",
      cuisine: "Italian"
    },
    {
      slug: 'burger-palace',
      name: "Burger Palace",
      description: "Gourmet burgers and fries",
      cuisine: "American"
    },
    {
      slug: 'sushi-zen',
      name: "Sushi Zen",
      description: "Fresh sushi and Japanese cuisine",
      cuisine: "Japanese"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Catalog Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Restaurant Menu Management & Showcase Platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Restaurants Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Featured Restaurants</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover amazing restaurants and their delicious menus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sampleRestaurants.map((restaurant) => (
            <Link key={restaurant.slug} href={`/${restaurant.slug}`} className="group">
              <Card className="h-full transition-all duration-200 hover:shadow-lg group-hover:scale-[1.02]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                    <Badge variant="secondary">{restaurant.cuisine}</Badge>
                  </div>
                  <CardDescription className="text-base">
                    {restaurant.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Development Links Section */}
      <div className="container mx-auto px-4 py-16 border-t">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Development Links</h2>
          <p className="text-muted-foreground">
            Quick access to all application routes for testing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Menu Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Menu Routes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/tonys-pizza" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tony's Pizza - Main Menu
              </Link>
              <Link href="/tonys-pizza/appetizers" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Appetizers Category
              </Link>
              <Link href="/tonys-pizza/appetizers/buffalo-wings" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Buffalo Wings Product
              </Link>
            </CardContent>
          </Card>

          {/* Authentication Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/auth/signin" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Restaurant Registration
              </Link>
              <Link href="/auth/forgot-password" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Forgot Password
              </Link>
            </CardContent>
          </Card>

          {/* Dashboard Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Main Dashboard
              </Link>
              <Link href="/dashboard/profile" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Restaurant Profile
              </Link>
              <Link href="/dashboard/menu" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Menu Management
              </Link>
              <Link href="/dashboard/media" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Media Library
              </Link>
            </CardContent>
          </Card>

          {/* Info Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Info Pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/about" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link href="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
