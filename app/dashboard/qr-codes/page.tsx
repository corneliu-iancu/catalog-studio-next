'use client';

import { useState, useEffect } from 'react';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MenuQRCode } from '@/components/dashboard/menu-qr-code';
import { ChefHat, QrCode } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Menu = Database['public']['Tables']['menus']['Row'];

function QRCodesContent() {
  const { selectedRestaurant } = useRestaurant();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (selectedRestaurant) {
      fetchMenus();
    } else {
      setMenus([]);
      setIsLoading(false);
    }
  }, [selectedRestaurant]);

  const fetchMenus = async () => {
    if (!selectedRestaurant) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('restaurant_id', selectedRestaurant.id)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMenus(data || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedRestaurant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <QrCode className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h3 className="text-lg font-semibold">No Restaurant Selected</h3>
            <p className="text-muted-foreground">Please select a restaurant to view QR codes.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading QR codes...</p>
        </div>
      </div>
    );
  }

  if (menus.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QR Codes</h1>
            <p className="text-muted-foreground">Generate and download QR codes for your menus</p>
          </div>
        </div>

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
            <div className="rounded-full bg-muted p-6">
              <ChefHat className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No Menus Available</h3>
              <p className="text-muted-foreground max-w-md">
                Create a menu first to generate QR codes for it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">QR Codes</h1>
          <p className="text-muted-foreground">
            Generate and download QR codes for your menus
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
              <QrCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                About QR Codes
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Each menu has its own QR code that customers can scan to view your digital menu.
                Download standard resolution for digital sharing or high resolution for printing on physical materials.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Codes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {menus.map((menu) => (
          <div key={menu.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{menu.name}</h3>
              <div className="flex gap-1">
                {menu.is_default && (
                  <Badge variant="default" className="text-xs">Default</Badge>
                )}
                <Badge variant={menu.is_active ? "default" : "secondary"} className="text-xs">
                  {menu.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            {menu.description && (
              <p className="text-sm text-muted-foreground">{menu.description}</p>
            )}
            <MenuQRCode 
              restaurantSlug={selectedRestaurant.slug}
              menuSlug={menu.slug}
              menuName={menu.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function QRCodesPage() {
  const [user, setUser] = useState<User | null>(null);
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
      <div className="p-6">
        <QRCodesContent />
      </div>
    </DashboardLayout>
  );
}
