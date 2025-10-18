'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Upload, Image as ImageIcon, Settings, CloudUpload } from 'lucide-react';
import { FileDropzone } from '@/components/ui/file-dropzone';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FileWithPreview, CompressionSettings } from '@/lib/types/image-upload';
import { useImageUpload } from '@/lib/hooks/useImageUpload';

function ImageUploadDemoContent() {
  const router = useRouter();
  const { 
    file: uploadedFile, 
    isUploading, 
    error, 
    success, 
    imgRef, 
    canvasRef, 
    setFile, 
    setError, 
    setSuccess, 
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
  const [compressionSettings, setCompressionSettings] = useState<CompressionSettings>({
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    quality: 0.8
  });

  const handleFilesSelected = (files: FileWithPreview[]) => {
    const file = files[0] || null;
    setFile(file);
    if (file) {
      setSuccess(`Selected: ${file.name}`);
    }
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const clearFile = () => {
    reset();
    setCrop({
      unit: '%',
      width: 90,
      height: 90,
      x: 5,
      y: 5
    });
    setCompletedCrop(undefined);
  };

  const handleUpload = async () => {
    await processAndUpload(completedCrop, compressionSettings, 'demo-uploads');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Image Upload Demo</h1>
            <p className="text-muted-foreground">
              Test and preview the image upload component
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Demo Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Upload or Crop Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {!uploadedFile ? (
                <>
                  <Upload className="h-5 w-5" />
                  Select Image
                </>
              ) : (
                <>
                  <ImageIcon className="h-5 w-5" />
                  Crop & Adjust
                </>
              )}
            </CardTitle>
            <CardDescription>
              {!uploadedFile 
                ? "Drag and drop an image or click to select. Supports images up to 5MB."
                : "Adjust your crop area and settings before upload"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
              <FileDropzone
                onFilesSelected={handleFilesSelected}
                onError={handleUploadError}
                acceptedFileTypes={['image/*']}
                maxFileSize={5 * 1024 * 1024} // 5MB
                maxFiles={1}
              />
            ) : (
              <div className="space-y-4">
                {/* Interactive Crop Area */}
                <div className="border rounded-lg p-4">
                  <div className="w-full max-w-2xl mx-auto">
                    {uploadedFile.preview && (
                      <div className="relative">
                        <ReactCrop
                          crop={crop}
                          onChange={(_, percentCrop) => setCrop(percentCrop)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={1}
                          circularCrop={false}
                          className="max-w-full"
                        >
                          <img
                            ref={imgRef}
                            src={uploadedFile.preview}
                            alt={uploadedFile.name}
                            className="max-w-full h-auto max-h-96 block mx-auto"
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                            }}
                            onLoad={() => {
                              if (imgRef.current) {
                                const { width, height } = imgRef.current.getBoundingClientRect();
                                const { naturalWidth, naturalHeight } = imgRef.current;
                                
                                // Calculate crop in displayed image coordinates
                                // Calculate crop area
                                const size = Math.min(width, height) * 0.8;
                                
                                const initialCrop = {
                                  unit: 'px' as const,
                                  width: size,
                                  height: size,
                                  x: (width - size) / 2,
                                  y: (height - size) / 2,
                                };
                                
                                setCrop(initialCrop);
                                
                                // Set initial completedCrop so visible crop area is what gets uploaded
                                // What you see is what you get!
                                const initialCompletedCrop: PixelCrop = {
                                  x: initialCrop.x,
                                  y: initialCrop.y,
                                  width: initialCrop.width,
                                  height: initialCrop.height,
                                  unit: 'px'
                                };
                                setCompletedCrop(initialCompletedCrop);
                              }
                            }}
                          />
                        </ReactCrop>
                      </div>
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
                  
                  {/* Crop Info */}
                  {completedCrop && (
                    <div className="mt-4 text-center">
                      <p className="text-xs text-blue-600">
                        Crop Area: {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)}px
                      </p>
                    </div>
                  )}
                </div>

                {/* Upload Actions */}
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm" onClick={clearFile}>
                    Change Image
                  </Button>
                  <Button 
                    onClick={handleUpload} 
                    disabled={isUploading}
                    className="min-w-[140px]"
                  >
                    {isUploading ? (
                      <>
                        <Upload className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <CloudUpload className="h-4 w-4 mr-2" />
                        Upload to S3
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          
          {/* Hidden Canvas for Image Processing */}
          <canvas
            ref={canvasRef}
            style={{ display: 'none' }}
          />
        </Card>

      </div>

      {/* Compression Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Compression Settings
          </CardTitle>
          <CardDescription>
            Adjust image compression before upload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Max Size (MB)</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={compressionSettings.maxSizeMB}
              onChange={(e) => setCompressionSettings(prev => ({ ...prev, maxSizeMB: parseFloat(e.target.value) }))}
              className="w-full mt-1"
            />
            <span className="text-xs text-muted-foreground">{compressionSettings.maxSizeMB}MB</span>
          </div>
          
          <div>
            <label className="text-sm font-medium">Max Dimension (px)</label>
            <input
              type="range"
              min="512"
              max="2048"
              step="128"
              value={compressionSettings.maxWidthOrHeight}
              onChange={(e) => setCompressionSettings(prev => ({ ...prev, maxWidthOrHeight: parseInt(e.target.value) }))}
              className="w-full mt-1"
            />
            <span className="text-xs text-muted-foreground">{compressionSettings.maxWidthOrHeight}px</span>
          </div>
          
          <div>
            <label className="text-sm font-medium">Quality</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={compressionSettings.quality}
              onChange={(e) => setCompressionSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
              className="w-full mt-1"
            />
            <span className="text-xs text-muted-foreground">{Math.round(compressionSettings.quality * 100)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Component Info */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Details</CardTitle>
          <CardDescription>
            This demo showcases a custom file upload component built with shadcn/ui components
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Interactive crop & resize</li>
                <li>• Square or custom ratios</li>
                <li>• Smart compression</li>
                <li>• S3 upload simulation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Supported Types</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• JPEG (.jpg, .jpeg)</li>
                <li>• PNG (.png)</li>
                <li>• GIF (.gif)</li>
                <li>• WebP (.webp)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Processing</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Crops to selected area</li>
                <li>• Compresses to ~1MB</li>
                <li>• 80% quality default</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ImageUploadDemoPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <ImageUploadDemoContent />
      </div>
    </DashboardLayout>
  );
}
