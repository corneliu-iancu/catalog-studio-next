// Reusable Image Upload Field for Forms
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { CompressionSettings } from '@/lib/types/image-upload';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import { Upload, Image as ImageIcon, X, Check } from 'lucide-react';
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
}

export function ImageUploadField({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  folder = 'menu-items',
  label = 'Item Image',
  description = 'Upload an image for this item',
  maxFileSize = 5 * 1024 * 1024, // 5MB
  compressionSettings = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    quality: 0.8
  },
  className = ''
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

  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showUploader, setShowUploader] = useState(!currentImageUrl);

  const handleFileSelected = (files: any[]) => {
    const selectedFile = files[0] || null;
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
    setShowUploader(true);
  };

  const handleChangeImage = () => {
    reset();
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
              <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={currentImageUrl} 
                  alt="Current image"
                  className="w-full h-full object-cover"
                />
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
                  onClick={handleChangeImage}
                >
                  Change Image
                </Button>
                {onImageRemoved && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
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
                {/* Crop Interface */}
                <div className="border rounded-lg p-4">
                  <div className="w-full max-w-lg mx-auto">
                    {file.preview && (
                      <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={undefined}
                        circularCrop={false}
                        className="max-w-full"
                      >
                        <img
                          ref={imgRef}
                          src={file.preview}
                          alt={file.name}
                          className="max-w-full h-auto max-h-64 block mx-auto"
                          onLoad={() => {
                            if (imgRef.current) {
                              const { width, height } = imgRef.current.getBoundingClientRect();
                              const size = Math.min(width, height) * 0.8;
                              setCrop({
                                unit: 'px',
                                width: size,
                                height: size,
                                x: (width - size) / 2,
                                y: (height - size) / 2,
                              });
                            }
                          }}
                        />
                      </ReactCrop>
                    )}
                  </div>

                  {/* Crop Controls */}
                  <div className="mt-4 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (imgRef.current) {
                          const { width, height } = imgRef.current.getBoundingClientRect();
                          const size = Math.min(width, height) * 0.9;
                          setCrop({
                            unit: 'px',
                            width: size,
                            height: size,
                            x: (width - size) / 2,
                            y: (height - size) / 2,
                          });
                        }
                      }}
                    >
                      Square Crop
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (imgRef.current) {
                          const { width, height } = imgRef.current.getBoundingClientRect();
                          setCrop({
                            unit: 'px',
                            width: width * 0.95,
                            height: height * 0.95,
                            x: width * 0.025,
                            y: height * 0.025,
                          });
                        }
                      }}
                    >
                      Full Size
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      reset();
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
                    onClick={handleUpload} 
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
