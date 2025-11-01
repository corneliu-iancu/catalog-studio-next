// Reusable Image Upload Field for Forms
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { CompressionSettings } from '@/lib/types/image-upload';
import { useDisplayImage } from '@/lib/utils/image-display';
import { Upload, Image as ImageIcon, X, Check, Loader2, FileText, Settings, Target, Folder } from 'lucide-react';

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
}

export function ImageUploadField({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  folder = 'menu-items',
  label = 'Item Image',
  description = 'Upload an image for this item',
  maxFileSize = 15 * 1024 * 1024, // 10MB
  compressionSettings = {
    maxSizeMB: 3,
    maxWidthOrHeight: 2048,
    useWebWorker: true,
    quality: 0.92
  },
  className = ''
}: ImageUploadFieldProps) {
  const { 
    file, 
    isUploading, 
    error, 
    success, 
    setFile, 
    setError, 
    reset, 
    processAndUpload 
  } = useImageUpload();
  
  const { displayUrl, loading: imageLoading } = useDisplayImage(currentImageUrl || null);

  const [showUploader, setShowUploader] = useState(!currentImageUrl);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);



  const handleFileSelected = (files: any[]) => {
    const selectedFile = files[0] || null;
    setFile(selectedFile);
    setImageDimensions(null); // Reset dimensions for new file
    if (selectedFile) {
      setShowUploader(true);
    }
  };

  const handleUpload = async () => {
    const result = await processAndUpload(compressionSettings, folder);
    
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
    setImageDimensions(null);
    setShowUploader(true);
  };

  const handleChangeImage = () => {
    reset();
    setImageDimensions(null);
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
                {/* 50/50 Preview Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                  {/* Left Side - Image Preview */}
                  <div className="flex flex-col items-center justify-center">
                    {file.preview && (
                      <div className="w-full">
                        <img
                          src={file.preview}
                          alt={file.name}
                          className="w-full h-auto max-h-80 object-contain rounded-lg border bg-muted/30"
                          onLoad={(e) => {
                            const img = e.target as HTMLImageElement;
                            setImageDimensions({
                              width: img.naturalWidth,
                              height: img.naturalHeight
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Side - File Information */}
                  <div className="space-y-4">
                    {/* File Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">File Details</span>
                      </div>
                      <div className="space-y-2 pl-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Name:</span>
                          <span className="text-sm font-mono truncate max-w-[200px]" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Size:</span>
                          <Badge variant={file.size > 5 * 1024 * 1024 ? "destructive" : file.size > 2 * 1024 * 1024 ? "secondary" : "default"}>
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <Badge variant="outline">{file.type.split('/')[1].toUpperCase()}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Dimensions:</span>
                          <span className="text-sm font-mono">
                            {imageDimensions 
                              ? `${imageDimensions.width} × ${imageDimensions.height}`
                              : 'Loading...'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Compression Settings */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Compression Settings</span>
                      </div>
                      <div className="space-y-2 pl-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Max Size:</span>
                          <span className="text-sm">{compressionSettings.maxSizeMB} MB</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Max Dimension:</span>
                          <span className="text-sm">{compressionSettings.maxWidthOrHeight}px</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Quality:</span>
                          <span className="text-sm">{Math.round(compressionSettings.quality * 100)}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Web Worker:</span>
                          <Badge variant={compressionSettings.useWebWorker ? "default" : "secondary"}>
                            {compressionSettings.useWebWorker ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Upload Preview */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-sm">Upload Details</span>
                      </div>
                      <div className="space-y-2 pl-6">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Destination:</span>
                          <div className="flex items-center gap-1">
                            <Folder className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm font-mono">{folder}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Est. Size:</span>
                          <Badge variant="outline" className="text-green-600">
                            ~{Math.min(file.size / 1024 / 1024, compressionSettings.maxSizeMB * 0.8).toFixed(1)} MB
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Compression:</span>
                          <Badge variant={file.size > compressionSettings.maxSizeMB * 1024 * 1024 ? "default" : "secondary"}>
                            {file.size > compressionSettings.maxSizeMB * 1024 * 1024 ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </div>
                    </div>
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
                      setImageDimensions(null);
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

        </Card>
      )}
    </div>
  );
}
