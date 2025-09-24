// Template system types for menu showcase

export type TemplateType = 'classic'  // Traditional restaurant menu layout

export type ColorTheme = 
  | 'warm'         // Warm oranges, reds, browns
  | 'cool'         // Blues, greens, grays
  | 'neutral'      // Blacks, whites, grays
  | 'vibrant'      // Bright, energetic colors
  | 'earth'        // Natural, organic tones
  | 'custom'       // User-defined colors

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
  ingredients?: string[];
  allergens?: string[];
  spice_level?: 'mild' | 'medium' | 'hot' | 'very-hot';
  is_featured: boolean;
  sort_order: number;
}

// Template registry - simplified to just Classic template with different themes
export const AVAILABLE_TEMPLATES: TemplateConfig[] = [
  {
    id: 'classic-warm',
    name: 'Classic Warm',
    description: 'Traditional menu with warm, inviting colors',
    type: 'classic',
    theme: 'warm',
    features: [
      { id: 'categories', name: 'Category Sections', description: 'Organized by menu categories', enabled: true },
      { id: 'prices', name: 'Price Display', description: 'Show item prices', enabled: true },
      { id: 'descriptions', name: 'Item Descriptions', description: 'Show detailed descriptions', enabled: true },
    ]
  },
  {
    id: 'classic-cool',
    name: 'Classic Cool',
    description: 'Traditional menu with cool, calming colors',
    type: 'classic',
    theme: 'cool',
    features: [
      { id: 'categories', name: 'Category Sections', description: 'Organized by menu categories', enabled: true },
      { id: 'prices', name: 'Price Display', description: 'Show item prices', enabled: true },
      { id: 'descriptions', name: 'Item Descriptions', description: 'Show detailed descriptions', enabled: true },
    ]
  },
  {
    id: 'classic-neutral',
    name: 'Classic Neutral',
    description: 'Traditional menu with neutral, professional colors',
    type: 'classic',
    theme: 'neutral',
    features: [
      { id: 'categories', name: 'Category Sections', description: 'Organized by menu categories', enabled: true },
      { id: 'prices', name: 'Price Display', description: 'Show item prices', enabled: true },
      { id: 'descriptions', name: 'Item Descriptions', description: 'Show detailed descriptions', enabled: true },
    ]
  },
  {
    id: 'classic-vibrant',
    name: 'Classic Vibrant',
    description: 'Traditional menu with vibrant, energetic colors',
    type: 'classic',
    theme: 'vibrant',
    features: [
      { id: 'categories', name: 'Category Sections', description: 'Organized by menu categories', enabled: true },
      { id: 'prices', name: 'Price Display', description: 'Show item prices', enabled: true },
      { id: 'descriptions', name: 'Item Descriptions', description: 'Show detailed descriptions', enabled: true },
    ]
  },
  {
    id: 'classic-earth',
    name: 'Classic Earth',
    description: 'Traditional menu with natural, earthy colors',
    type: 'classic',
    theme: 'earth',
    features: [
      { id: 'categories', name: 'Category Sections', description: 'Organized by menu categories', enabled: true },
      { id: 'prices', name: 'Price Display', description: 'Show item prices', enabled: true },
      { id: 'descriptions', name: 'Item Descriptions', description: 'Show detailed descriptions', enabled: true },
    ]
  }
];
