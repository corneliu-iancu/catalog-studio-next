import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            About Catalog Studio
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering restaurants with modern menu management and showcase solutions
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Catalog Studio is designed to help restaurants of all sizes create, manage, and showcase their menus online.
                We believe every restaurant deserves a professional digital presence that reflects the quality of their food and service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">What We Offer</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">For Restaurants</CardTitle>
                <CardDescription>
                  Powerful tools to manage and showcase your menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Easy-to-use menu management dashboard</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Professional menu presentation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Custom restaurant URLs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Menu analytics and insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Mobile-responsive design</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">For Customers</CardTitle>
                <CardDescription>
                  Enhanced dining discovery and menu browsing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Browse restaurant menus online</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>View detailed product information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>See ingredients and allergen information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Access nutritional details</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span>Discover new restaurants</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Why Choose Catalog Studio?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Simple Setup</h3>
                  <p className="text-muted-foreground">Get your restaurant online in minutes</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Professional Design</h3>
                  <p className="text-muted-foreground">Beautiful, mobile-friendly menu displays</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Easy Management</h3>
                  <p className="text-muted-foreground">Update your menu anytime, anywhere</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Customer Focus</h3>
                  <p className="text-muted-foreground">Help customers discover and explore your offerings</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Affordable</h3>
                  <p className="text-muted-foreground">Pricing that works for restaurants of all sizes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Getting Started Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground mb-6">
                {`Ready to showcase your restaurant's menu online? Start building your digital menu presence today.`}
              </p>
              <Button asChild size="lg">
                <Link href="/auth/signup">Sign Up Today</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-16 border-t">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
              <CardDescription>
                {`Have questions or need support? We're here to help!`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">Email:</span>
                  <span className="text-muted-foreground">support@catalogstudio.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">Phone:</span>
                  <span className="text-muted-foreground">1-800-CATALOG</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-medium">Business Hours:</span>
                  <span className="text-muted-foreground">Monday-Friday, 9 AM - 6 PM EST</span>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" asChild>
                  <Link href="/contact">Contact Form</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'About Us - Catalog Studio',
  description: 'Learn about Catalog Studio, the restaurant menu management and showcase platform.',
};
