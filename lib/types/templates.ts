// Template system types for menu showcase

export type TemplateType = 'classic' | 'minimal'  // Traditional restaurant menu layout | Minimal layout with just restaurant name

export type ColorTheme = 
  | 'warm'         // Warm oranges, reds, browns
  | 'cool'         // Blues, greens, grays
  | 'neutral'      // Blacks, whites, grays
  | 'vibrant'      // Bright, energetic colors
  | 'earth'        // Natural, organic tones
  | 'custom'       // User-defined colors
  | 'oriental'     // Middle Eastern-inspired design

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  type: TemplateType;
  theme: ColorTheme;
  features: TemplateFeature[];
  preview_image?: string;
  is_premium?: boolean;
}

export interface TemplateFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface MenuDisplaySettings {
  template: TemplateType;
  theme: ColorTheme;
  show_prices: boolean;
  show_descriptions: boolean;
  show_images: boolean;
  show_allergens: boolean;
  show_spice_levels: boolean;
  show_categories: boolean;
  enable_search: boolean;
  enable_filters: boolean;
  custom_colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography?: {
    heading_font: string;
    body_font: string;
    font_size: 'small' | 'medium' | 'large';
  };
  layout?: {
    columns: number;
    spacing: 'compact' | 'normal' | 'spacious';
    border_radius: 'none' | 'small' | 'medium' | 'large';
  };
}

export interface PublicMenuData {
  restaurant: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    cuisine?: string;
    address?: string;
    phone?: string;
    website?: string;
    hours?: Record<string, string>;
  };
  menu: {
    id: string;
    name: string;
    description?: string;
    currency?: string;
    categories: MenuCategory[];
  };
  display_settings: MenuDisplaySettings;
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  price: number;
  discount_price?: number;
  image_url?: string;
  ingredients?: string; // Fixed: should be string, not string[] (matches database schema)
  allergens?: string[];
  spice_level?: 'mild' | 'medium' | 'hot' | 'very-hot';
  is_featured: boolean;
  sort_order: number;
}

// Template registry - single default template
export const AVAILABLE_TEMPLATES: TemplateConfig[] = [
  {
    id: 'default',
    name: 'Default Template',
    description: 'Elegant menu with rich Middle Eastern-inspired design',
    type: 'classic',
    theme: 'oriental',
    features: [
      { id: 'categories', name: 'Category Sections', description: 'Organized by menu categories', enabled: true },
      { id: 'prices', name: 'Price Display', description: 'Show item prices', enabled: true },
      { id: 'descriptions', name: 'Item Descriptions', description: 'Show detailed descriptions', enabled: true },
      { id: 'ornate_patterns', name: 'Ornate Patterns', description: 'Beautiful Middle Eastern decorative elements', enabled: true },
    ]
  }
];
