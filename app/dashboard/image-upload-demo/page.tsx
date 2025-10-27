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
import { FileWithPreview, CompressionSettings } from '@/lib/types/image-upload';
import { useImageUpload } from '@/lib/hooks/useImageUpload';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import { MultiImageUpload, UploadedImage } from '@/components/ui/multi-image-upload';

function ImageUploadDemoContent() {
  const router = useRouter();
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [multiImages, setMultiImages] = useState<UploadedImage[]>([]);
  const [compressionSettings, setCompressionSettings] = useState<CompressionSettings>({
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    quality: 0.8
  });

  const handleImageUploaded = (s3Key: string, publicUrl: string) => {
    setUploadedUrls(prev => [...prev, publicUrl]);
  };

  const clearUploads = () => {
    setUploadedUrls([]);
  };

  const clearMultiImages = () => {
    setMultiImages([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Image Upload Demo</h1>
          <p className="text-muted-foreground">
            Test the simplified image upload functionality
          </p>
        </div>
      </div>

      {/* Demo Instructions */}
      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          This demo shows the simplified image upload component. Upload images to test compression and S3 integration.
        </AlertDescription>
      </Alert>

      {/* Main Upload Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Interface */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>
              Upload and compress your image for S3 storage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploadField
              onImageUploaded={handleImageUploaded}
              folder="demo-uploads"
              label="Demo Image"
              description="Upload any image to test the functionality"
              compressionSettings={compressionSettings}
            />
          </CardContent>
        </Card>

        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Compression Settings</CardTitle>
            <CardDescription>
              Adjust image compression parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Max File Size (MB)</label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.5"
                value={compressionSettings.maxSizeMB}
                onChange={(e) => setCompressionSettings(prev => ({
                  ...prev,
                  maxSizeMB: parseFloat(e.target.value)
                }))}
                className="w-full mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Current: {compressionSettings.maxSizeMB}MB
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Max Dimension (px)</label>
              <input
                type="range"
                min="512"
                max="2048"
                step="128"
                value={compressionSettings.maxWidthOrHeight}
                onChange={(e) => setCompressionSettings(prev => ({
                  ...prev,
                  maxWidthOrHeight: parseInt(e.target.value)
                }))}
                className="w-full mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Current: {compressionSettings.maxWidthOrHeight}px
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Quality</label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={compressionSettings.quality}
                onChange={(e) => setCompressionSettings(prev => ({
                  ...prev,
                  quality: parseFloat(e.target.value)
                }))}
                className="w-full mt-1"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Current: {Math.round(compressionSettings.quality * 100)}%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Image Upload Demo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Multi-Image Upload (New Design)</CardTitle>
            <CardDescription>
              Compact grid with drag-to-reorder primary selection - {multiImages.length} images uploaded
            </CardDescription>
          </div>
          {multiImages.length > 0 && (
            <Button variant="outline" onClick={clearMultiImages}>
              Clear All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <MultiImageUpload
            images={multiImages}
            onImagesChange={setMultiImages}
            uploadPath="demo-multi"
            maxImages={12}
          />
        </CardContent>
      </Card>

      {/* Uploaded Images Gallery */}
      {uploadedUrls.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Uploaded Images</CardTitle>
              <CardDescription>
                Successfully uploaded {uploadedUrls.length} image(s)
              </CardDescription>
            </div>
            <Button variant="outline" onClick={clearUploads}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedUrls.map((url, index) => (
                <div key={index} className="aspect-square border rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feature Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            What this simplified upload system provides
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">✨ Simplified Experience</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Drag & drop upload</li>
                <li>• Instant image preview</li>
                <li>• Automatic compression</li>
                <li>• Direct S3 upload</li>
                <li>• Drag-to-reorder primary selection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🛠️ Technical Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Presigned URL security</li>
                <li>• Configurable compression</li>
                <li>• Progress tracking</li>
                <li>• Error handling</li>
                <li>• Compact responsive grid (2-8 columns)</li>
                <li>• Drag & drop reordering</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ImageUploadDemo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to access the dashboard.</div>;
  }

  return (
    <DashboardLayout user={user}>
      <ImageUploadDemoContent />
    </DashboardLayout>
  );
}