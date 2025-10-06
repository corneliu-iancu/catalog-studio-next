'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, QrCode as QrCodeIcon, Share2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MenuQRCodeProps {
  restaurantSlug: string;
  menuSlug: string;
  menuName: string;
}

export function MenuQRCode({ restaurantSlug, menuSlug, menuName }: MenuQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const menuUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${restaurantSlug}/menu/${menuSlug}`;

  useEffect(() => {
    generateQRCode();
  }, [restaurantSlug, menuSlug]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, menuUrl, {
        width: 300,
        margin: 2,
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

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.download = `${restaurantSlug}-${menuSlug}-qr-code.png`;
    link.href = qrCodeDataUrl;
    link.click();
    toast.success('QR code downloaded successfully');
  };

  const downloadHighResQRCode = async () => {
    try {
      // Generate high-resolution QR code (2000x2000)
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
      toast.success('High-resolution QR code downloaded (2000x2000px)');
    } catch (error) {
      console.error('Error generating high-res QR code:', error);
      toast.error('Failed to generate high-resolution QR code');
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      toast.success('Menu URL copied to clipboard');
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
          text: `Check out the menu for ${menuName}`,
          url: menuUrl,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback to copying URL
      copyUrlToClipboard();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCodeIcon className="mr-2 h-5 w-5" />
          QR Code
        </CardTitle>
        <CardDescription>
          Share your menu with customers by letting them scan this QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* QR Code Display */}
        <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-dashed">
          <canvas ref={canvasRef} />
        </div>

        {/* Menu URL */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Menu URL</label>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 text-sm bg-muted rounded-md overflow-x-auto">
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
            <Button onClick={downloadQRCode} variant="default" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download (1000px)
            </Button>
            <Button onClick={downloadHighResQRCode} variant="default" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Print (2000px)
            </Button>
          </div>
          <Button onClick={shareMenu} variant="outline" className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            Share Menu
          </Button>
        </div>

        {/* Usage Tips */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <h4 className="text-sm font-medium">Usage Tips</h4>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Download the standard version for digital sharing (social media, email)</li>
            <li>Download the print version for physical materials (posters, table tents, menus)</li>
            <li>Ensure good lighting and contrast when printing for best scanning results</li>
            <li>Test the QR code with different devices before mass printing</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
