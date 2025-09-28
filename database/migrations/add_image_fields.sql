-- Add image fields to menu_items table
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS image_s3_key VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add image fields to restaurants table (for logos)
ALTER TABLE restaurants 
ADD COLUMN IF NOT EXISTS logo_s3_key VARCHAR(255),
ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500);

-- Add image fields to categories table (for category images)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_s3_key VARCHAR(255),
ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_menu_items_image_s3_key ON menu_items(image_s3_key);
CREATE INDEX IF NOT EXISTS idx_restaurants_logo_s3_key ON restaurants(logo_s3_key);
CREATE INDEX IF NOT EXISTS idx_categories_image_s3_key ON categories(image_s3_key);
