'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  UtensilsCrossed,
  Save,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getCurrentDomain } from '@/lib/config';
import { toast } from 'sonner';

function RestaurantProfileContent() {
  const { selectedRestaurant, isLoading, refreshRestaurants } = useRestaurant();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cuisine: '',
    owner_name: '',
    email: '',
    phone: '',
    website: '',
    address: ''
  });

  useEffect(() => {
    if (selectedRestaurant) {
      setFormData({
        name: selectedRestaurant.name || '',
        slug: selectedRestaurant.slug || '',
        description: selectedRestaurant.description || '',
        cuisine: selectedRestaurant.cuisine || '',
        owner_name: selectedRestaurant.owner_name || '',
        email: selectedRestaurant.email || '',
        phone: selectedRestaurant.phone || '',
        website: selectedRestaurant.website || '',
        address: selectedRestaurant.address || ''
      });
    }
  }, [selectedRestaurant]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedRestaurant) return;

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('restaurants')
        .update(formData)
        .eq('id', selectedRestaurant.id)
        .select()
        .single();

      if (error) throw error;

      toast.success('Restaurant profile updated successfully');
      setIsEditing(false);
      
      // Update the restaurant context with the new data
      if (refreshRestaurants) {
        await refreshRestaurants();
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error('Failed to update restaurant profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (selectedRestaurant) {
      setFormData({
        name: selectedRestaurant.name || '',
        slug: selectedRestaurant.slug || '',
        description: selectedRestaurant.description || '',
        cuisine: selectedRestaurant.cuisine || '',
        owner_name: selectedRestaurant.owner_name || '',
        email: selectedRestaurant.email || '',
        phone: selectedRestaurant.phone || '',
        website: selectedRestaurant.website || '',
        address: selectedRestaurant.address || ''
      });
    }
    setIsEditing(false);
  };

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
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
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
              <Label className="text-sm font-medium text-muted-foreground">Restaurant Name</Label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter restaurant name"
                />
              ) : (
                <p className="text-lg font-semibold">{selectedRestaurant.name}</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">URL Slug</Label>
              {isEditing ? (
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="Enter URL slug"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-sm">{getCurrentDomain()}/{selectedRestaurant.slug}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/${selectedRestaurant.slug}`, '_blank')}
                    title="Open restaurant page in new tab"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              {isEditing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter restaurant description"
                  rows={3}
                />
              ) : (
                <p className="text-sm">
                  {selectedRestaurant.description || 'No description provided'}
                </p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Cuisine Type</Label>
              {isEditing ? (
                <Input
                  value={formData.cuisine}
                  onChange={(e) => handleInputChange('cuisine', e.target.value)}
                  placeholder="Enter cuisine type"
                />
              ) : (
                <div className="mt-1">
                  <Badge variant="secondary" className="flex items-center w-fit">
                    <UtensilsCrossed className="mr-1 h-3 w-3" />
                    {formatCuisineType(selectedRestaurant.cuisine)}
                  </Badge>
                </div>
              )}
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
              <Label className="text-sm font-medium text-muted-foreground">Owner Name</Label>
              {isEditing ? (
                <Input
                  value={formData.owner_name}
                  onChange={(e) => handleInputChange('owner_name', e.target.value)}
                  placeholder="Enter owner name"
                />
              ) : (
                <p className="font-medium">{selectedRestaurant.owner_name}</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{selectedRestaurant.email}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{selectedRestaurant.phone || 'Not provided'}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Website</Label>
              {isEditing ? (
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="Enter website URL"
                />
              ) : (
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
              )}
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
              <Label className="text-sm font-medium text-muted-foreground">Address</Label>
              {isEditing ? (
                <Textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter full address"
                  rows={3}
                />
              ) : (
                <p className="text-sm mt-1">
                  {selectedRestaurant.address || 'No address provided'}
                </p>
              )}
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
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
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