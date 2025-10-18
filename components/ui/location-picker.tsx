'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Loader2, Navigation, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadGoogleMaps, isGoogleMapsLoaded } from '@/lib/utils/google-maps-loader';

interface LocationData {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

interface LocationPickerProps {
  value: LocationData;
  onChange: (location: LocationData) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function LocationPicker({
  value,
  onChange,
  label = "Location",
  placeholder = "Enter restaurant address...",
  className,
  disabled = false
}: LocationPickerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(value.address || '');
  const [showMap, setShowMap] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const geocoder = useRef<any>(null);

  const initializeGoogleMaps = useCallback(() => {
    if (!window.google) return;

    try {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
      setIsLoaded(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setIsLoading(false);
    }
  }, []);

  // Load Google Maps API
  useEffect(() => {
    if (isGoogleMapsLoaded()) {
      initializeGoogleMaps();
      return;
    }

    loadGoogleMaps()
      .then(() => {
        initializeGoogleMaps();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps:', error);
        setIsLoading(false);
      });
  }, [initializeGoogleMaps]);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.google || mapInstance.current) return;

    const defaultCenter = value.latitude && value.longitude 
      ? { lat: value.latitude, lng: value.longitude }
      : { lat: 44.4268, lng: 26.1025 }; // Bucharest, Romania as default

    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: value.latitude && value.longitude ? 15 : 10,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    placesService.current = new window.google.maps.places.PlacesService(mapInstance.current);

    // Add existing marker if coordinates exist
    if (value.latitude && value.longitude) {
      markerInstance.current = new window.google.maps.Marker({
        position: { lat: value.latitude, lng: value.longitude },
        map: mapInstance.current,
        draggable: true,
      });

      markerInstance.current.addListener('dragend', (event: any) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        reverseGeocode(lat, lng);
      });
    }

    // Add click listener to map
    mapInstance.current.addListener('click', (event: any) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      if (markerInstance.current) {
        markerInstance.current.setPosition({ lat, lng });
      } else {
        markerInstance.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance.current,
          draggable: true,
        });

        markerInstance.current.addListener('dragend', (dragEvent: any) => {
          const dragLat = dragEvent.latLng.lat();
          const dragLng = dragEvent.latLng.lng();
          reverseGeocode(dragLat, dragLng);
        });
      }
      
      reverseGeocode(lat, lng);
    });
  }, [value.latitude, value.longitude]);

  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!geocoder.current) return;

    geocoder.current.geocode(
      { location: { lat, lng } },
      (results: any[], status: string) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setSearchValue(address);
          onChange({
            address,
            latitude: lat,
            longitude: lng,
          });
        }
      }
    );
  }, [onChange]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchValue(query);

    if (!query.trim() || !autocompleteService.current) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input: query,
        types: ['establishment', 'geocode'],
      },
      (predictions: any[], status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  }, []);

  const handleSuggestionClick = useCallback((suggestion: any) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId: suggestion.place_id },
      (place: any, status: string) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const location = place.geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          setSearchValue(place.formatted_address || suggestion.description);
          onChange({
            address: place.formatted_address || suggestion.description,
            latitude: lat,
            longitude: lng,
          });

          if (mapInstance.current) {
            mapInstance.current.setCenter({ lat, lng });
            mapInstance.current.setZoom(15);
            
            if (markerInstance.current) {
              markerInstance.current.setPosition({ lat, lng });
            } else {
              markerInstance.current = new window.google.maps.Marker({
                position: { lat, lng },
                map: mapInstance.current,
                draggable: true,
              });

              markerInstance.current.addListener('dragend', (event: any) => {
                const dragLat = event.latLng.lat();
                const dragLng = event.latLng.lng();
                reverseGeocode(dragLat, dragLng);
              });
            }
          }
        }
        setShowSuggestions(false);
      }
    );
  }, [onChange, reverseGeocode]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        reverseGeocode(lat, lng);
        
        if (mapInstance.current) {
          mapInstance.current.setCenter({ lat, lng });
          mapInstance.current.setZoom(15);
          
          if (markerInstance.current) {
            markerInstance.current.setPosition({ lat, lng });
          } else {
            markerInstance.current = new window.google.maps.Marker({
              position: { lat, lng },
              map: mapInstance.current,
              draggable: true,
            });

            markerInstance.current.addListener('dragend', (event: any) => {
              const dragLat = event.latLng.lat();
              const dragLng = event.latLng.lng();
              reverseGeocode(dragLat, dragLng);
            });
          }
        }
      },
      (error) => {
        console.error('Error getting current location:', error);
      }
    );
  }, [reverseGeocode]);

  const clearLocation = useCallback(() => {
    setSearchValue('');
    onChange({
      address: '',
      latitude: null,
      longitude: null,
    });
    
    if (markerInstance.current) {
      markerInstance.current.setMap(null);
      markerInstance.current = null;
    }
  }, [onChange]);

  useEffect(() => {
    if (showMap && isLoaded) {
      // Small delay to ensure the map container is rendered
      setTimeout(initializeMap, 100);
    }
  }, [showMap, isLoaded, initializeMap]);

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>{label}</Label>
        <div className="flex items-center justify-center h-10 border rounded-md">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading Google Maps...
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={cn("space-y-2", className)}>
        <Label>{label}</Label>
        <div className="p-4 border rounded-md bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground">
            Google Maps is not available. Please check your API key configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <Label>{label}</Label>
      
      {/* Address Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
            disabled={disabled}
            className="pl-10 pr-20"
          />
          {searchValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-12 top-1 h-8 w-8 p-0"
              onClick={clearLocation}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-8 w-8 p-0"
            onClick={getCurrentLocation}
            title="Use current location"
          >
            <Navigation className="h-3 w-3" />
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
            <div className="p-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.place_id || index}
                  className="w-full text-left p-3 hover:bg-muted/50 rounded-sm transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {suggestion.structured_formatting?.main_text || suggestion.description}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {suggestion.structured_formatting?.secondary_text || ''}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Map Toggle and Display */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
            disabled={disabled}
          >
            <MapPin className="h-4 w-4 mr-2" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
          
          {value.latitude && value.longitude && (
            <div className="text-xs text-muted-foreground">
              {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
            </div>
          )}
        </div>

        {showMap && (
          <Card className="p-0 overflow-hidden">
            <div ref={mapRef} className="h-64 w-full" />
            <div className="p-3 bg-muted/30">
              <p className="text-xs text-muted-foreground">
                Click on the map or drag the marker to set the exact location
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
