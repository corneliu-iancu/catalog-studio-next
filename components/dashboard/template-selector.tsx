'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Layout, Settings, Eye } from 'lucide-react';
import { MenuDisplaySettings } from '@/lib/types/templates';
import { menuShowcaseService } from '@/lib/services/menu-showcase';

interface TemplateSelectorProps {
  currentSettings: MenuDisplaySettings;
  onSettingsChange: (settings: MenuDisplaySettings) => void;
  onPreview: (settings: MenuDisplaySettings) => void;
}

export function TemplateSelector({ 
  currentSettings, 
  onSettingsChange, 
  onPreview 
}: TemplateSelectorProps) {
  const [settings, setSettings] = useState<MenuDisplaySettings>(currentSettings);
  const availableTemplates = menuShowcaseService.getAvailableTemplates();

  const updateSettings = (updates: Partial<MenuDisplaySettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = availableTemplates.find(t => t.id === templateId);
    if (template) {
      updateSettings({
        template: template.template
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Menu Template Settings</h2>
          <p className="text-muted-foreground">
            Customize how your menu appears to customers
          </p>
        </div>
        <Button onClick={() => onPreview(settings)} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>

      <Tabs defaultValue="template" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="template">
            <Layout className="h-4 w-4 mr-2" />
            Template
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="features">
            <Settings className="h-4 w-4 mr-2" />
            Features
          </TabsTrigger>
        </TabsList>

        {/* Template Selection */}
        <TabsContent value="template" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTemplates.map((template) => (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    settings.template === template.template
                      ? 'ring-2 ring-primary' 
                      : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-md mb-3 flex items-center justify-center">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {template.template}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme selection removed - using single clean template */}

            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                  Customize fonts and text size
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="font-size">Font Size</Label>
                  <Select 
                    value={settings.typography?.font_size || 'medium'} 
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      updateSettings({ 
                        typography: { 
                          heading_font: settings.typography?.heading_font || 'Georgia',
                          body_font: settings.typography?.body_font || 'Inter',
                          font_size: value 
                        } 
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Settings */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Display Options</CardTitle>
                <CardDescription>
                  Choose what information to show
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-prices">Show Prices</Label>
                  <Switch
                    id="show-prices"
                    checked={settings.show_prices}
                    onCheckedChange={(checked) => updateSettings({ show_prices: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-descriptions">Show Descriptions</Label>
                  <Switch
                    id="show-descriptions"
                    checked={settings.show_descriptions}
                    onCheckedChange={(checked) => updateSettings({ show_descriptions: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-images">Show Images</Label>
                  <Switch
                    id="show-images"
                    checked={settings.show_images}
                    onCheckedChange={(checked) => updateSettings({ show_images: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-allergens">Show Allergens</Label>
                  <Switch
                    id="show-allergens"
                    checked={settings.show_allergens}
                    onCheckedChange={(checked) => updateSettings({ show_allergens: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-spice">Show Spice Levels</Label>
                  <Switch
                    id="show-spice"
                    checked={settings.show_spice_levels}
                    onCheckedChange={(checked) => updateSettings({ show_spice_levels: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Features</CardTitle>
                <CardDescription>
                  Enable advanced functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-search">Enable Search</Label>
                  <Switch
                    id="enable-search"
                    checked={settings.enable_search}
                    onCheckedChange={(checked) => updateSettings({ enable_search: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="enable-filters">Enable Category Filters</Label>
                  <Switch
                    id="enable-filters"
                    checked={settings.enable_filters}
                    onCheckedChange={(checked) => updateSettings({ enable_filters: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={() => setSettings(currentSettings)}>
          Reset
        </Button>
        <Button onClick={() => onPreview(settings)}>
          Save & Preview
        </Button>
      </div>
    </div>
  );
}
