'use client';

import { useState } from 'react';
import { DashboardHeader } from './dashboard-header';
import { DashboardSidebar } from './dashboard-sidebar';
import { RestaurantProvider } from '@/lib/contexts/restaurant-context';
import { MenuProvider } from '@/lib/contexts/menu-context';
import { ItemsProvider } from '@/lib/contexts/items-context';
import type { User } from '@supabase/supabase-js';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User | null;
}

export function DashboardLayout({
  children,
  user
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  // todo: bad code here. 
  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <RestaurantProvider>
      <MenuProvider>
        <ItemsProvider>
          <div className="min-h-screen flex flex-col">
          {/* Header */}
          <DashboardHeader
            user={user}
            onToggleSidebar={handleToggleSidebar}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
              isOpen={sidebarOpen}
              onClose={handleCloseSidebar}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-background">
              {children}
            </main>
          </div>
          </div>
        </ItemsProvider>
      </MenuProvider>
    </RestaurantProvider>
  );
}
