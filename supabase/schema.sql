-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE cuisine_type AS ENUM (
  'italian', 'american', 'mexican', 'asian', 'mediterranean', 'french', 
  'indian', 'thai', 'japanese', 'chinese', 'greek', 'other'
);

CREATE TYPE spice_level AS ENUM ('mild', 'medium', 'hot', 'very-hot');

CREATE TYPE allergen_type AS ENUM (
  'dairy', 'gluten', 'nuts', 'eggs', 'soy', 'shellfish', 'fish', 'sesame'
);

-- Restaurants table
CREATE TABLE restaurants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  cuisine cuisine_type,
  owner_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  website VARCHAR(255),
  logo_url TEXT,
  
  -- Business hours (stored as JSON)
  hours JSONB DEFAULT '{}',
  
  -- Settings
  settings JSONB DEFAULT '{
    "currency": "RON",
    "showNutrition": true,
    "showAllergens": true,
    "showIngredients": true
  }',
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menus table
CREATE TABLE menus (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,

  -- Menu scheduling
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  active_from TIME, -- Time of day when menu becomes active
  active_to TIME,   -- Time of day when menu becomes inactive
  active_days INTEGER[], -- Array of weekdays (0=Sunday, 1=Monday, etc.)
  start_date DATE,  -- Optional start date for seasonal menus
  end_date DATE,    -- Optional end date for seasonal menus

  -- Display settings
  currency VARCHAR(3) DEFAULT 'RON' CHECK (currency IN ('RON', 'EUR', 'USD')),
  sort_order INTEGER DEFAULT 0,

  -- SEO fields
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Image
  image_url TEXT,
  image_alt TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique slug per restaurant
  UNIQUE(restaurant_id, slug)
);

-- Categories table (now belongs to menus)
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  menu_id UUID REFERENCES menus(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  -- SEO fields
  meta_title VARCHAR(255),
  meta_description TEXT,

  -- Image
  image_url TEXT,
  image_alt TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique slug per menu
  UNIQUE(menu_id, slug)
);

-- Products table (formerly menu_items - now independent of categories)
CREATE TABLE products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  long_description TEXT,

  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),

  -- Content
  ingredients TEXT,
  allergens allergen_type[],

  -- Additional details
  preparation_time VARCHAR(100),
  spice_level spice_level,
  serving_size VARCHAR(100),

  -- Nutritional info (stored as JSON for flexibility)
  nutritional_info JSONB DEFAULT '{}',

  -- Display settings
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,

  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for many-to-many relationship between categories and products
CREATE TABLE category_products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure unique product per category
  UNIQUE(category_id, product_id)
);

-- Product images table for gallery support (one-to-many with products)
CREATE TABLE product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  s3_key TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX idx_menus_restaurant_id ON menus(restaurant_id);
CREATE INDEX idx_menus_slug ON menus(restaurant_id, slug);
CREATE INDEX idx_menus_active ON menus(restaurant_id, is_active);
CREATE INDEX idx_categories_menu_id ON categories(menu_id);
CREATE INDEX idx_categories_slug ON categories(menu_id, slug);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_category_products_category_id ON category_products(category_id);
CREATE INDEX idx_category_products_product_id ON category_products(product_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = true;

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_images_updated_at BEFORE UPDATE ON product_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Restaurants policies
CREATE POLICY "Users can view all active restaurants" ON restaurants
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own restaurants" ON restaurants
  FOR ALL USING (auth.uid() = user_id);

-- Menus policies
CREATE POLICY "Anyone can view active menus" ON menus
  FOR SELECT USING (is_active = true);

CREATE POLICY "Restaurant owners can manage their menus" ON menus
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Categories policies
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Restaurant owners can manage their categories" ON categories
  FOR ALL USING (
    menu_id IN (
      SELECT m.id FROM menus m
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

-- Products policies
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert products (ownership enforced via category_products)
CREATE POLICY "Authenticated users can create products" ON products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only allow updates/deletes to products owned through category_products chain
CREATE POLICY "Restaurant owners can update their products" ON products
  FOR UPDATE USING (
    id IN (
      SELECT cp.product_id FROM category_products cp
      JOIN categories c ON cp.category_id = c.id
      JOIN menus m ON c.menu_id = m.id
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can delete their products" ON products
  FOR DELETE USING (
    id IN (
      SELECT cp.product_id FROM category_products cp
      JOIN categories c ON cp.category_id = c.id
      JOIN menus m ON c.menu_id = m.id
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

-- Category products policies
CREATE POLICY "Anyone can view category products" ON category_products
  FOR SELECT USING (true);

CREATE POLICY "Restaurant owners can manage their category products" ON category_products
  FOR ALL USING (
    category_id IN (
      SELECT c.id FROM categories c
      JOIN menus m ON c.menu_id = m.id
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );

-- Product images policies
CREATE POLICY "Anyone can view product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Restaurant owners can manage their product images" ON product_images
  FOR ALL USING (
    product_id IN (
      SELECT p.id FROM products p
      JOIN category_products cp ON p.id = cp.product_id
      JOIN categories c ON cp.category_id = c.id
      JOIN menus m ON c.menu_id = m.id
      JOIN restaurants r ON m.restaurant_id = r.id
      WHERE r.user_id = auth.uid()
    )
  );
