-- ============================================
-- AFRICAN RESTAURANT ESTONIA - COMPLETE DATABASE SETUP
-- Paste this entire file into your Supabase SQL Editor
-- Dashboard > SQL Editor > New query > paste > Run
-- ============================================

-- Drop existing tables (safe to re-run)
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-- ============================================
-- CREATE TABLES
-- ============================================

CREATE TABLE menu_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  sizes_available text[],
  pairs_with text[],
  price numeric(10,2),
  image_url text,
  available boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  moq_required boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text NOT NULL,
  order_items jsonb NOT NULL,
  order_total numeric(10,2),
  order_type text NOT NULL DEFAULT 'email',
  delivery_address text,
  preferred_datetime text,
  special_requests text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE reservations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  date date NOT NULL,
  time text NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  occasion text,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE settings (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text,
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- menu_items: Public read, Admin write
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "admin_write_menu_items" ON menu_items FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_menu_items" ON menu_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_menu_items" ON menu_items FOR DELETE
  TO authenticated USING (true);

-- orders: Customers insert, Admin manage
CREATE POLICY "customers_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_manage_orders" ON orders FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- reservations: Customers insert, Admin manage
CREATE POLICY "customers_insert_reservations" ON reservations FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admin_manage_reservations" ON reservations FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "admin_update_reservations" ON reservations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_reservations" ON reservations FOR DELETE
  TO authenticated USING (true);

-- settings: Public read, Admin write
CREATE POLICY "public_read_settings" ON settings FOR SELECT
  TO anon, authenticated USING (true);
CREATE POLICY "admin_write_settings" ON settings FOR INSERT
  TO authenticated WITH CHECK (true);
CREATE POLICY "admin_update_settings" ON settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_delete_settings" ON settings FOR DELETE
  TO authenticated USING (true);

-- ============================================
-- STORAGE BUCKET + POLICIES
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_menu_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'menu-images');
CREATE POLICY "admin_upload_menu_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'menu-images');
CREATE POLICY "admin_update_menu_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'menu-images') WITH CHECK (bucket_id = 'menu-images');
CREATE POLICY "admin_delete_menu_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'menu-images');

-- ============================================
-- SEED OPENING HOURS & CONTACT INFO
-- ============================================

INSERT INTO settings (key, value) VALUES
  ('hours_monday', '{"open":true,"from":"08:00","to":"23:45"}'),
  ('hours_tuesday', '{"open":true,"from":"08:00","to":"23:45"}'),
  ('hours_wednesday', '{"open":true,"from":"08:00","to":"23:45"}'),
  ('hours_thursday', '{"open":true,"from":"08:00","to":"23:45"}'),
  ('hours_friday', '{"open":true,"from":"08:00","to":"23:45"}'),
  ('hours_saturday', '{"open":true,"from":"08:00","to":"23:45"}'),
  ('hours_sunday', '{"open":true,"from":"08:00","to":"23:45"}'),
  ('restaurant_phone', '+372 5307 8208'),
  ('restaurant_whatsapp', 'https://wa.me/37253078208'),
  ('restaurant_email', 'africanrestaurantestonia@gmail.com'),
  ('restaurant_address', 'Nelgi tn 29, 11213 Tallinn, Estonia')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SEED 61 DISHES
-- ============================================

INSERT INTO menu_items (name, category, sizes_available, pairs_with, price, available, featured, moq_required, sort_order) VALUES
-- RICE DISHES (8)
('Jollof Rice', 'Rice Dishes', ARRAY['Small','Medium','Large'], ARRAY['Fried Plantains','Chicken'], 8.00, true, true, false, 1),
('Jollof Rice with Chicken', 'Rice Dishes', ARRAY['Small','Medium','Large'], ARRAY['Coleslaw'], 12.00, true, true, false, 2),
('Jollof Rice with Beef', 'Rice Dishes', ARRAY['Small','Medium','Large'], ARRAY['Fried Plantains'], 13.00, true, false, false, 3),
('Jollof Rice with Fish', 'Rice Dishes', ARRAY['Small','Medium','Large'], ARRAY['Vegetable Salad'], 13.00, true, false, false, 4),
('Coconut Rice', 'Rice Dishes', ARRAY['Small','Medium','Large'], ARRAY['Grilled Chicken'], 10.00, true, false, false, 5),
('Coconut Rice with Chicken', 'Rice Dishes', ARRAY['Small','Medium','Large'], ARRAY['Fried Plantains'], 13.00, true, false, false, 6),
('Fried Rice', 'Rice Dishes', ARRAY['Small','Medium','Large'], ARRAY['Chicken','Beef'], 10.00, true, false, false, 7),
('Special Fried Rice', 'Rice Dishes', ARRAY['Medium','Large'], ARRAY['Prawns','Chicken'], 14.00, true, true, false, 8),

-- BEANS & YAM (5)
('Beans Stew (Ewa Riro)', 'Beans & Yam', ARRAY['Small','Medium','Large'], ARRAY['Fried Plantains','Bread'], 9.00, true, false, false, 9),
('Beans and Fried Plantain', 'Beans & Yam', ARRAY['Small','Medium','Large'], ARRAY['Bread'], 11.00, true, true, false, 10),
('Boiled Yam', 'Beans & Yam', ARRAY['Small','Medium','Large'], ARRAY['Palm Oil Sauce','Egg Sauce'], 8.00, true, false, false, 11),
('Yam Porridge (Asaro)', 'Beans & Yam', ARRAY['Small','Medium','Large'], ARRAY['Fish','Beef'], 10.00, true, false, false, 12),
('Yam and Egg Sauce', 'Beans & Yam', ARRAY['Small','Medium','Large'], ARRAY['Vegetable Salad'], 11.00, true, false, false, 13),

-- PLANTAIN DISHES (3)
('Fried Plantains (Dodo)', 'Plantain Dishes', ARRAY['Small','Medium','Large'], ARRAY['Jollof Rice','Beans'], 6.00, true, true, false, 14),
('Plantain and Egg', 'Plantain Dishes', ARRAY['Small','Medium','Large'], ARRAY['Coleslaw'], 9.00, true, false, false, 15),
('Boli (Grilled Plantain)', 'Plantain Dishes', ARRAY['Small','Medium','Large'], ARRAY['Pepper Sauce','Fish'], 8.00, true, false, false, 16),

-- BEAN CAKES (2)
('Akara (Bean Cakes)', 'Bean Cakes', ARRAY['Small','Medium','Large'], ARRAY['Bread','Pap'], 7.00, true, true, false, 17),
('Moi Moi (Steamed Bean Pudding)', 'Bean Cakes', ARRAY['Small','Medium','Large'], ARRAY['Bread','Custard'], 8.00, true, false, false, 18),

-- PEPPER SOUPS (5)
('Goat Meat Pepper Soup', 'Pepper Soups', ARRAY['Small','Medium','Large'], ARRAY['Bread','Rice'], 12.00, true, true, false, 19),
('Chicken Pepper Soup', 'Pepper Soups', ARRAY['Small','Medium','Large'], ARRAY['Bread','Rice'], 11.00, true, false, false, 20),
('Catfish Pepper Soup', 'Pepper Soups', ARRAY['Small','Medium','Large'], ARRAY['Bread','Rice'], 13.00, true, true, false, 21),
('Assorted Meat Pepper Soup', 'Pepper Soups', ARRAY['Small','Medium','Large'], ARRAY['Bread','Rice'], 12.00, true, false, false, 22),
('Cow Foot Pepper Soup', 'Pepper Soups', ARRAY['Small','Medium','Large'], ARRAY['Bread','Rice'], 11.00, true, false, false, 23),

-- NIGERIAN SOUPS (10)
('Egusi Soup', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 10.00, true, true, false, 24),
('Egusi Soup with Assorted Meat', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 13.00, true, true, false, 25),
('Efo Riro (Vegetable Soup)', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 10.00, true, false, false, 26),
('Efo Riro with Assorted Meat', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 13.00, true, false, false, 27),
('Okra Soup', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 10.00, true, false, false, 28),
('Ogbono Soup', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 10.00, true, false, false, 29),
('Banga Soup', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 11.00, true, false, false, 30),
('Afang Soup', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 11.00, true, false, false, 31),
('Edikang Ikong Soup', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 12.00, true, false, false, 32),
('Bitter Leaf Soup (Ewuro)', 'Nigerian Soups', ARRAY['Small','Medium','Large'], ARRAY['Pounded Yam','Eba','Fufu'], 11.00, true, false, false, 33),

-- PASTA (2)
('Spaghetti Bolognese', 'Pasta', ARRAY['Small','Medium','Large'], ARRAY['Garlic Bread','Salad'], 10.00, true, false, false, 34),
('Jollof Spaghetti', 'Pasta', ARRAY['Small','Medium','Large'], ARRAY['Chicken','Beef'], 9.00, true, false, false, 35),

-- PEPPERED PROTEINS (7)
('Peppered Chicken', 'Peppered Proteins', ARRAY['Small','Medium','Large'], ARRAY['Rice','Plantains'], 12.00, true, true, false, 36),
('Peppered Goat Meat', 'Peppered Proteins', ARRAY['Small','Medium','Large'], ARRAY['Rice','Plantains'], 14.00, true, false, false, 37),
('Peppered Beef', 'Peppered Proteins', ARRAY['Small','Medium','Large'], ARRAY['Rice','Plantains'], 12.00, true, false, false, 38),
('Peppered Fish', 'Peppered Proteins', ARRAY['Small','Medium','Large'], ARRAY['Rice','Plantains'], 13.00, true, false, false, 39),
('Grilled Chicken', 'Peppered Proteins', ARRAY['Small','Medium','Large'], ARRAY['Rice','Salad'], 12.00, true, true, false, 40),
('Suya (Spiced Grilled Beef)', 'Peppered Proteins', ARRAY['Small','Medium','Large'], ARRAY['Onions','Tomatoes'], 13.00, true, true, true, 41),
('Asun (Spicy Goat Meat)', 'Peppered Proteins', ARRAY['Small','Medium','Large'], ARRAY['Onions','Pepper Sauce'], 14.00, true, false, true, 42),

-- SNACKS (8)
('Puff Puff (3 pcs)', 'Snacks', ARRAY['Small','Medium'], ARRAY['Drink'], 5.00, true, true, false, 43),
('Meat Pie', 'Snacks', ARRAY['Small','Medium'], ARRAY['Drink'], 6.00, true, false, false, 44),
('Sausage Roll', 'Snacks', ARRAY['Small','Medium'], ARRAY['Drink'], 5.00, true, false, false, 45),
('Spring Roll (3 pcs)', 'Snacks', ARRAY['Small','Medium'], ARRAY['Drink','Sweet Chili Sauce'], 6.00, true, false, false, 46),
('Scotch Egg', 'Snacks', ARRAY['Small','Medium'], ARRAY['Drink'], 5.00, true, false, false, 47),
('Mosa (Bean Cake Fritters)', 'Snacks', ARRAY['Small','Medium'], ARRAY['Pap','Drink'], 6.00, true, false, false, 48),
('Kuli Kuli (Groundnut Snack)', 'Snacks', ARRAY['Small','Medium'], ARRAY['Drink'], 4.00, true, false, false, 49),
('Chin Chin (Sweet Snack)', 'Snacks', ARRAY['Small','Medium'], ARRAY['Drink'], 4.00, true, false, false, 50),

-- SAUCES (7)
('Pounded Yam', 'Sauces', ARRAY['Small','Medium','Large'], ARRAY['Egusi Soup','Efo Riro'], 5.00, true, false, false, 51),
('Eba (Garri)', 'Sauces', ARRAY['Small','Medium','Large'], ARRAY['Egusi Soup','Okra Soup'], 4.00, true, false, false, 52),
('Fufu', 'Sauces', ARRAY['Small','Medium','Large'], ARRAY['Egusi Soup','Ogbono Soup'], 5.00, true, false, false, 53),
('Semovita', 'Sauces', ARRAY['Small','Medium','Large'], ARRAY['Egusi Soup','Efo Riro'], 5.00, true, false, false, 54),
('Wheat Meal', 'Sauces', ARRAY['Small','Medium','Large'], ARRAY['Egusi Soup','Okra Soup'], 5.00, true, false, false, 55),
('Amala', 'Sauces', ARRAY['Small','Medium','Large'], ARRAY['Ewuro Soup','Gbegiri Soup'], 5.00, true, false, false, 56),
('Coleslaw', 'Sauces', ARRAY['Small','Medium','Large'], ARRAY['Grilled Chicken','Fried Chicken'], 4.00, true, false, false, 57),

-- SPECIAL PROTEINS (4)
('Pepper Soup Assorted Meat Platter', 'Special Proteins', ARRAY['Large'], ARRAY['Bread','Plantains'], 18.00, true, true, true, 58),
('Grilled Fish Platter', 'Special Proteins', ARRAY['Large'], ARRAY['Chips','Salad','Plantains'], 20.00, true, true, true, 59),
('Mixed Grill Platter', 'Special Proteins', ARRAY['Large'], ARRAY['Chips','Salad','Plantains'], 25.00, true, true, true, 60),
('Seafood Okra Platter', 'Special Proteins', ARRAY['Large'], ARRAY['Pounded Yam','Fufu','Eba'], 22.00, true, false, true, 61);

-- ============================================
-- DONE! Now create your admin user:
-- Dashboard > Authentication > Users > Add user
-- Email: admin@africanrestaurantestonia.com
-- Password: AREadmin2026!
-- Auto Confirm User: ON
-- ============================================
