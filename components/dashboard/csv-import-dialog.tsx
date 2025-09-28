"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Download, Upload, AlertCircle, CheckCircle, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import { CsvImportService } from '@/lib/services/csv-import';
import type { ImportValidationResult } from '@/lib/types/csv-import';

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuId: string;
  menuName: string;
  onImportComplete: () => void;
}

type ImportStep = 'upload' | 'validate' | 'preview' | 'importing' | 'complete';

export function CsvImportDialog({ 
  open, 
  onOpenChange, 
  menuId, 
  menuName, 
  onImportComplete 
}: CsvImportDialogProps) {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setStep('validate');
    setValidationResult(null);
    setImportError(null);

    try {
      const content = await uploadedFile.text();
      const result = await CsvImportService.validateCsvContent(content);
      setValidationResult(result);
      
      if (result.isValid) {
        setStep('preview');
      } else {
        setStep('validate');
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        errors: [{ row: 0, field: 'file', message: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`, value: '' }],
        warnings: []
      });
      setStep('validate');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv']
    },
    maxFiles: 1,
    multiple: false
  });

  const handleImport = async () => {
    if (!validationResult?.data || !file) return;

    setStep('importing');
    setImportError(null);

    try {
      // TODO: Implement the actual import logic via API
      const response = await fetch('/api/menu/import-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          menuId,
          data: validationResult.data
        })
      });

      if (!response.ok) {
        throw new Error(`Import failed: ${response.statusText}`);
      }

      setStep('complete');
      setTimeout(() => {
        onImportComplete();
        handleClose();
      }, 2000);

    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed');
      setStep('preview');
    }
  };

  const handleClose = () => {
    setStep('upload');
    setFile(null);
    setValidationResult(null);
    setImportError(null);
    onOpenChange(false);
  };

  const downloadSampleCsv = () => {
    const csvContent = CsvImportService.generateSampleCsv();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'menu-import-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Import Menu Items via CSV</h3>
        <p className="text-sm text-muted-foreground">
          Upload a CSV file to import categories and menu items to <strong>{menuName}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={downloadSampleCsv}
          variant="outline" 
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Download CSV Template
        </Button>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">
            {isDragActive ? 'Drop your CSV file here' : 'Choose CSV file or drag & drop'}
          </p>
          <p className="text-sm text-muted-foreground">
            Supports .csv files up to 10MB
          </p>
        </div>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Your CSV must include these required columns: <strong>category_name, item_name, description, price</strong>
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderValidationStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Validation Results</h3>
        <p className="text-sm text-muted-foreground">
          File: {file?.name}
        </p>
      </div>

      {validationResult && (
        <div className="space-y-4">
          {validationResult.isValid ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                CSV validation passed! Ready to import.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                CSV validation failed. Please fix the errors below.
              </AlertDescription>
            </Alert>
          )}

          {validationResult.warnings.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-600 mb-2">Warnings:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {validationResult.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-600">{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResult.errors.length > 0 && (
            <div>
              <h4 className="font-medium text-red-600 mb-2">Errors:</h4>
              <div className="max-h-40 overflow-y-auto">
                <ul className="space-y-2 text-sm">
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="text-red-600">
                      <strong>Row {error.row}, {error.field}:</strong> {error.message}
                      {error.value && <div className="text-xs opacity-75">Value: {error.value}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Import Preview</h3>
        <p className="text-sm text-muted-foreground">
          Review the data that will be imported to <strong>{menuName}</strong>
        </p>
      </div>

      {importError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}

      {validationResult?.data && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <Badge variant="secondary">
              {validationResult.data.totalCategories} Categories
            </Badge>
            <Badge variant="secondary">
              {validationResult.data.totalItems} Items
            </Badge>
          </div>

          <div className="max-h-60 overflow-y-auto">
            <div className="space-y-4">
              {validationResult.data.categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{category.name}</h4>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-start text-sm">
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">{item.description}</div>
                          {item.allergens.length > 0 && (
                            <div className="text-xs text-orange-600 mt-1">
                              Allergens: {item.allergens.join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${item.price}</div>
                          {item.is_featured && (
                            <Badge variant="outline" className="text-xs">Featured</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderImportingStep = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <h3 className="text-lg font-medium">Importing...</h3>
      <p className="text-sm text-muted-foreground">Please wait while we import your menu items</p>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <CheckCircle className="h-12 w-12 text-green-500" />
      <h3 className="text-lg font-medium">Import Complete!</h3>
      <p className="text-sm text-muted-foreground">Your menu items have been successfully imported</p>
    </div>
  );

  const canProceed = step === 'preview' && validationResult?.isValid;
  const canRetry = step === 'validate' && !validationResult?.isValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Import Menu Items</DialogTitle>
          <DialogDescription>
            Import categories and menu items from a CSV file
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 'upload' && renderUploadStep()}
          {step === 'validate' && renderValidationStep()}
          {step === 'preview' && renderPreviewStep()}
          {step === 'importing' && renderImportingStep()}
          {step === 'complete' && renderCompleteStep()}
        </div>

        <DialogFooter>
          {step !== 'importing' && step !== 'complete' && (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          )}

          {canRetry && (
            <Button onClick={() => setStep('upload')}>
              Choose Different File
            </Button>
          )}

          {canProceed && (
            <Button onClick={handleImport}>
              Import {validationResult?.data?.totalItems} Items
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
