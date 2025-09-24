'use client';

import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
import { CreateRestaurantDialog } from './create-restaurant-dialog';
import { RestaurantProvider } from '@/lib/contexts/restaurant-context';
import { MenuProvider } from '@/lib/contexts/menu-context';
import { ItemsProvider } from '@/lib/contexts/items-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
  showCreateRestaurant?: boolean;
  onCreateRestaurant?: () => void;
  onCloseCreateRestaurant?: () => void;
}

export function DashboardLayout({
  children,
  user,
  showCreateRestaurant = false,
  onCreateRestaurant,
  onCloseCreateRestaurant
}: DashboardLayoutProps) {

  return (
    <RestaurantProvider>
      <MenuProvider>
        <ItemsProvider>
          <div className="h-screen flex flex-col">
          {/* Header */}
          <DashboardHeader
            user={user}
            onCreateRestaurant={onCreateRestaurant}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background">
              <div className="h-full">
                {children}
              </div>
            </main>
          </div>
          </div>

          {/* Create Restaurant Dialog */}
          <CreateRestaurantDialog
            open={showCreateRestaurant}
            onOpenChange={onCloseCreateRestaurant || (() => {})}
          />
        </ItemsProvider>
      </MenuProvider>
    </RestaurantProvider>
  );
}
