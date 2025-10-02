// Custom hook for image upload functionality
'use client';

import { useCallback, useReducer, useRef } from 'react';
import { FileWithPreview, UploadAction, UploadState, CompressionSettings } from '@/lib/types/image-upload';
import imageCompression from 'browser-image-compression';
import { s3UploadService } from '@/lib/services/s3-upload';

const initialState: UploadState = {
  file: null,
  isUploading: false,
  error: null,
  success: null,
};

function uploadReducer(state: UploadState, action: UploadAction): UploadState {
  switch (action.type) {
    case 'SET_FILE':
      return { ...state, file: action.payload, error: null, success: null };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, success: null, isUploading: false };
    case 'SET_SUCCESS':
      return { ...state, success: action.payload, error: null, isUploading: false };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useImageUpload() {
  const [state, dispatch] = useReducer(uploadReducer, initialState);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup function for object URLs
  const cleanupPreview = useCallback((file: FileWithPreview | null) => {
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
  }, []);

  const createPreview = useCallback((file: File): FileWithPreview => {
    const fileWithPreview = file as FileWithPreview;
    if (file.type.startsWith('image/')) {
      fileWithPreview.preview = URL.createObjectURL(file);
    }
    return fileWithPreview;
  }, []);

  const setFile = useCallback((file: File | null) => {
    // Clean up previous preview
    cleanupPreview(state.file);
    
    const fileWithPreview = file ? createPreview(file) : null;
    dispatch({ type: 'SET_FILE', payload: fileWithPreview });
  }, [state.file, cleanupPreview, createPreview]);

  const setError = useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setSuccess = useCallback((message: string) => {
    dispatch({ type: 'SET_SUCCESS', payload: message });
  }, []);

  const reset = useCallback(() => {
    cleanupPreview(state.file);
    dispatch({ type: 'RESET' });
  }, [state.file, cleanupPreview]);

  const compressImage = useCallback(async (file: File, settings: CompressionSettings): Promise<File> => {
    try {
      const compressedFile = await imageCompression(file, settings);
      console.log(`Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error('Failed to compress image');
    }
  }, []);

  const extractCroppedImage = useCallback((completedCrop: { x: number; y: number; width: number; height: number }): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!completedCrop || !imgRef.current || !canvasRef.current || !state.file) {
        resolve(null);
        return;
      }

      const canvas = canvasRef.current;
      const image = imgRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(null);
        return;
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob((blob) => {
        if (blob && state.file) {
          const croppedFile = new File([blob], `cropped-${state.file.name}`, {
            type: state.file.type,
            lastModified: Date.now()
          });
          resolve(croppedFile);
        } else {
          resolve(null);
        }
      }, state.file?.type || 'image/jpeg', 0.99);
    });
  }, [state.file]);

  const processAndUpload = useCallback(async (
    completedCrop: { x: number; y: number; width: number; height: number } | undefined,
    settings: CompressionSettings,
    folder: string = 'menu-items'
  ) => {
    if (!state.file) {
      setError('No file selected for upload');
      return;
    }

    dispatch({ type: 'SET_UPLOADING', payload: true });

    try {
      // Get cropped image if crop is available
      const croppedFile = completedCrop ? await extractCroppedImage(completedCrop) : null;
      const fileToCompress = croppedFile || state.file;
      
      // Compress the image
      const compressedFile = await compressImage(fileToCompress, settings);

      // Upload to S3
      const uploadResult = await s3UploadService.uploadFile(compressedFile, {
        folder,
        onProgress: (progress) => {
          console.log(`Upload progress: ${Math.round(progress)}%`);
        }
      });
      
      setSuccess(`Successfully uploaded ${croppedFile ? 'cropped and compressed' : 'compressed'} image to S3!`);
      
      console.log('S3 upload complete:', uploadResult);
      
      return {
        file: compressedFile,
        s3Result: uploadResult
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process and upload file';
      setError(errorMessage);
      console.error('Upload error:', err);
      return null;
    }
  }, [state.file, extractCroppedImage, compressImage, setError, setSuccess]);

  return {
    ...state,
    imgRef,
    canvasRef,
    setFile,
    setError,
    setSuccess,
    reset,
    processAndUpload,
  };
}
