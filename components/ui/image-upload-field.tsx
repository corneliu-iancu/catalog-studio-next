// Reusable Image Upload Field for Forms
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { CompressionSettings } from '@/lib/types/image-upload';
import { useDisplayImage } from '@/lib/utils/image-display';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { Upload, Image as ImageIcon, X, Check, Loader2 } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageUploadFieldProps {
  currentImageUrl?: string;
  onImageUploaded: (s3Key: string, publicUrl: string) => void;
  onImageRemoved?: () => void;
  folder?: string;
  label?: string;
  description?: string;
  maxFileSize?: number;
  compressionSettings?: CompressionSettings;
  className?: string;
  aspect?: number; // Optional aspect ratio (e.g., 1 for square, 16/9 for landscape, undefined for free crop)
}

// Helper function to create a centered aspect crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export function ImageUploadField({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  folder = 'menu-items',
  label = 'Item Image',
  description = 'Upload an image for this item',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  compressionSettings = {
    maxSizeMB: 3,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    quality: 0.92
  },
  className = '',
  aspect = 1 // undefined = free crop, number = locked aspect ratio
}: ImageUploadFieldProps) {
  const { 
    file, 
    isUploading, 
    error, 
    success, 
    imgRef, 
    canvasRef, 
    setFile, 
    setError, 
    reset, 
    processAndUpload 
  } = useImageUpload();
  
  const { displayUrl, loading: imageLoading } = useDisplayImage(currentImageUrl || null);

  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showUploader, setShowUploader] = useState(!currentImageUrl);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Update preview when crop changes
  useEffect(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas to desired preview size
    const previewMaxSize = 300;
    const cropAspect = crop.width / crop.height;
    let canvasWidth, canvasHeight;
    
    if (cropAspect > 1) {
      // Landscape
      canvasWidth = previewMaxSize;
      canvasHeight = previewMaxSize / cropAspect;
    } else {
      // Portrait or square
      canvasHeight = previewMaxSize;
      canvasWidth = previewMaxSize * cropAspect;
    }
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the cropped image scaled to preview size
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    // Convert canvas to blob URL for preview
    canvas.toBlob((blob) => {
      if (blob) {
        // Cleanup previous preview URL
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    }, 'image/jpeg', 0.95);
  }, [completedCrop, imgRef, canvasRef]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelected = (files: any[]) => {
    const selectedFile = files[0] || null;
    setCrop(undefined); // Reset crop for new image
    setCompletedCrop(undefined);
    setImageLoaded(false);
    setPreviewUrl('');
    setFile(selectedFile);
    if (selectedFile) {
      setShowUploader(true);
    }
  };

  const handleUpload = async () => {
    const result = await processAndUpload(completedCrop, compressionSettings, folder);
    
    if (result?.s3Result) {
      onImageUploaded(result.s3Result.s3Key, result.s3Result.publicUrl);
      setShowUploader(false);
    }
  };

  const handleRemoveImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
    reset();
    setCrop(undefined);
    setCompletedCrop(undefined);
    setImageLoaded(false);
    setPreviewUrl('');
    setShowUploader(true);
  };

  const handleChangeImage = () => {
    reset();
    setCrop(undefined);
    setCompletedCrop(undefined);
    setImageLoaded(false);
    setPreviewUrl('');
    setShowUploader(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <label className="text-sm font-medium">{label}</label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {/* Current Image Display */}
      {currentImageUrl && !showUploader && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                {imageLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : displayUrl ? (
                  <img 
                    src={displayUrl} 
                    alt="Current image"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Current image</p>
                <p className="text-xs text-muted-foreground">
                  Click "Change Image" to upload a new one
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleChangeImage();
                  }}
                >
                  Change Image
                </Button>
                {onImageRemoved && (
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Interface */}
      {showUploader && (
        <Card>
          <CardContent className="p-4">
            {!file ? (
              <FileDropzone
                onFilesSelected={handleFileSelected}
                onError={setError}
                acceptedFileTypes={['image/*']}
                maxFileSize={maxFileSize}
                maxFiles={1}
              />
            ) : (
              <div className="space-y-4">
                {/* Crop Interface with Preview */}
                <div className="border rounded-lg p-4">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Crop Area */}
                    <div className="flex-1 min-w-0">
                      {file.preview && (
                        <ReactCrop
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={aspect}
                          keepSelection={true}
                          className="max-w-full"
                        >
                          <img
                            ref={imgRef}
                            src={file.preview}
                            alt={file.name}
                            className="max-w-full h-auto max-h-64 block mx-auto"
                            onLoad={(e) => {
                              const { width, height } = e.currentTarget;
                              const initialCrop = centerAspectCrop(width, height, aspect);
                              setCrop(initialCrop);
                              setImageLoaded(true);
                            }}
                          />
                        </ReactCrop>
                      )}
                    </div>

                    {/* Preview */}
                    {previewUrl && (
                      <div className="flex flex-col items-center gap-2 md:w-1/2 w-full">
                        <div className="w-full max-w-xs border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden bg-muted/30">
                          <img
                            src={previewUrl}
                            alt="Crop preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                          This is what will be uploaded
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Crop Controls */}
                  <div className="mt-4 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (imgRef.current) {
                          const { width, height } = imgRef.current;
                          setCrop(centerAspectCrop(width, height, aspect));
                        }
                      }}
                    >
                      Reset Crop
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      reset();
                      setCrop(undefined);
                      setCompletedCrop(undefined);
                      setImageLoaded(false);
                      setPreviewUrl('');
                      if (!currentImageUrl) {
                        setShowUploader(true);
                      } else {
                        setShowUploader(false);
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUpload();
                    }} 
                    disabled={isUploading}
                    className="min-w-[120px]"
                  >
                    {isUploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}
          </CardContent>

          {/* Hidden Canvas */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </Card>
      )}
    </div>
  );
}
