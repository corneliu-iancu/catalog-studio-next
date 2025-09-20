import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { 
  FileTextIcon, 
  MixerHorizontalIcon, 
  MobileIcon,
  EyeOpenIcon,
  ArrowRightIcon,
  CheckIcon
} from "@radix-ui/react-icons"

export default async function Home() {
  const session = await auth()

  // If user is authenticated, redirect to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 restaurant-gradient opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 animate-in fade-in-up duration-1000">
              Beautiful menus.
              <br />
              <span className="gradient-text">
                Effortless management.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed animate-in fade-in-up duration-1000 delay-200">
              Transform your restaurant's menu experience with our intuitive digital platform. 
              Create, organize, and showcase your culinary offerings like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in-up duration-1000 delay-300">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 apple-hover"
              >
                <Link href="/auth/signin" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="ghost" 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full hover:bg-muted/50 apple-hover"
              >
                <Link href="/showcase">
                  View Demo
                </Link>
              </Button>
            </div>
            
            {/* Demo Credentials */}
            <div className="mt-12 p-6 glass-effect rounded-2xl border inline-block animate-in scale-in duration-1000 delay-500">
              <p className="text-sm text-muted-foreground mb-3">Try it now with our demo account:</p>
              <div className="flex flex-col sm:flex-row gap-4 text-sm font-mono">
                <span className="bg-background/80 px-3 py-1 rounded-lg backdrop-blur-sm border">admin@restaurant.com</span>
                <span className="bg-background/80 px-3 py-1 rounded-lg backdrop-blur-sm border">password123</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed specifically for restaurants, cafes, and food businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto rounded-3xl restaurant-gradient flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <FileTextIcon className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Menu Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Effortlessly add, edit, and organize your menu items with our intuitive interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <MixerHorizontalIcon className="h-8 w-8 text-success-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Smart Organization</h3>
              <p className="text-muted-foreground leading-relaxed">
                Organize dishes into categories and create logical menu structures your customers love.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-warning to-warning/80 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <MobileIcon className="h-8 w-8 text-warning-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Mobile Ready</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful, responsive design that works flawlessly on all devices and screen sizes.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/80 to-destructive/60 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <EyeOpenIcon className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Public Display</h3>
              <p className="text-muted-foreground leading-relaxed">
                Showcase your menu with elegant public pages that convert browsers into customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                Why restaurants choose Menu Studio
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckIcon className="h-3 w-3 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Simple & Intuitive</h3>
                    <p className="text-muted-foreground">No technical knowledge required. Get your menu online in minutes, not hours.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckIcon className="h-3 w-3 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Professional Design</h3>
                    <p className="text-muted-foreground">Beautiful, modern templates that make your food look as good as it tastes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckIcon className="h-3 w-3 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Always Up-to-Date</h3>
                    <p className="text-muted-foreground">Update prices and availability instantly. Your customers always see current information.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckIcon className="h-3 w-3 text-success-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Customer Focused</h3>
                    <p className="text-muted-foreground">Fast loading, easy navigation, and beautiful presentation that customers love.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl restaurant-gradient p-1 shadow-2xl apple-hover">
                <div className="w-full h-full rounded-3xl bg-background p-8 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto rounded-2xl restaurant-gradient flex items-center justify-center shadow-lg mb-6 animate-pulse">
                      <FileTextIcon className="h-10 w-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">Menu Studio</h3>
                    <p className="text-muted-foreground">
                      The future of restaurant menu management
                    </p>
                  </div>
                </div>
              </div>
              {/* Floating elements for visual interest */}
              <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-primary/20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 rounded-full bg-success/10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Ready to transform your menu?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join restaurants worldwide who trust Menu Studio to showcase their culinary creations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/auth/signin" className="flex items-center gap-2">
                Start Your Free Trial
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-10 py-6 rounded-full border-2 hover:bg-muted/50"
            >
              <Link href="/showcase">
                Explore Features
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
