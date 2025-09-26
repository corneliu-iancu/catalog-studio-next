import { z } from 'zod';

// Validation schema for allergens and spice levels based on database enums
const allergenTypes = ['dairy', 'gluten', 'nuts', 'eggs', 'soy', 'shellfish', 'fish', 'sesame'] as const;
const spiceLevels = ['mild', 'medium', 'hot', 'very-hot'] as const;

// CSV row schema for menu items
export const csvMenuItemSchema = z.object({
  category_name: z.string().min(1, 'Category name is required').max(255),
  item_name: z.string().min(1, 'Item name is required').max(255),
  description: z.string().min(1, 'Description is required'),
  long_description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number (e.g., 15.50)'),
  discount_price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Discount price must be a valid number').optional().or(z.literal('')),
  ingredients: z.string().optional(),
  allergens: z.string().optional(), // Comma-separated allergens
  spice_level: z.enum(spiceLevels).optional().or(z.literal('')),
  preparation_time: z.string().max(100).optional(),
  serving_size: z.string().max(100).optional(),
  is_featured: z.enum(['true', 'false', 'TRUE', 'FALSE', '1', '0', '']).optional(),
  category_description: z.string().optional(),
  sort_order: z.string().regex(/^\d+$/, 'Sort order must be a number').optional(),
});

export type CsvMenuItemRow = z.infer<typeof csvMenuItemSchema>;

// Processed data types for database insertion
export interface ProcessedCategory {
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
}

export interface ProcessedMenuItem {
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  price: number;
  discount_price?: number;
  ingredients?: string;
  allergens: string[];
  spice_level?: 'mild' | 'medium' | 'hot' | 'very-hot';
  preparation_time?: string;
  serving_size?: string;
  is_active: boolean;
  is_featured: boolean;
}

export interface ProcessedImportData {
  categories: (ProcessedCategory & { items: ProcessedMenuItem[] })[];
  totalItems: number;
  totalCategories: number;
}

// Validation error types
export interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: string;
}

export interface ImportValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
  data?: ProcessedImportData;
}

// Required CSV headers (in order)
export const REQUIRED_CSV_HEADERS = [
  'category_name',
  'item_name', 
  'description',
  'price',
] as const;

export const OPTIONAL_CSV_HEADERS = [
  'long_description',
  'discount_price',
  'ingredients',
  'allergens',
  'spice_level',
  'preparation_time',
  'serving_size',
  'is_featured',
  'category_description',
  'sort_order',
] as const;

export const ALL_CSV_HEADERS = [...REQUIRED_CSV_HEADERS, ...OPTIONAL_CSV_HEADERS] as const;

// Helper constants
export const VALID_ALLERGENS = allergenTypes;
export const VALID_SPICE_LEVELS = spiceLevels;

// Sample CSV data for download template
export const SAMPLE_CSV_DATA = `category_name,item_name,description,price,long_description,discount_price,ingredients,allergens,spice_level,preparation_time,serving_size,is_featured,category_description,sort_order
Appetizers,Bruschetta,Fresh tomatoes with basil on toasted bread,12.50,Our signature bruschetta made with vine-ripened tomatoes and fresh basil leaves,,"Tomatoes, basil, garlic, olive oil",gluten,mild,10 minutes,2 pieces,true,Start your meal with our delicious appetizers,1
Appetizers,Caesar Salad,Crisp romaine with parmesan and croutons,14.00,Classic Caesar salad with house-made dressing,,"Romaine lettuce, parmesan, croutons, anchovies","dairy,gluten,fish",,15 minutes,1 serving,false,,2
Main Courses,Margherita Pizza,Classic pizza with tomato and mozzarella,18.50,Traditional Neapolitan-style pizza with San Marzano tomatoes,16.50,"Tomato sauce, mozzarella, basil, olive oil",dairy,,20 minutes,1 pizza,true,Our carefully crafted main dishes,1
Main Courses,Chicken Parmesan,Breaded chicken with marinara and cheese,22.00,Tender chicken breast topped with our homemade marinara sauce,,"Chicken breast, marinara, mozzarella, parmesan","dairy,gluten",,25 minutes,1 serving,false,,2
Desserts,Tiramisu,Classic Italian dessert,8.50,Traditional tiramisu made with mascarpone and coffee,,"Mascarpone, coffee, ladyfingers, cocoa","dairy,eggs,gluten",,N/A,1 slice,true,Sweet endings to your meal,1`;
