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
    "currency": "USD",
    "showNutrition": true,
    "showAllergens": true,
    "showIngredients": true
  }',
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
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
  
  -- Ensure unique slug per restaurant
  UNIQUE(restaurant_id, slug)
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
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
  
  -- Image
  image_url TEXT,
  image_alt TEXT,
  
  -- Display settings
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique slug per restaurant
  UNIQUE(restaurant_id, slug)
);

-- Media files table
CREATE TABLE media_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INTEGER,
  height INTEGER,
  
  -- Storage paths
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Organization
  folder VARCHAR(100) DEFAULT 'general',
  
  -- Usage tracking
  used_in_type VARCHAR(50), -- 'restaurant', 'category', 'menu_item'
  used_in_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX idx_categories_restaurant_id ON categories(restaurant_id);
CREATE INDEX idx_categories_slug ON categories(restaurant_id, slug);
CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_menu_items_slug ON menu_items(restaurant_id, slug);
CREATE INDEX idx_media_files_restaurant_id ON media_files(restaurant_id);

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

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_files_updated_at BEFORE UPDATE ON media_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Restaurants policies
CREATE POLICY "Users can view all active restaurants" ON restaurants
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage their own restaurants" ON restaurants
  FOR ALL USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Anyone can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Restaurant owners can manage their categories" ON categories
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Menu items policies
CREATE POLICY "Anyone can view active menu items" ON menu_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Restaurant owners can manage their menu items" ON menu_items
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Media files policies
CREATE POLICY "Anyone can view media files" ON media_files
  FOR SELECT USING (true);

CREATE POLICY "Restaurant owners can manage their media files" ON media_files
  FOR ALL USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );
