// Global Google Maps loader utility to prevent duplicate script loading

declare global {
  interface Window {
    google: any;
    googleMapsPromise?: Promise<void>;
    googleMapsLoaded?: boolean;
  }
}

let loadPromise: Promise<void> | null = null;

export function loadGoogleMaps(): Promise<void> {
  console.log('loadGoogleMaps called', {
    existingPromise: !!loadPromise,
    hasGoogle: !!window.google,
    isLoaded: !!window.googleMapsLoaded
  });
  
  // Return existing promise if already loading or loaded
  if (loadPromise) {
    console.log('Returning existing promise');
    return loadPromise;
  }

  // If already loaded, return resolved promise
  if (window.google && window.googleMapsLoaded) {
    console.log('Google Maps already loaded');
    return Promise.resolve();
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('Google Maps API key not configured');
    return Promise.reject(new Error('Google Maps API key not found'));
  }
  
  console.log('Starting to load Google Maps script');

  // Check if script already exists
  const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
  if (existingScript && window.google) {
    window.googleMapsLoaded = true;
    return Promise.resolve();
  }

  // Create new loading promise using async pattern for better performance
  loadPromise = new Promise((resolve, reject) => {
    console.log('Creating Google Maps script element');
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';

    script.onload = () => {
      console.log('Google Maps script onload event fired');
      
      // Wait for google.maps to be available
      const checkGoogleMaps = () => {
        console.log('Checking if Google Maps is ready:', {
          hasGoogle: !!window.google,
          hasMaps: !!window.google?.maps
        });
        
        if (window.google && window.google.maps) {
          console.log('Google Maps is ready!');
          window.googleMapsLoaded = true;
          resolve();
        } else {
          setTimeout(checkGoogleMaps, 50);
        }
      };
      checkGoogleMaps();
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Maps script:', error);
      reject(new Error('Failed to load Google Maps script'));
    };

    console.log('Appending script to document head');
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function isGoogleMapsLoaded(): boolean {
  return !!(window.google && window.googleMapsLoaded);
}
