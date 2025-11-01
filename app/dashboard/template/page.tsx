'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink, Save, Palette, Sparkles } from 'lucide-react';
import { TemplateSelector } from '@/components/dashboard/template-selector';
import { useRestaurant } from '@/lib/contexts/restaurant-context';
import { MenuDisplaySettings } from '@/lib/types/templates';
import { menuShowcaseService } from '@/lib/services/menu-showcase';

function TemplatePageContent() {
  const router = useRouter();
  const { selectedRestaurant, isLoading: restaurantLoading } = useRestaurant();
  const [settings, setSettings] = useState<MenuDisplaySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Wait for restaurant context to finish loading
    if (restaurantLoading) {
      return;
    }

    // If no restaurant is selected after loading, redirect
    if (!selectedRestaurant) {
      router.push('/dashboard');
      return;
    }

    loadCurrentSettings();
  }, [selectedRestaurant, restaurantLoading, router]);

  const loadCurrentSettings = async () => {
    if (!selectedRestaurant) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load saved settings from database
      const savedSettings = await menuShowcaseService.loadDisplaySettings(selectedRestaurant.id);
      setSettings(savedSettings);
    } catch (err) {
      setError('Failed to load template settings');
      console.error('Error loading settings:', err);
      
      // Fallback to default settings on error
      const defaultSettings: MenuDisplaySettings = {
        template: 'classic',
        show_prices: true,
        show_descriptions: true,
        show_images: true,
        show_allergens: true,
        show_spice_levels: true,
        show_categories: true,
        enable_search: false,
        enable_filters: false,
        typography: {
          heading_font: 'Georgia',
          body_font: 'Inter',
          font_size: 'medium'
        },
        layout: {
          columns: 3,
          spacing: 'normal',
          border_radius: 'medium'
        }
      };
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (newSettings: MenuDisplaySettings) => {
    setSettings(newSettings);
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!selectedRestaurant || !settings) return;

    try {
      setSaving(true);
      setError(null);

      // Save settings to database
      const success = await menuShowcaseService.updateDisplaySettings(
        selectedRestaurant.id,
        settings
      );

      if (success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('Failed to save template settings');
      }
    } catch (err) {
      setError('Failed to save template settings');
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = (previewSettings: MenuDisplaySettings) => {
    if (!selectedRestaurant) return;
    
    // Open preview in new tab
    const previewUrl = `/${selectedRestaurant.slug}?preview=true&template=${previewSettings.template}`;
    window.open(previewUrl, '_blank');
  };

  // Show loading while restaurant context is loading
  if (restaurantLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading restaurant...</span>
        </div>
      </div>
    );
  }

  // Show loading while settings are loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading template settings...</span>
        </div>
      </div>
    );
  }

  // Show message if no restaurant selected after loading
  if (!selectedRestaurant || !settings) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No Restaurant Selected</h2>
        <p className="text-muted-foreground mb-4">
          Please select a restaurant to customize its menu template.
        </p>
        <Button onClick={() => router.push('/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10">
              <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            Menu Template
          </h1>
          <p className="text-muted-foreground mt-1">
            Customize how your menu appears to customers for{' '}
            <span className="font-medium">{selectedRestaurant.name}</span>
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => handlePreview(settings)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Live Menu
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>
            Template settings saved successfully! Changes are now live on your menu.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Template Info */}
      <Card className="relative overflow-hidden">
        {/* Gradient background - changes based on template */}
        {settings.template === 'urban' ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-red-50/20 to-amber-50/30 dark:from-orange-950/20 dark:via-red-950/10 dark:to-amber-950/20" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-100/40 to-transparent dark:from-orange-900/30 rounded-full -translate-y-16 translate-x-16" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100/40 to-transparent dark:from-purple-900/30 rounded-full -translate-y-16 translate-x-16" />
          </>
        )}
        
        <div className="relative">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className={`mr-2 h-5 w-5 ${
                settings.template === 'urban' 
                  ? 'text-orange-600 dark:text-orange-400' 
                  : 'text-purple-600 dark:text-purple-400'
              }`} />
              Current Template
            </CardTitle>
            <CardDescription>
              Your menu is currently using the{' '}
              <span className="font-medium capitalize">{settings.template}</span> template
              with clean, elegant styling.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 bg-gradient-to-br rounded-lg flex items-center justify-center border ${
                settings.template === 'urban'
                  ? 'from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30 border-orange-200/50 dark:border-orange-800/50'
                  : 'from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30 border-purple-200/50 dark:border-purple-800/50'
              }`}>
                <Palette className={`h-8 w-8 ${
                  settings.template === 'urban'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-purple-600 dark:text-purple-400'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold capitalize">
                  {settings.template}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {settings.show_images ? 'With images' : 'Text only'} •{' '}
                  {settings.show_prices ? 'Prices shown' : 'Prices hidden'} •{' '}
                  {settings.enable_search ? 'Searchable' : 'Browse only'}
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Template Selector */}
      <TemplateSelector
        currentSettings={settings}
        onSettingsChange={handleSettingsChange}
        onPreview={handlePreview}
      />
    </div>
  );
}

export default function TemplatePage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <TemplatePageContent />
      </div>
    </DashboardLayout>
  );
}
