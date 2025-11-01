import { ReactNode } from 'react';
import { menuShowcaseService } from '@/lib/services/menu-showcase';

interface MerchantLayoutProps {
  children: ReactNode;
  params: Promise<{
    merchant: string;
  }>;
}

export default async function MerchantLayout({ 
  children,
  params 
}: MerchantLayoutProps) {
  const { merchant } = await params;
  
  // Fetch menu data to get the template type
  const menuData = await menuShowcaseService.getPublicMenuData(merchant);
  const template = menuData?.display_settings?.template || 'classic';

  return (
    <div data-template={template} className="template-layout">
      {children}
    </div>
  );
}

