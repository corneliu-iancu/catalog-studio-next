'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Store, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  ExternalLink,
  User,
  UtensilsCrossed
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

function RestaurantProfileContent() {
  const { selectedRestaurant, isLoading } = useRestaurant();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading restaurant profile...</p>
        </div>
      </div>
    );
  }

  if (!selectedRestaurant) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <Store className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-lg font-semibold">No Restaurant Selected</h2>
            <p className="text-muted-foreground">Please select a restaurant to view its profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCuisineType = (cuisine: string | null) => {
    if (!cuisine) return 'Not specified';
    return cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Restaurant Profile</h1>
          <p className="text-muted-foreground">
            Manage your restaurant information and settings
          </p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Core details about your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Restaurant Name</label>
              <p className="text-lg font-semibold">{selectedRestaurant.name}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">URL Slug</label>
              <div className="flex items-center space-x-2">
                <p className="font-mono text-sm">catalogstudio.com/{selectedRestaurant.slug}</p>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm">
                {selectedRestaurant.description || 'No description provided'}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cuisine Type</label>
              <div className="mt-1">
                <Badge variant="secondary" className="flex items-center w-fit">
                  <UtensilsCrossed className="mr-1 h-3 w-3" />
                  {formatCuisineType(selectedRestaurant.cuisine)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              How customers can reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Owner Name</label>
              <p className="font-medium">{selectedRestaurant.owner_name}</p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{selectedRestaurant.email}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{selectedRestaurant.phone || 'Not provided'}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Website</label>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {selectedRestaurant.website ? (
                  <a 
                    href={selectedRestaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {selectedRestaurant.website}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Not provided</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" />
              Location
            </CardTitle>
            <CardDescription>
              Where customers can find you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="text-sm mt-1">
                {selectedRestaurant.address || 'No address provided'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Restaurant account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <p className="text-sm">
                {new Date(selectedRestaurant.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
              <p className="text-sm">
                {new Date(selectedRestaurant.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <Separator />
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                <Badge variant={selectedRestaurant.is_active ? "default" : "secondary"}>
                  {selectedRestaurant.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for managing your restaurant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Basic Info
            </Button>
            <Button variant="outline" size="sm">
              <MapPin className="mr-2 h-4 w-4" />
              Update Location
            </Button>
            <Button variant="outline" size="sm">
              <Globe className="mr-2 h-4 w-4" />
              Customize Theme
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RestaurantPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <RestaurantProfileContent />
    </DashboardLayout>
  );
}
