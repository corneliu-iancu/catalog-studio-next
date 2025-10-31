import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, QrCode, Palette, BarChart3, ChefHat, Coffee, Utensils, UserPlus, Upload, Share2, ArrowRight } from "lucide-react";

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
      {/* Hero Section - Full screen with bold visuals */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        {/* TODO: Add hero background image or video here
            Sources:
            - Unsplash: "restaurant menu", "dining experience", "food photography"
            - Pexels Video: restaurant ambiance looping video
            - Coverr.co: free restaurant videos
            Recommended: Split-screen image showing restaurant table + phone with menu
        */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 z-0" />

        <div className="container mx-auto px-4 z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Your menu, beautifully presented
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto">
              The modern way for restaurants to showcase their cuisine. Update instantly, share everywhere, delight customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/signup">Start free trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/tonys-pizza">See live demo <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Grid - 4 Key Features */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Feature 1 */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chart-1/10 text-chart-1 mb-2">
              <RefreshCw className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Update in seconds</h3>
            <p className="text-muted-foreground">
              Prices changed? New dish? Update your menu instantly from any device. No reprinting, no delays.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chart-2/10 text-chart-2 mb-2">
              <QrCode className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Contactless & modern</h3>
            <p className="text-muted-foreground">
              Generate QR codes instantly. Customers scan and browse—no app downloads, no hassle.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chart-4/10 text-chart-4 mb-2">
              <Palette className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Professional design</h3>
            <p className="text-muted-foreground">
              Gorgeous menu layouts that work on any screen. Make your dishes look as good as they taste.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-chart-5/10 text-chart-5 mb-2">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Know what works</h3>
            <p className="text-muted-foreground">
              See which items get the most views. Understand customer behavior. Make data-driven menu decisions.
            </p>
          </div>
        </div>
      </div>

      {/* Product Showcase - Split Screen Demo */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              From dashboard to diner in seconds
            </h2>
            <p className="text-xl text-muted-foreground">
              Manage your entire menu from one powerful dashboard. Customers see a beautiful, mobile-optimized experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
            {/* Dashboard View */}
            <div className="space-y-6">
              <div className="inline-block">
                <Badge variant="secondary" className="text-sm px-4 py-2">You manage</Badge>
              </div>
              <div className="relative rounded-lg border-2 bg-background p-4 shadow-2xl">
                {/* TODO: Add screenshot of /dashboard/menu here
                    - Take screenshot of your menu management dashboard
                    - Annotate with floating badges: "Drag & drop", "Bulk upload", "Quick edit"
                    - Use Shots.so or Screely.com for professional browser mockup
                */}
                <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">
                    Dashboard Screenshot<br/>
                    <span className="text-sm">(/dashboard/menu)</span>
                  </p>
                </div>
                {/* Floating annotation badges */}
                <div className="absolute -top-3 right-12 hidden lg:block">
                  <Badge className="shadow-lg">Drag & drop</Badge>
                </div>
                <div className="absolute top-1/3 -right-3 hidden lg:block">
                  <Badge className="shadow-lg">Quick edit</Badge>
                </div>
              </div>
            </div>

            {/* Customer View */}
            <div className="space-y-6">
              <div className="inline-block">
                <Badge variant="secondary" className="text-sm px-4 py-2">They experience</Badge>
              </div>
              <div className="relative max-w-sm mx-auto">
                {/* Mobile device frame */}
                <div className="relative rounded-[2.5rem] border-8 border-foreground bg-background shadow-2xl overflow-hidden">
                  {/* TODO: Add screenshot of /tonys-pizza on mobile here
                      - Take mobile screenshot (use browser dev tools, 375px width)
                      - Or use Mockuphone.com for device mockup
                      - Annotate with: "Gorgeous design", "Fast loading", "Easy browsing"
                  */}
                  <div className="aspect-[9/19] bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground text-center px-4 text-sm">
                      Mobile Menu Screenshot<br/>
                      <span className="text-xs">(/tonys-pizza)</span>
                    </p>
                  </div>
                </div>
                {/* Floating annotation badges */}
                <div className="absolute -left-6 top-12 hidden lg:block">
                  <Badge className="shadow-lg">Gorgeous design</Badge>
                </div>
                <div className="absolute -right-6 top-1/2 hidden lg:block">
                  <Badge className="shadow-lg">Easy browsing</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Built for modern restaurants
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you're a cozy café or a bustling bistro, Catalog Studio adapts to your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Independent Restaurants */}
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <ChefHat className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Independent & family-owned</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Stand out with professional menus without the enterprise price tag. Perfect for restaurants that value quality and control.
              </p>
            </CardContent>
          </Card>

          {/* Cafés */}
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <Coffee className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Cafés & quick service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Seasonal specials? Daily soups? Update your offerings as fast as you create them. Keep customers in the loop.
              </p>
            </CardContent>
          </Card>

          {/* Fine Dining */}
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                <Utensils className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl">Upscale & fine dining</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">
                Elegant presentation meets modern convenience. Detailed descriptions, allergen info, wine pairings—all beautifully displayed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works - 3 Steps */}
      <div className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              Get online in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                01
              </div>
              <UserPlus className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">Sign up free</h3>
              <p className="text-muted-foreground">
                Create your account and restaurant profile in under 2 minutes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                02
              </div>
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">Add your menu</h3>
              <p className="text-muted-foreground">
                Type it in, upload CSV, or import from existing files. Your choice.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                03
              </div>
              <Share2 className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-bold">Share & shine</h3>
              <p className="text-muted-foreground">
                Get your QR code, share your link, watch customers engage.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Examples Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            See it in action
          </h2>
          <p className="text-xl text-muted-foreground">
            Real menus from real restaurants using Catalog Studio
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {sampleRestaurants.map((restaurant) => (
            <Link key={restaurant.slug} href={`/${restaurant.slug}`} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-xl group-hover:scale-[1.03] border-2">
                <CardHeader className="space-y-4">
                  {/* TODO: Add restaurant logo/image placeholder here
                      - Use abstract shapes or initials for demo
                      - Or actual restaurant photos from Unsplash
                  */}
                  <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">
                        {restaurant.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                      <Badge variant="secondary">{restaurant.cuisine}</Badge>
                    </div>
                    <CardDescription className="text-base">
                      {restaurant.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    View live menu <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-4/10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Ready to modernize your menu?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join restaurants making the switch to digital. Start free, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/signup">Start your free trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                <Link href="/contact">Contact sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
