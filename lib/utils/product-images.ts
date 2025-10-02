import { createClient } from '@/lib/supabase/client';

/**
 * Helper functions for managing product images
 */

export interface ProductImage {
  id: string;
  product_id: string;
  s3_key: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
  width: number | null;
  height: number | null;
  created_at: string;
  updated_at: string;
}

/**
 * Get the primary image for a product
 */
export async function getPrimaryImage(productId: string): Promise<string | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('product_images')
    .select('s3_key')
    .eq('product_id', productId)
    .eq('is_primary', true)
    .maybeSingle();

  if (error) {
    console.error('Error fetching primary image:', error);
    return null;
  }

  return data?.s3_key || null;
}

/**
 * Get all images for a product, ordered by display_order
 */
export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching product images:', error);
    return [];
  }

  return data || [];
}

/**
 * Add an image to a product
 */
export async function addProductImage(
  productId: string,
  s3Key: string,
  options?: {
    altText?: string;
    isPrimary?: boolean;
    width?: number;
    height?: number;
  }
): Promise<ProductImage | null> {
  const supabase = createClient();

  // If setting as primary, unset other primary images first
  if (options?.isPrimary) {
    await supabase
      .from('product_images')
      .update({ is_primary: false })
      .eq('product_id', productId);
  }

  // Get next display order
  const { data: existing } = await supabase
    .from('product_images')
    .select('display_order')
    .eq('product_id', productId)
    .order('display_order', { ascending: false })
    .limit(1);

  const nextOrder = existing?.[0]?.display_order ? existing[0].display_order + 1 : 0;

  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      s3_key: s3Key,
      alt_text: options?.altText || null,
      is_primary: options?.isPrimary || false,
      display_order: nextOrder,
      width: options?.width || null,
      height: options?.height || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding product image:', error);
    return null;
  }

  return data;
}

/**
 * Update an image
 */
export async function updateProductImage(
  imageId: string,
  updates: {
    altText?: string;
    isPrimary?: boolean;
    displayOrder?: number;
  }
): Promise<boolean> {
  const supabase = createClient();

  // If setting as primary, get the product_id first to unset others
  if (updates.isPrimary) {
    const { data: image } = await supabase
      .from('product_images')
      .select('product_id')
      .eq('id', imageId)
      .single();

    if (image) {
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', image.product_id);
    }
  }

  const { error } = await supabase
    .from('product_images')
    .update({
      ...(updates.altText !== undefined && { alt_text: updates.altText }),
      ...(updates.isPrimary !== undefined && { is_primary: updates.isPrimary }),
      ...(updates.displayOrder !== undefined && { display_order: updates.displayOrder }),
    })
    .eq('id', imageId);

  if (error) {
    console.error('Error updating product image:', error);
    return false;
  }

  return true;
}

/**
 * Delete an image
 */
export async function deleteProductImage(imageId: string): Promise<boolean> {
  const supabase = createClient();

  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    console.error('Error deleting product image:', error);
    return false;
  }

  return true;
}

/**
 * Set an image as primary
 */
export async function setPrimaryImage(imageId: string): Promise<boolean> {
  return updateProductImage(imageId, { isPrimary: true });
}

/**
 * Reorder images
 */
export async function reorderProductImages(
  imageIds: string[],
  productId: string
): Promise<boolean> {
  const supabase = createClient();

  const updates = imageIds.map((id, index) => 
    supabase
      .from('product_images')
      .update({ display_order: index })
      .eq('id', id)
      .eq('product_id', productId)
  );

  try {
    await Promise.all(updates);
    return true;
  } catch (error) {
    console.error('Error reordering images:', error);
    return false;
  }
}

/**
 * Get image count for a product
 */
export async function getImageCount(productId: string): Promise<number> {
  const supabase = createClient();
  
  const { count, error } = await supabase
    .from('product_images')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId);

  if (error) {
    console.error('Error counting images:', error);
    return 0;
  }

  return count || 0;
}

