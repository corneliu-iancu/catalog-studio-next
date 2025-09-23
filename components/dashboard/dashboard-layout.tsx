'use client';

import { useState } from 'react';
import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
import { CreateRestaurantDialog } from './create-restaurant-dialog';
import { RestaurantProvider } from '@/lib/contexts/restaurant-context';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user?: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);

  const handleCreateRestaurant = () => {
    setShowCreateRestaurant(true);
  };

  return (
    <RestaurantProvider>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <DashboardHeader 
          user={user} 
          onCreateRestaurant={handleCreateRestaurant}
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
        onOpenChange={setShowCreateRestaurant}
      />
    </RestaurantProvider>
  );
}
