// lib/utils/image-display.ts

/**
 * Convert S3 URL to display URL for secured buckets
 */
export function getDisplayImageUrl(s3Url: string | null): Promise<string | null> {
  if (!s3Url) return Promise.resolve(null);
  
  // Extract S3 key from full URL
  const s3Key = extractS3KeyFromUrl(s3Url);
  if (!s3Key) return Promise.resolve(null);

  // Generate presigned URL via API
  return fetch(`/api/images/display?key=${encodeURIComponent(s3Key)}`)
    .then(res => res.json())
    .then(data => data.url || null)
    .catch(err => {
      console.error('Failed to get display URL:', err);
      return null;
    });
}

/**
 * Extract S3 key from full S3 URL or return the key if already provided
 */
function extractS3KeyFromUrl(s3Url: string): string | null {
  try {
    // If it doesn't look like a URL (no protocol), assume it's already an S3 key
    if (!s3Url.startsWith('http://') && !s3Url.startsWith('https://')) {
      return s3Url;
    }
    
    // Handle different S3 URL formats:
    // https://bucket.s3.region.amazonaws.com/key
    // https://s3.region.amazonaws.com/bucket/key
    const url = new URL(s3Url);
    
    if (url.hostname.includes('.s3.')) {
      // Virtual-hosted-style URL: https://bucket.s3.region.amazonaws.com/key
      return url.pathname.substring(1); // Remove leading slash
    } else if (url.hostname.includes('s3.')) {
      // Path-style URL: https://s3.region.amazonaws.com/bucket/key
      const pathParts = url.pathname.substring(1).split('/');
      return pathParts.slice(1).join('/'); // Remove bucket name, keep key
    }
    
    return null;
  } catch (error) {
    console.error('Invalid S3 URL:', s3Url);
    console.error('Error:', error);
    return null;
  }
}

/**
 * React hook for displaying S3 images with presigned URLs
 */
import { useState, useEffect } from 'react';

export function useDisplayImage(s3Url: string | null) {
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!s3Url) {
      setDisplayUrl(null);
      return;
    }

    setLoading(true);
    getDisplayImageUrl(s3Url)
      .then(url => {
        setDisplayUrl(url);
        setLoading(false);
      })
      .catch(() => {
        setDisplayUrl(null);
        setLoading(false);
      });
  }, [s3Url]);

  return { displayUrl, loading };
}
