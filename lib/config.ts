/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  // Default domain used for SSR fallback and development
  DEFAULT_DOMAIN: 'catalogstudio.com',
  
  // Application name and branding
  APP_NAME: 'Catalog Studio',
  
  // Contact information
  SUPPORT_EMAIL: 'support@catalogstudio.com',
  LEGAL_EMAIL: 'legal@catalogstudio.com',
  PRIVACY_EMAIL: 'privacy@catalogstudio.com',
} as const;

/**
 * Get the current domain/host for URL generation
 * @returns Current domain or fallback for SSR
 */
export function getCurrentDomain(): string {
  if (typeof window !== 'undefined') {
    return window.location.host;
  }
  return APP_CONFIG.DEFAULT_DOMAIN;
}

/**
 * Get the current protocol + domain for full URL generation
 * @returns Full base URL (e.g., "https://example.com")
 */
export function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return `https://${APP_CONFIG.DEFAULT_DOMAIN}`;
}
