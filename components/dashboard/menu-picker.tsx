'use client';

import { Check, ChevronDown, ChefHat, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useMenu } from '@/lib/contexts/menu-context';

export function MenuPicker() {
  const { menus, selectedMenu, selectMenu, isLoading } = useMenu();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <ChefHat className="h-4 w-4 text-muted-foreground" />
        <div className="h-4 w-24 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (menus.length === 0) {
    return null; // Don't show picker if no menus
  }

  if (menus.length === 1) {
    // Show single menu without dropdown
    const menu = menus[0];
    return (
      <div className="flex items-center space-x-2">
        <ChefHat className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center space-x-2">
          <span className="font-medium">{menu.name}</span>
          <div className="flex items-center space-x-1">
            {menu.is_default && (
              <Badge variant="outline" className="text-xs">
                Default
              </Badge>
            )}
            {!menu.is_active && (
              <Badge variant="secondary" className="text-xs">
                Inactive
              </Badge>
            )}
            {(menu.active_from || menu.active_to) && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Scheduled
              </Badge>
            )}
            {(menu.start_date || menu.end_date) && (
              <Badge variant="outline" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Seasonal
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 h-auto p-2">
          <ChefHat className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center space-x-2">
            <span className="font-medium">
              {selectedMenu?.name || 'Select Menu'}
            </span>
            <div className="flex items-center space-x-1">
              {selectedMenu?.is_default && (
                <Badge variant="outline" className="text-xs">
                  Default
                </Badge>
              )}
              {selectedMenu && !selectedMenu.is_active && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
              {selectedMenu && (selectedMenu.active_from || selectedMenu.active_to) && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Scheduled
                </Badge>
              )}
              {selectedMenu && (selectedMenu.start_date || selectedMenu.end_date) && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Seasonal
                </Badge>
              )}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel>Select Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menus.map((menu) => (
          <DropdownMenuItem
            key={menu.id}
            onClick={() => selectMenu(menu)}
            className="flex items-center justify-between p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {selectedMenu?.id === menu.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{menu.name}</span>
                  {menu.description && (
                    <span className="text-xs text-muted-foreground">
                      {menu.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {menu.is_default && (
                <Badge variant="outline" className="text-xs">
                  Default
                </Badge>
              )}
              {!menu.is_active && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
              {(menu.active_from || menu.active_to) && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Scheduled
                </Badge>
              )}
              {(menu.start_date || menu.end_date) && (
                <Badge variant="outline" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Seasonal
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
