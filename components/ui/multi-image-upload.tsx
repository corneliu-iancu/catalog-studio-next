'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Image as ImageIcon, Plus, GripVertical } from 'lucide-react';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import { useDisplayImage } from '@/lib/utils/image-display';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';

export interface UploadedImage {
  id: string; // Temporary ID for tracking
  s3_key: string;
  preview_url?: string;
  alt_text?: string;
  width?: number;
  height?: number;
}

// Sortable image item component - Compact design with drag-to-reorder primary selection
function SortableImageItem({
  image,
  index,
  onPreview,
  onSetPrimary,
  onDelete,
  disabled
}: {
  image: UploadedImage;
  index: number;
  onPreview: (image: UploadedImage) => void;
  onSetPrimary: (id: string) => void;
  onDelete: (image: UploadedImage) => void;
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const { displayUrl, loading } = useDisplayImage(image.s3_key);
  const isPrimary = index === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {/* Compact Card */}
      <div className={`bg-card border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 ${
        isPrimary 
          ? 'border-primary/50 ring-1 ring-primary/20' 
          : 'hover:border-primary/30'
      }`}>
        
        {/* Primary Badge - Top Center */}
        {isPrimary && (
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-primary text-primary-foreground text-[10px] font-medium px-2 py-0.5 rounded-full">
              Primary
            </div>
          </div>
        )}

        {/* Image Thumbnail */}
        <button
          type="button"
          onClick={() => onPreview(image)}
          className="relative w-full aspect-square bg-muted hover:bg-muted/80 transition-colors block p-0 border-0"
        >
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground animate-pulse" />
            </div>
          ) : displayUrl ? (
            <img
              src={displayUrl}
              alt={image.alt_text || `Image ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </button>

        {/* Bottom Actions */}
        <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Drag Handle */}
          <button
            type="button"
            className="p-1 rounded bg-black/50 text-white/70 hover:text-white cursor-grab active:cursor-grabbing touch-none transition-colors"
            {...attributes}
            {...listeners}
            title="Drag to reorder (first position = primary)"
          >
            <GripVertical className="h-3 w-3" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => onDelete(image)}
            disabled={disabled}
            className="p-1 rounded bg-black/50 text-red-400 hover:text-red-300 transition-colors"
            title="Delete image"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

      </div>
    </div>
  );
}

interface MultiImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  uploadPath: string; // e.g., "restaurant/menu/category/product"
  maxImages?: number;
  disabled?: boolean;
  onSlugLock?: () => void; // Called after first upload to lock slug
}

export function MultiImageUpload({
  images,
  onImagesChange,
  uploadPath,
  maxImages = 10,
  disabled = false,
  onSlugLock
}: MultiImageUploadProps) {
  const [imageToDelete, setImageToDelete] = useState<UploadedImage | null>(null);
  const [previewImage, setPreviewImage] = useState<UploadedImage | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      const reorderedImages = arrayMove(images, oldIndex, newIndex);
      onImagesChange(reorderedImages);
      toast.success('Images reordered');
    }
  };

  const handleImageUploaded = (s3Key: string, publicUrl: string) => {
    // Lock slug after first upload
    if (images.length === 0 && onSlugLock) {
      onSlugLock();
    }

    const newImage: UploadedImage = {
      id: crypto.randomUUID(),
      s3_key: s3Key,
      preview_url: publicUrl
    };

    onImagesChange([...images, newImage]);
    setShowUploader(false);
    toast.success('Image uploaded successfully');
  };

  const handleDeleteClick = (image: UploadedImage) => {
    setImageToDelete(image);
  };

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;

    try {
      // Delete from S3 via API
      const response = await fetch(`/api/images/${encodeURIComponent(imageToDelete.s3_key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      
      // Remove from list
      onImagesChange(images.filter(img => img.id !== imageToDelete.id));
      
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } finally {
      setImageToDelete(null);
    }
  };

  const handleSetPrimary = (imageId: string) => {
    // Move selected image to first position
    const updatedImages = [...images];
    const index = updatedImages.findIndex(img => img.id === imageId);
    if (index > 0) {
      const [image] = updatedImages.splice(index, 1);
      updatedImages.unshift(image);
      onImagesChange(updatedImages);
      toast.success('Primary image updated');
    }
  };

  const canUploadMore = images.length < maxImages && !disabled;

  return (
    <div className="space-y-4">
      {/* Upload Section */}
      {canUploadMore && !showUploader && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUploader(true)}
          disabled={disabled}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Image ({images.length}/{maxImages})
        </Button>
      )}

      {showUploader && canUploadMore && (
        <Card>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Upload New Image</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowUploader(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ImageUploadField
              onImageUploaded={handleImageUploaded}
              folder={uploadPath}
              label=""
              description="Upload your image"
            />
          </div>
        </Card>
      )}

      {/* Images List - 3 columns on desktop */}
      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map(img => img.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {images.map((image, index) => (
                <SortableImageItem
                  key={image.id}
                  image={image}
                  index={index}
                  onPreview={setPreviewImage}
                  onSetPrimary={handleSetPrimary}
                  onDelete={handleDeleteClick}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <Card className="p-12 flex flex-col items-center justify-center border-dashed">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground text-center">
            No images uploaded yet
            <br />
            Click the button above to upload images
          </p>
        </Card>
      )}

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {previewImage && (
            <ImagePreview image={previewImage} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!imageToDelete} onOpenChange={(open) => !open && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image from storage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Full-size image preview component for modal
function ImagePreview({ image }: { image: UploadedImage }) {
  const { displayUrl, loading } = useDisplayImage(image.s3_key);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <ImageIcon className="h-16 w-16 text-muted-foreground animate-pulse" />
      </div>
    );
  }

  if (!displayUrl) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <p className="text-muted-foreground">Failed to load image</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <img
        src={displayUrl}
        alt={image.alt_text || 'Preview'}
        className="w-full h-auto max-h-[80vh] object-contain"
      />
    </div>
  );
}
