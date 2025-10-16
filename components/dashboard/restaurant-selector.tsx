'use client';

import { useState } from 'react';
import { Check, ChevronDown, Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { Database } from '@/lib/types/database';
import { useRouter } from 'next/navigation';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

interface RestaurantSelectorProps {
  // No props needed - using router navigation
}

export function RestaurantSelector({}: RestaurantSelectorProps) {
  const { restaurants, selectedRestaurant, selectRestaurant, isLoading } = useRestaurant();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    selectRestaurant(restaurant);
    setOpen(false);
  };

  const handleCreateRestaurant = () => {
    setOpen(false);
    router.push('/dashboard/restaurant/new');
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <Button
        onClick={handleCreateRestaurant}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Create Restaurant</span>
      </Button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
              <Store className="h-3 w-3" />
            </div>
            <span className="truncate">
              {selectedRestaurant?.name || 'Select restaurant...'}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px]" align="start">
        <DropdownMenuLabel>Your Restaurants</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {restaurants.map((restaurant) => (
          <DropdownMenuItem
            key={restaurant.id}
            onSelect={() => handleSelectRestaurant(restaurant)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-3 w-3" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{restaurant.name}</span>
                {restaurant.cuisine && (
                  <span className="text-xs text-muted-foreground capitalize">
                    {restaurant.cuisine.replace('-', ' ')}
                  </span>
                )}
              </div>
            </div>
            {selectedRestaurant?.id === restaurant.id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleCreateRestaurant}>
          <Plus className="mr-2 h-4 w-4" />
          <span>Create New Restaurant</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
