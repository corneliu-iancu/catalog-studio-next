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

          <div>
            <label htmlFor="slug">URL Slug</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              defaultValue={profileData.slug}
              required 
            />
            <small>Your menu will be available at: yoursite.com/{profileData.slug}</small>
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              defaultValue={profileData.description}
            ></textarea>
          </div>

          <div>
            <label htmlFor="cuisine">Cuisine Type</label>
            <select id="cuisine" name="cuisine" defaultValue={profileData.cuisine}>
              <option value="">Select cuisine type</option>
              <option value="italian">Italian</option>
              <option value="american">American</option>
              <option value="mexican">Mexican</option>
              <option value="asian">Asian</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="other">Other</option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>Contact Information</legend>
          
          <div>
            <label htmlFor="ownerName">Owner/Manager Name</label>
            <input 
              type="text" 
              id="ownerName" 
              name="ownerName" 
              defaultValue={profileData.ownerName}
              required 
            />
          </div>

          <div>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              defaultValue={profileData.email}
              required 
            />
          </div>

          <div>
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              defaultValue={profileData.phone}
            />
          </div>

          <div>
            <label htmlFor="address">Address</label>
            <textarea 
              id="address" 
              name="address" 
              rows={2}
              defaultValue={profileData.address}
            ></textarea>
          </div>

          <div>
            <label htmlFor="website">Website (optional)</label>
            <input 
              type="url" 
              id="website" 
              name="website" 
              defaultValue={profileData.website}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Business Hours</legend>
          
          <div>
            <label htmlFor="monday">Monday</label>
            <input type="text" id="monday" name="monday" defaultValue={profileData.hours.monday} />
          </div>
          <div>
            <label htmlFor="tuesday">Tuesday</label>
            <input type="text" id="tuesday" name="tuesday" defaultValue={profileData.hours.tuesday} />
          </div>
          <div>
            <label htmlFor="wednesday">Wednesday</label>
            <input type="text" id="wednesday" name="wednesday" defaultValue={profileData.hours.wednesday} />
          </div>
          <div>
            <label htmlFor="thursday">Thursday</label>
            <input type="text" id="thursday" name="thursday" defaultValue={profileData.hours.thursday} />
          </div>
          <div>
            <label htmlFor="friday">Friday</label>
            <input type="text" id="friday" name="friday" defaultValue={profileData.hours.friday} />
          </div>
          <div>
            <label htmlFor="saturday">Saturday</label>
            <input type="text" id="saturday" name="saturday" defaultValue={profileData.hours.saturday} />
          </div>
          <div>
            <label htmlFor="sunday">Sunday</label>
            <input type="text" id="sunday" name="sunday" defaultValue={profileData.hours.sunday} />
          </div>
        </fieldset>

        <div>
          <button type="submit">Save Changes</button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export const metadata = {
  title: 'Restaurant Profile - Dashboard',
  description: 'Manage your restaurant profile information and settings.',
};
