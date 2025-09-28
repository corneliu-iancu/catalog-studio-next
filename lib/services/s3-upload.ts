// S3 upload service for frontend
'use client';

interface PresignedUrlResponse {
  presignedUrl: string;
  s3Key: string;
  publicUrl: string;
  fileName: string;
}

interface UploadToS3Options {
  folder?: string;
  onProgress?: (progress: number) => void;
}

export class S3UploadService {
  /**
   * Get presigned URL from backend
   */
  private async getPresignedUrl(fileName: string, fileType: string, folder: string = 'uploads'): Promise<PresignedUrlResponse> {
    const response = await fetch('/api/images/presigned-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileType,
        folder,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get presigned URL');
    }

    return response.json();
  }

  /**
   * Upload file to S3 using presigned URL
   */
  private async uploadToPresignedUrl(
    file: File, 
    presignedUrl: string, 
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }

  /**
   * Complete upload process: get presigned URL and upload file
   */
  async uploadFile(
    file: File, 
    options: UploadToS3Options = {}
  ): Promise<{ s3Key: string; publicUrl: string; fileName: string }> {
    try {
      const { folder = 'uploads', onProgress } = options;
      
      // Step 1: Get presigned URL
      const { presignedUrl, s3Key, publicUrl, fileName } = await this.getPresignedUrl(
        file.name, 
        file.type, 
        folder
      );

      // Step 2: Upload to S3
      await this.uploadToPresignedUrl(file, presignedUrl, onProgress);

      // Step 3: Return file details
      return { s3Key, publicUrl, fileName };

    } catch (error) {
      console.error('S3 upload error:', error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(
    files: File[], 
    options: UploadToS3Options = {}
  ): Promise<Array<{ s3Key: string; publicUrl: string; fileName: string }>> {
    const uploadPromises = files.map(file => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }
}

// Export singleton instance
export const s3UploadService = new S3UploadService();
