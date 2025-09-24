import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Search, Store } from 'lucide-react';

export default function RestaurantNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Store className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl">Restaurant Not Found</CardTitle>
            <CardDescription>
              The restaurant you&apos;re looking for doesn&apos;t exist or may have been removed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-600">
              <p>This could happen if:</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• The restaurant URL was typed incorrectly</li>
                <li>• The restaurant is no longer active</li>
                <li>• The restaurant hasn&apos;t set up their menu yet</li>
              </ul>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="w-full">
                <Link href="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Search Restaurants
                </Link>
              </Button>
            </div>
            
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-500">
                Are you a restaurant owner?{' '}
                <Link href="/auth/signup" className="text-blue-600 hover:underline">
                  Create your menu
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
