-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own restaurants" ON restaurants;
DROP POLICY IF EXISTS "Restaurant owners can manage their categories" ON categories;
DROP POLICY IF EXISTS "Restaurant owners can manage their menu items" ON menu_items;
DROP POLICY IF EXISTS "Restaurant owners can manage their media files" ON media_files;

-- Recreate restaurants policies with better INSERT handling
CREATE POLICY "Users can insert their own restaurants" ON restaurants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own restaurants" ON restaurants
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own restaurants" ON restaurants
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own restaurants" ON restaurants
  FOR DELETE USING (auth.uid() = user_id);

-- Categories policies
CREATE POLICY "Restaurant owners can insert categories" ON categories
  FOR INSERT WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can view their categories" ON categories
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update their categories" ON categories
  FOR UPDATE USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can delete their categories" ON categories
  FOR DELETE USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Menu items policies
CREATE POLICY "Restaurant owners can insert menu items" ON menu_items
  FOR INSERT WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can view their menu items" ON menu_items
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update their menu items" ON menu_items
  FOR UPDATE USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can delete their menu items" ON menu_items
  FOR DELETE USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

-- Media files policies
CREATE POLICY "Restaurant owners can insert media files" ON media_files
  FOR INSERT WITH CHECK (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can view their media files" ON media_files
  FOR SELECT USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can update their media files" ON media_files
  FOR UPDATE USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners can delete their media files" ON media_files
  FOR DELETE USING (
    restaurant_id IN (
      SELECT id FROM restaurants WHERE user_id = auth.uid()
    )
  );
