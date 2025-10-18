'use client';

import { Plus, Store, UtensilsCrossed, Palette, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

// No props needed - using router navigation
type EmptyStateProps = Record<string, never>;

const features = [
  {
    icon: Store,
    title: 'Restaurant Profile',
    description: 'Set up your restaurant information, hours, and contact details',
  },
  {
    icon: UtensilsCrossed,
    title: 'Menu Management',
    description: 'Create categories and add your delicious menu items with photos',
  },
  {
    icon: Palette,
    title: 'Customization',
    description: 'Customize colors, themes, and layout to match your brand',
  },
  {
    icon: QrCode,
    title: 'Sharing & QR Codes',
    description: 'Generate QR codes and shareable links for your digital menu',
  },
];

export function EmptyState({}: EmptyStateProps) {
  const router = useRouter();

  const handleCreateRestaurant = () => {
    router.push('/dashboard/restaurant/new');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
            <Store className="h-12 w-12 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome to Catalog Studio!
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Create your first restaurant to start building your beautiful digital menu catalog.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Button
            onClick={handleCreateRestaurant}
            size="lg"
            className="h-12 px-8 text-base"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Your First Restaurant
          </Button>
        </div>

        {/* Features Preview */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">What you can do with Catalog Studio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="text-left opacity-75">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>
            ✨ <strong>Multi-restaurant support:</strong> You can create and manage multiple restaurants from one account
          </p>
          <p>
            🎨 <strong>Beautiful themes:</strong> Choose from professionally designed templates
          </p>
          <p>
            📱 <strong>Mobile-first:</strong> Your menus look perfect on any device
          </p>
        </div>
      </div>
    </div>
  );
}
