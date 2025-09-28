'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, X, FileImage } from 'lucide-react';
import { FileWithPreview } from '@/lib/types/image-upload';

interface FileDropzoneProps {
  onFilesSelected: (files: FileWithPreview[]) => void;
  onError: (error: string) => void;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  disabled?: boolean;
  className?: string;
}

export function FileDropzone({
  onFilesSelected,
  onError,
  acceptedFileTypes = ['image/*'],
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  maxFiles = 5,
  disabled = false,
  className
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    // Check file size
    if (file.size > maxFileSize) {
      onError(`File "${file.name}" is too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`);
      return false;
    }

    // Check file type
    const isValidType = acceptedFileTypes.some(type => {
      if (type === 'image/*') {
        return file.type.startsWith('image/');
      }
      return file.type === type;
    });

    if (!isValidType) {
      onError(`File "${file.name}" is not a supported file type.`);
      return false;
    }

    return true;
  }, [maxFileSize, acceptedFileTypes, onError]);

  const createFilePreview = useCallback((file: File): Promise<FileWithPreview> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const fileWithPreview = file as FileWithPreview;
        fileWithPreview.preview = URL.createObjectURL(file);
        resolve(fileWithPreview);
      } else {
        resolve(file as FileWithPreview);
      }
    });
  }, []);

  const cleanupPreviews = useCallback(() => {
    selectedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
  }, [selectedFiles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupPreviews();
    };
  }, [cleanupPreviews]);

  const processFiles = useCallback(async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    
    // Check max files limit
    if (selectedFiles.length + files.length > maxFiles) {
      onError(`Too many files. Maximum ${maxFiles} files allowed.`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      // Create previews for valid files
      const filesWithPreviews = await Promise.all(
        validFiles.map(file => createFilePreview(file))
      );
      
      const newFiles = [...selectedFiles, ...filesWithPreviews];
      setSelectedFiles(newFiles);
      onFilesSelected(newFiles);
    }
  }, [selectedFiles, maxFiles, validateFile, onFilesSelected, onError, createFilePreview]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [disabled, processFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const removeFile = useCallback((index: number) => {
    const fileToRemove = selectedFiles[index];
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
  }, [selectedFiles, onFilesSelected]);

  const clearAll = useCallback(() => {
    // Clean up object URLs before clearing
    cleanupPreviews();
    setSelectedFiles([]);
    onFilesSelected([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onFilesSelected, cleanupPreviews]);

  return (
    <div className={cn('w-full', className)}>
      {/* Dropzone Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
          isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            isDragOver ? 'bg-primary/10' : 'bg-muted'
          )}>
            <Upload className={cn(
              'w-8 h-8',
              isDragOver ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground">
              or{' '}
              <Button variant="link" className="p-0 h-auto font-normal">
                browse files
              </Button>
            </p>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported: {acceptedFileTypes.join(', ')}</p>
            <p>Max size: {Math.round(maxFileSize / 1024 / 1024)}MB per file</p>
            <p>Max files: {maxFiles}</p>
          </div>
        </div>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FileImage className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
