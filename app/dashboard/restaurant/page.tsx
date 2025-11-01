'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import { useDisplayImage } from '@/lib/utils/image-display';
import { 
  Store, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  ExternalLink,
  User as UserIcon,
  UtensilsCrossed,
  Save,
  X,
  Loader2,
  Clock,
  RefreshCw,
  Shield,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { getCurrentDomain } from '@/lib/config';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

function RestaurantProfileContent() {
  const t = useTranslations();
  const { selectedRestaurant, isLoading, refreshRestaurants } = useRestaurant();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    cuisine: '',
    owner_name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    logo_url: ''
  });

  // Use the display image hook for the logo
  const { displayUrl: logoDisplayUrl, loading: logoLoading } = useDisplayImage(
    selectedRestaurant?.logo_url || null
  );

  useEffect(() => {
    if (selectedRestaurant) {
      setFormData({
        name: selectedRestaurant.name || '',
        slug: selectedRestaurant.slug || '',
        description: selectedRestaurant.description || '',
        cuisine: selectedRestaurant.cuisine || '',
        owner_name: selectedRestaurant.owner_name || '',
        email: selectedRestaurant.email || '',
        phone: selectedRestaurant.phone || '',
        website: selectedRestaurant.website || '',
        address: selectedRestaurant.address || '',
        latitude: selectedRestaurant.latitude || null,
        longitude: selectedRestaurant.longitude || null,
        logo_url: selectedRestaurant.logo_url || ''
      });
    }
  }, [selectedRestaurant]);

  const handleInputChange = (field: string, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedRestaurant) return;

    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('restaurants')
        .update(formData)
        .eq('id', selectedRestaurant.id)
        .select()
        .single();

      if (error) throw error;

      toast.success(t('restaurant.profile.updateSuccess'));
      setIsEditing(false);
      
      // Update the restaurant context with the new data
      if (refreshRestaurants) {
        await refreshRestaurants();
      }
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error(t('restaurant.profile.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (selectedRestaurant) {
      setFormData({
        name: selectedRestaurant.name || '',
        slug: selectedRestaurant.slug || '',
        description: selectedRestaurant.description || '',
        cuisine: selectedRestaurant.cuisine || '',
        owner_name: selectedRestaurant.owner_name || '',
        email: selectedRestaurant.email || '',
        phone: selectedRestaurant.phone || '',
        website: selectedRestaurant.website || '',
        address: selectedRestaurant.address || '',
        latitude: selectedRestaurant.latitude || null,
        longitude: selectedRestaurant.longitude || null,
        logo_url: selectedRestaurant.logo_url || ''
      });
    }
    setIsEditing(false);
  };

  const handleLogoUploaded = (s3Key: string, publicUrl: string) => {
    setFormData(prev => ({
      ...prev,
      logo_url: s3Key
    }));
  };

  const handleLogoRemoved = () => {
    setFormData(prev => ({
      ...prev,
      logo_url: ''
    }));
  };

  const handleLocationChange = (location: { address: string; latitude: number | null; longitude: number | null }) => {
    setFormData(prev => ({
      ...prev,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t('restaurant.profile.loadingProfile')}</p>
        </div>
      </div>
    );
  }

  if (!selectedRestaurant) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <Store className="h-12 w-12 text-muted-foreground mx-auto" />
          <div>
            <h2 className="text-lg font-semibold">{t('restaurant.profile.noRestaurantSelected')}</h2>
            <p className="text-muted-foreground">{t('restaurant.profile.selectRestaurant')}</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCuisineType = (cuisine: string | null) => {
    if (!cuisine) return t('restaurant.basicInfo.notSpecified');
    return cuisine.charAt(0).toUpperCase() + cuisine.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('restaurant.profile.title')}</h1>
          <p className="text-muted-foreground">
            {t('restaurant.profile.subtitle')}
          </p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="mr-2 h-4 w-4" />
                {t('common.cancel')}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? t('restaurant.profile.saving') : t('restaurant.profile.saveChanges')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="default" onClick={() => window.open(`/${selectedRestaurant.slug}`, '_blank')}>
                <ExternalLink className="mr-2 h-4 w-4" />
                {t('restaurant.quickActions.viewPublicMenu')}
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                {t('restaurant.profile.editProfile')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Account Information - Full Width */}
      <Card className="relative overflow-hidden">
        {/* Soft gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/40 to-transparent dark:from-blue-900/30 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-100/40 to-transparent dark:from-purple-900/30 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative">
          <CardHeader>
            <CardTitle className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 mr-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              {t('restaurant.accountInfo.title')}
            </CardTitle>
            <CardDescription>
              {t('restaurant.accountInfo.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Created Date */}
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/60 dark:border-white/10">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex-shrink-0">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-semibold text-green-700 dark:text-green-300 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {t('restaurant.accountInfo.created')}
                  </label>
                  <p className="text-sm text-foreground font-medium mt-1">
                    {selectedRestaurant.created_at ? new Date(selectedRestaurant.created_at).toLocaleDateString('ro-RO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Account established
                  </p>
                </div>
              </div>
              
              {/* Last Updated */}
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/60 dark:border-white/10">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                  <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {t('restaurant.accountInfo.lastUpdated')}
                  </label>
                  <p className="text-sm text-foreground font-medium mt-1">
                    {selectedRestaurant.updated_at ? new Date(selectedRestaurant.updated_at).toLocaleDateString('ro-RO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : '-'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last profile modification
                  </p>
                </div>
              </div>
              
              {/* Status */}
              <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/60 dark:border-white/10">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
                  selectedRestaurant.is_active 
                    ? 'bg-emerald-100 dark:bg-emerald-900/30' 
                    : 'bg-gray-100 dark:bg-gray-900/30'
                }`}>
                  {selectedRestaurant.is_active ? (
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <label className={`text-sm font-semibold flex items-center ${
                    selectedRestaurant.is_active 
                      ? 'text-emerald-700 dark:text-emerald-300' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {t('restaurant.accountInfo.status')}
                  </label>
                  <div className="mt-2">
                    <Badge 
                      variant={selectedRestaurant.is_active ? "default" : "secondary"}
                      className={`${
                        selectedRestaurant.is_active 
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm' 
                          : 'bg-gray-500 hover:bg-gray-600 text-white'
                      }`}
                    >
                      {selectedRestaurant.is_active ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedRestaurant.is_active ? 'Your restaurant is live and accessible' : 'Restaurant is currently inactive'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              {t('restaurant.basicInfo.title')}
            </CardTitle>
            <CardDescription>
              {t('restaurant.basicInfo.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Logo Upload */}
            {isEditing ? (
              <>
                <ImageUploadField
                  currentImageUrl={formData.logo_url}
                  onImageUploaded={handleLogoUploaded}
                  onImageRemoved={handleLogoRemoved}
                  folder="restaurants"
                  label={t('restaurant.basicInfo.logo')}
                  description={t('restaurant.basicInfo.logoDescription')}
                  compressionSettings={{
                    maxSizeMB: 2,
                    maxWidthOrHeight: 1024,
                    useWebWorker: true,
                    quality: 1
                  }}
                />
                <Separator />
              </>
            ) : selectedRestaurant.logo_url ? (
              <>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.basicInfo.logo')}</Label>
                  <div className="mt-2">
                    <div className="w-32 h-20 rounded-lg overflow-hidden border-2 border-muted bg-muted/10">
                      {logoLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted/50">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      ) : logoDisplayUrl ? (
                        <img 
                          src={logoDisplayUrl}
                          alt={`${selectedRestaurant.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted/50">
                          <Store className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            ) : null}

            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.basicInfo.restaurantName')}</Label>
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('restaurant.basicInfo.restaurantNamePlaceholder')}
                />
              ) : (
                <p className="text-lg font-semibold">{selectedRestaurant.name}</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.basicInfo.urlSlug')}</Label>
              {isEditing ? (
                <Input
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder={t('restaurant.basicInfo.urlSlugPlaceholder')}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <p className="font-mono text-sm">{getCurrentDomain()}/{selectedRestaurant.slug}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/${selectedRestaurant.slug}`, '_blank')}
                    title={t('restaurant.basicInfo.openInNewTab')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.basicInfo.descriptionLabel')}</Label>
              {isEditing ? (
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t('restaurant.basicInfo.descriptionPlaceholder')}
                  rows={3}
                />
              ) : (
                <p className="text-sm">
                  {selectedRestaurant.description || t('restaurant.basicInfo.noDescription')}
                </p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.basicInfo.cuisineType')}</Label>
              {isEditing ? (
                <Input
                  value={formData.cuisine}
                  onChange={(e) => handleInputChange('cuisine', e.target.value)}
                  placeholder={t('restaurant.basicInfo.cuisineTypePlaceholder')}
                />
              ) : (
                <div className="mt-1">
                  <Badge variant="secondary" className="flex items-center w-fit">
                    <UtensilsCrossed className="mr-1 h-3 w-3" />
                    {formatCuisineType(selectedRestaurant.cuisine)}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserIcon className="mr-2 h-5 w-5" />
              {t('restaurant.contactInfo.title')}
            </CardTitle>
            <CardDescription>
              {t('restaurant.contactInfo.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.contactInfo.ownerName')}</Label>
              {isEditing ? (
                <Input
                  value={formData.owner_name}
                  onChange={(e) => handleInputChange('owner_name', e.target.value)}
                  placeholder={t('restaurant.contactInfo.ownerNamePlaceholder')}
                />
              ) : (
                <p className="font-medium">{selectedRestaurant.owner_name}</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.contactInfo.email')}</Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder={t('restaurant.contactInfo.emailPlaceholder')}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{selectedRestaurant.email}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.contactInfo.phone')}</Label>
              {isEditing ? (
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder={t('restaurant.contactInfo.phonePlaceholder')}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{selectedRestaurant.phone || t('restaurant.contactInfo.notProvided')}</p>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('restaurant.contactInfo.website')}</Label>
              {isEditing ? (
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder={t('restaurant.contactInfo.websitePlaceholder')}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {selectedRestaurant.website ? (
                    <a 
                      href={selectedRestaurant.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedRestaurant.website}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">{t('restaurant.contactInfo.notProvided')}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>


      </div>

      {/* Location Information - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            {t('restaurant.location.title')}
          </CardTitle>
          <CardDescription>
            {t('restaurant.location.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <Label htmlFor="address">{t('restaurant.location.address')}</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t('restaurant.location.addressPlaceholder')}
                  disabled={isSaving}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude (optional)</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="e.g., 40.7128"
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude (optional)</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="e.g., -74.0060"
                    disabled={isSaving}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {selectedRestaurant.address && (
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {t('restaurant.location.address')}
                    </Label>
                    <p className="text-sm text-foreground font-medium mt-1 whitespace-pre-wrap">
                      {selectedRestaurant.address}
                    </p>
                    {selectedRestaurant.latitude && selectedRestaurant.longitude && (
                      <div className="flex items-center space-x-4 mt-2">
                        <p className="text-xs text-muted-foreground">
                          Coordinates: {selectedRestaurant.latitude.toFixed(6)}, {selectedRestaurant.longitude.toFixed(6)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = `https://www.google.com/maps/search/?api=1&query=${selectedRestaurant.latitude},${selectedRestaurant.longitude}`;
                            window.open(url, '_blank');
                          }}
                          className="h-6 px-2 text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View on Maps
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function RestaurantPage() {
  const t = useTranslations();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <RestaurantProfileContent />
    </DashboardLayout>
  );
}