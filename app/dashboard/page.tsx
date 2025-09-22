'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      // Check if user has a restaurant
      const { data: restaurantData } = await supabase
        .from('restaurants')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setRestaurant(restaurantData);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/auth/signin');
      router.refresh();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user doesn't have a restaurant, show setup page
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome to Catalog Studio</h1>
                <p className="mt-1 text-sm text-gray-600">Let's set up your restaurant profile</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user?.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Create Your Restaurant Profile</h2>
              <p className="mt-2 text-gray-600">You'll need to set up your restaurant before you can start managing your menu.</p>
            </div>

            <div className="text-center">
              <Link
                href="/dashboard/setup"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Set Up Restaurant Profile
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">Welcome back! Here's an overview of your restaurant.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Restaurant Overview */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Restaurant Overview</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">URL: /{restaurant.slug}</p>
                    <p className="text-sm text-gray-600">Last updated: {new Date(restaurant.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-gray-600">Menu Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-gray-600">Recent Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Link
                  href="/dashboard/menu/items/new"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Add New Menu Item
                </Link>
                <Link
                  href="/dashboard/menu/categories/new"
                  className="bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Add New Category
                </Link>
                <Link
                  href="/dashboard/menu"
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Manage Menu
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-lg text-center text-sm font-medium transition-colors"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <p className="text-sm font-medium text-gray-900">Added "Margherita Pizza" to Main Courses</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <p className="text-sm font-medium text-gray-900">Updated pricing for "Caesar Salad"</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <p className="text-sm font-medium text-gray-900">Created new category "Desserts"</p>
                  <p className="text-xs text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Public Menu</h2>
              <p>
                <Link
                  href={`/${restaurant.slug}`}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  View your public menu →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
