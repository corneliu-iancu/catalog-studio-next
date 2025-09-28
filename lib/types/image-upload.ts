// Shared types for image upload functionality

export interface FileWithPreview extends File {
  preview?: string;
}

export interface ImageCrop {
  unit: '%' | 'px';
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CompressionSettings {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  quality: number;
}

export interface UploadState {
  file: FileWithPreview | null;
  isUploading: boolean;
  error: string | null;
  success: string | null;
}

export interface CropState {
  crop: ImageCrop;
  completedCrop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type UploadAction = 
  | { type: 'SET_FILE'; payload: FileWithPreview | null }
  | { type: 'SET_UPLOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: string | null }
  | { type: 'RESET' };
