import * as React from "react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
// import { Badge } from "@/app/components/ui/badge"

export function ThemeShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Theme System Showcase</h2>
        <p className="text-muted-foreground mb-6">
          This demonstrates the complete design system with restaurant-themed colors and components.
        </p>
      </div>

      {/* Color Palette */}
      <Card className="food-card">
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>Restaurant-themed color scheme</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-16 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-medium">
              Primary
            </div>
            <p className="text-xs text-center text-muted-foreground">Warm Orange</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg bg-success flex items-center justify-center text-success-foreground font-medium">
              Success
            </div>
            <p className="text-xs text-center text-muted-foreground">Fresh Green</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg bg-warning flex items-center justify-center text-warning-foreground font-medium">
              Warning
            </div>
            <p className="text-xs text-center text-muted-foreground">Golden Yellow</p>
          </div>
          <div className="space-y-2">
            <div className="h-16 rounded-lg bg-destructive flex items-center justify-center text-destructive-foreground font-medium">
              Destructive
            </div>
            <p className="text-xs text-center text-muted-foreground">Alert Red</p>
          </div>
        </CardContent>
      </Card>

      {/* Button Variants */}
      <Card className="food-card">
        <CardHeader>
          <CardTitle>Button Variants</CardTitle>
          <CardDescription>All available button styles</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </CardContent>
      </Card>

      {/* Cards with Food Theme */}
      <Card className="food-card">
        <CardHeader>
          <CardTitle>Food Card Examples</CardTitle>
          <CardDescription>Specialized cards for restaurant content</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="food-card">
            <CardContent className="p-4">
              <div className="restaurant-gradient h-32 rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">Featured Dish</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Delicious restaurant special with our signature sauce
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">$24.99</span>
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs font-medium">Popular</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="food-card">
            <CardContent className="p-4">
              <div className="bg-success/20 h-32 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-success font-medium">Vegetarian</span>
              </div>
              <h3 className="font-semibold mb-2">Garden Special</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Fresh vegetables and herbs from our garden
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-success">$18.99</span>
                <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">Healthy</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="food-card">
            <CardContent className="p-4">
              <div className="bg-warning/20 h-32 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-warning font-medium">Spicy</span>
              </div>
              <h3 className="font-semibold mb-2">Fire Bowl</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our spiciest dish - not for the faint of heart!
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-warning">$22.99</span>
                <span className="bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-medium">Hot</span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Interactive Elements */}
      <Card className="food-card">
        <CardHeader>
          <CardTitle>Interactive Elements</CardTitle>
          <CardDescription>Hover and focus states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-16 food-card">Hover Me</Button>
            <div className="food-card p-4 cursor-pointer transition-all hover:scale-105">
              <p className="text-sm font-medium">Hover Card</p>
            </div>
            <div className="h-16 flex items-center justify-center text-base bg-success text-success-foreground rounded-lg font-medium">
              Success Badge
            </div>
            <div className="h-16 rounded-lg border-2 border-primary/20 hover:border-primary transition-colors flex items-center justify-center">
              Hover Border
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
