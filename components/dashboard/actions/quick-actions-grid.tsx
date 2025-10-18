'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Store, UtensilsCrossed, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { useMenu } from '@/lib/contexts/menu-context';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  disabled?: boolean;
}

function QuickActionCard({ title, description, icon: Icon, onClick, disabled }: QuickActionCardProps) {
  return (
    <Card 
      className={`h-24 transition-all cursor-pointer ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:shadow-md hover:scale-[1.02]'
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-4 h-full">
        <div className="flex items-center space-x-3 h-full">
          <div className="flex-shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium truncate">{title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsGrid() {
  const router = useRouter();
  const { selectedRestaurant } = useRestaurant();
  const { selectedMenu } = useMenu();
  const t = useTranslations('dashboard.quickActions');
  
  const hasRestaurantAndMenu = selectedRestaurant && selectedMenu;

  const actions = [
    {
      title: t('addMenuItem'),
      description: t('addMenuItemDesc'),
      icon: Plus,
      onClick: () => router.push('/dashboard/menu/items/new'),
      disabled: !hasRestaurantAndMenu,
    },
    {
      title: t('addCategory'),
      description: t('addCategoryDesc'),
      icon: Store,
      onClick: () => router.push('/dashboard/menu/categories/new'),
      disabled: !hasRestaurantAndMenu,
    },
    {
      title: t('manageMenu'),
      description: t('manageMenuDesc'),
      icon: UtensilsCrossed,
      onClick: () => router.push('/dashboard/menu'),
      disabled: !hasRestaurantAndMenu,
    },
    {
      title: t('viewPublicMenu'),
      description: t('viewPublicMenuDesc'),
      icon: ExternalLink,
      onClick: () => {
        if (selectedRestaurant?.slug) {
          window.open(`/menu/${selectedRestaurant.slug}`, '_blank');
        }
      },
      disabled: !selectedRestaurant?.slug,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <QuickActionCard
          key={action.title}
          title={action.title}
          description={action.description}
          icon={action.icon}
          onClick={action.onClick}
          disabled={action.disabled}
        />
      ))}
    </div>
  );
}
