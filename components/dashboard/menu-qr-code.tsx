'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Download, Share2, Copy, Check, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface MenuQRCodeProps {
  restaurantSlug: string;
  menuSlug: string;
  menuName: string;
}

export function MenuQRCode({ restaurantSlug, menuSlug, menuName }: MenuQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dialogCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${restaurantSlug}/menu/${menuSlug}`;

  useEffect(() => {
    generateQRCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantSlug, menuSlug, menuUrl]);

  // Callback ref for dialog canvas - fires when element mounts
  const dialogCanvasCallback = (canvas: HTMLCanvasElement | null) => {
    dialogCanvasRef.current = canvas;
    if (canvas && isOpen) {
      // Generate QR code immediately when canvas is mounted
      generateDialogQRCode();
    }
  };

  useEffect(() => {
    if (isOpen && dialogCanvasRef.current) {
      // Also try to generate when dialog opens
      const timer = setTimeout(() => {
        generateDialogQRCode();
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, menuUrl]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      // Small QR code for preview
      await QRCode.toCanvas(canvasRef.current, menuUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      // Also generate data URL for download
      const dataUrl = await QRCode.toDataURL(menuUrl, {
        width: 1000,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeDataUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    }
  };

  const generateDialogQRCode = async () => {
    if (!dialogCanvasRef.current) {
      console.warn('Dialog canvas ref not available');
      return;
    }

    try {
      await QRCode.toCanvas(dialogCanvasRef.current, menuUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      console.log('Dialog QR code generated successfully');
    } catch (error) {
      console.error('Error generating dialog QR code:', error);
      toast.error('Failed to generate QR code in dialog');
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `${restaurantSlug}-${menuSlug}-qr-code.png`;
    link.href = qrCodeDataUrl;
    link.click();
    toast.success('QR code downloaded');
  };

  const downloadHighResQRCode = async () => {
    try {
      const highResDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 2000,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      const link = document.createElement('a');
      link.download = `${restaurantSlug}-${menuSlug}-qr-code-print.png`;
      link.href = highResDataUrl;
      link.click();
      toast.success('High-res QR code downloaded (2000x2000px)');
    } catch (error) {
      console.error('Error generating high-res QR code:', error);
      toast.error('Failed to generate high-res QR code');
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      toast.success('Menu URL copied');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy URL');
    }
  };

  const shareMenu = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: menuName,
          text: `Check out ${menuName}`,
          url: menuUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      copyUrlToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-2">
          <div className="flex items-center gap-3">
            {/* Small QR Code Preview */}
            <div className="bg-white rounded p-1 border">
              <canvas ref={canvasRef} className="block" />
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-medium">View QR</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Menu QR Code</DialogTitle>
          <DialogDescription>
            Share your menu with customers
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center items-center p-6 bg-white rounded-lg border">
            <canvas ref={dialogCanvasCallback} className="block max-w-full h-auto" />
          </div>

          {/* Menu URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Menu URL</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 text-xs bg-muted rounded-md overflow-x-auto">
                {menuUrl}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={copyUrlToClipboard}
                title="Copy URL"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={downloadQRCode} variant="default" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={downloadHighResQRCode} variant="default" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Print Quality
              </Button>
            </div>
            <Button onClick={shareMenu} variant="outline" size="sm" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share Menu
            </Button>
          </div>

          {/* Quick Tip */}
          <p className="text-xs text-muted-foreground text-center">
            Download print quality version for physical materials
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
