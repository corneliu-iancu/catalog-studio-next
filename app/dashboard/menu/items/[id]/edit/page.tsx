'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function EditItemRedirectContent() {
  const params = useParams();
  const router = useRouter();
  const itemId = params.id as string;
  const supabase = createClient();

  // Redirect to category-specific edit route
  useEffect(() => {
    const redirectToCategoryEdit = async () => {
      if (!itemId) return;
      
      try {
        // Fetch the item's first category to redirect to new route
        const { data: categoryData, error: categoryError } = await supabase
          .from('category_products')
          .select(`
            category_id,
            categories!inner (
              id,
              name
            )
          `)
          .eq('product_id', itemId)
          .limit(1);

        if (categoryError) throw categoryError;

        if (categoryData && categoryData.length > 0) {
          const categoryId = categoryData[0].category_id;
          // Redirect to the new category-specific edit route
          router.replace(`/dashboard/menu/categories/${categoryId}/items/${itemId}/edit`);
          return;
        }

        // If no category found, redirect to menu
        toast.error('Item not found or not associated with any category');
        router.push('/dashboard/menu');
        
      } catch (error) {
        console.error('Error fetching item category:', error);
        toast.error('Failed to load item details');
        router.push('/dashboard/menu');
      }
    };

    redirectToCategoryEdit();
  }, [itemId, supabase, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span>Redirecting to edit page...</span>
      </div>
    </div>
  );
}

export default function EditItemRedirectPage() {
  return (
    <DashboardLayout>
      <EditItemRedirectContent />
    </DashboardLayout>
  );
}