'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadGoogleMaps, isGoogleMapsLoaded } from '@/lib/utils/google-maps-loader';

interface LocationPreviewMapProps {
  address: string;
  latitude: number;
  longitude: number;
  restaurantName: string;
  className?: string;
}

export function LocationPreviewMap({
  address,
  latitude,
  longitude,
  restaurantName,
  className
}: LocationPreviewMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [renderKey, setRenderKey] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  console.log('LocationPreviewMap render:', {
    address,
    latitude,
    longitude,
    restaurantName,
    isLoaded,
    isLoading,
    mapRefExists: !!mapRef.current
  });

  // Check DOM element immediately after render
  useLayoutEffect(() => {
    console.log('LocationPreviewMap useLayoutEffect - checking DOM:', {
      hasMapRef: !!mapRef.current,
      refDimensions: mapRef.current ? {
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
        isVisible: mapRef.current.offsetParent !== null
      } : null
    });
  });

  useEffect(() => {
    console.log('LocationPreviewMap useEffect triggered', { latitude, longitude });
    
    // Reset state on coordinate changes
    setIsLoading(true);
    setIsLoaded(false);
    mapInstance.current = null;
    markerInstance.current = null;

    if (!latitude || !longitude) {
      setIsLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        console.log('LocationPreviewMap: Starting initialization...');
        
        // Load Google Maps if needed
        if (!isGoogleMapsLoaded()) {
          console.log('LocationPreviewMap: Loading Google Maps...');
          await loadGoogleMaps();
          console.log('LocationPreviewMap: Google Maps loaded');
        }
        
        // Wait for mapRef to be available with a simple check
        let attempts = 0;
        const maxAttempts = 30;
        
        const waitForMapRef = () => {
          attempts++;
          
          console.log(`LocationPreviewMap: Attempt ${attempts}, checking ref...`, {
            hasMapRef: !!mapRef.current,
            dimensions: mapRef.current ? {
              width: mapRef.current.offsetWidth,
              height: mapRef.current.offsetHeight
            } : null
          });
          
          if (mapRef.current && mapRef.current.offsetWidth > 0) {
            console.log('LocationPreviewMap: MapRef ready, initializing map...');
            initializeMap();
            return;
          }
          
          if (attempts >= maxAttempts) {
            console.error('LocationPreviewMap: Failed to get mapRef after', maxAttempts, 'attempts');
            setIsLoading(false);
            return;
          }
          
          setTimeout(waitForMapRef, 100);
        };
        
        // Start checking after a small delay to ensure DOM is ready
        setTimeout(waitForMapRef, 50);
        
      } catch (error) {
        console.error('LocationPreviewMap: Error in initMap:', error);
        setIsLoading(false);
      }
    };

    // Start initialization
    const timeoutId = setTimeout(initMap, 100);
    
    return () => {
      clearTimeout(timeoutId);
      // Clean up map instance if component unmounts
      if (mapInstance.current) {
        mapInstance.current = null;
      }
      if (markerInstance.current) {
        markerInstance.current = null;
      }
    };
  }, [latitude, longitude]);

  const initializeMap = () => {
    try {
      if (mapInstance.current) {
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      console.log('LocationPreviewMap: Creating map instance');
      
      const center = { lat: latitude, lng: longitude };

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      // Add marker
      markerInstance.current = new window.google.maps.Marker({
        position: center,
        map: mapInstance.current,
        title: restaurantName,
      });

      // Info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-sm mb-1">${restaurantName}</h3>
            <p class="text-xs text-gray-600">${address}</p>
          </div>
        `
      });

      markerInstance.current.addListener('click', () => {
        infoWindow.open(mapInstance.current, markerInstance.current);
      });

      console.log('LocationPreviewMap: Map initialized successfully');
      setIsLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error('LocationPreviewMap: Error initializing map:', error);
      setIsLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  console.log('LocationPreviewMap: Rendering component', { 
    isLoaded, 
    isLoading, 
    hasMapRef: !!mapRef.current 
  });

  return (
    <Card className={className}>
      <div className="relative">
        {/* Map Container - Always rendered */}
        <div 
          key={`map-${latitude}-${longitude}`}
          ref={mapRef} 
          className="h-64 w-full rounded-t-lg bg-gray-100 dark:bg-gray-800"
          style={{ 
            minHeight: '256px', 
            minWidth: '100%', 
            height: '256px', 
            width: '100%',
            display: 'block',
            position: 'relative'
          }}
        />
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-900/90 rounded-t-lg">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <div>
                <p className="text-sm font-medium">Loading interactive map...</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {restaurantName} • {latitude?.toFixed(4)}, {longitude?.toFixed(4)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Initializing Google Maps...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Fallback Overlay */}
        {!isLoading && !isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 rounded-t-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex-shrink-0">
                <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-2">{restaurantName}</h3>
                <p className="text-sm text-muted-foreground mb-2">{address}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </span>
                </div>
                <p className="text-xs text-orange-600 mb-4">
                  Interactive map could not be loaded. Using fallback view.
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInGoogleMaps}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Google Maps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={getDirections}
                    className="text-xs"
                  >
                    <Navigation className="h-3 w-3 mr-1" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Info Overlay - Only when map is loaded */}
        {isLoaded && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg mb-1">{restaurantName}</h3>
              <p className="text-sm opacity-90 mb-3">{address}</p>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openInGoogleMaps}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View on Google Maps
                </Button>
                <Button
                  variant="secondary" 
                  size="sm"
                  onClick={getDirections}
                  className="text-xs bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
