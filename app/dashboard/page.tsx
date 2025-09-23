'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EmptyState } from '@/components/dashboard/empty-state';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart3,
  Eye,
  Plus,
  Store,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function DashboardContent() {
  const { selectedRestaurant, hasRestaurants, isLoading } = useRestaurant();
  const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hasRestaurants) {
    return <EmptyState onCreateRestaurant={() => setShowCreateRestaurant(true)} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of {selectedRestaurant?.name}.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menu Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              +0 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedRestaurant?.created_at
                ? new Date(selectedRestaurant.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Restaurant created
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Create a new dish for your menu
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <Store className="mr-2 h-4 w-4" />
              Add Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Organize your menu with categories
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <UtensilsCrossed className="mr-2 h-4 w-4" />
              Manage Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Edit existing items and categories
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Public Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              See how customers view your menu
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Restaurant Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Overview</CardTitle>
            <CardDescription>
              Basic information about your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-semibold">{selectedRestaurant?.name}</h3>
              <p className="text-sm text-muted-foreground">
                URL: /{selectedRestaurant?.slug}
              </p>
              <p className="text-sm text-muted-foreground">
                Last updated: {selectedRestaurant?.updated_at
                  ? new Date(selectedRestaurant.updated_at).toLocaleDateString()
                  : 'N/A'
                }
              </p>
            </div>
            <div className="pt-2">
              <Button variant="outline" size="sm">
                <Store className="mr-2 h-4 w-4" />
                Edit Restaurant Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes to your restaurant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Restaurant created</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRestaurant?.created_at
                      ? new Date(selectedRestaurant.created_at).toLocaleDateString()
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Start adding menu items to see more activity here.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
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
      <DashboardContent />
    </DashboardLayout>
  );
}
