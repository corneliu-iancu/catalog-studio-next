'use client';

import { useState } from 'react';
import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
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

      {/* Create Restaurant Modal/Dialog - TODO: Implement */}
      {showCreateRestaurant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4">Create Restaurant</h2>
            <p className="text-muted-foreground mb-4">
              Restaurant creation form will be implemented here.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateRestaurant(false)}
                className="px-4 py-2 text-sm border rounded hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateRestaurant(false)}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </RestaurantProvider>
  );
}
