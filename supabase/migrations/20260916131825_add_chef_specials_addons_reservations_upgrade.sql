/*
# Add Chef Specials, Add-ons, and Reservation Enhancements

1. New Tables
- `chef_specials` — stores the 4 Chef Special sub-categories (Special Edition Meal, Today's Menu, Combo Meal, Vegan Option)
  - id (bigint identity PK)
  - name (text, not null) — dish name
  - special_type (text, not null) — one of: 'special_edition', 'todays_menu', 'combo_meal', 'vegan_option'
  - price (numeric, not null) — price attached to each item
  - description (text, nullable)
  - image_url (text, nullable)
  - is_todays_meal (boolean, default false) — toggled in admin; only one item should be true at a time per type
  - available (boolean, default true)
  - sort_order (int, default 0)
  - created_at (timestamptz)

2. Modified Tables
- `menu_items` — add `addons` jsonb column (nullable) to store add-on options per meal
  - `reservations` — add `cooking_service` boolean and `reservation_type` text column for special cooking service bookings

3. Settings
- Insert `notification_email` setting with value 'hello.nielle@gmail.com'

4. Security (RLS)
- chef_specials: public SELECT (anon), admin write (authenticated)
- menu_items addons column: covered by existing policies
- reservations new columns: covered by existing policies
*/

-- Create chef_specials table
CREATE TABLE IF NOT EXISTS chef_specials (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  special_type text NOT NULL CHECK (special_type IN ('special_edition', 'todays_menu', 'combo_meal', 'vegan_option')),
  price numeric(10,2) NOT NULL,
  description text,
  image_url text,
  is_todays_meal boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chef_specials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_chef_specials" ON chef_specials;
CREATE POLICY "public_read_chef_specials" ON chef_specials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_chef_specials" ON chef_specials;
CREATE POLICY "admin_insert_chef_specials" ON chef_specials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_chef_specials" ON chef_specials;
CREATE POLICY "admin_update_chef_specials" ON chef_specials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_chef_specials" ON chef_specials;
CREATE POLICY "admin_delete_chef_specials" ON chef_specials FOR DELETE
  TO authenticated USING (true);

-- Add addons column to menu_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'menu_items' AND column_name = 'addons'
  ) THEN
    ALTER TABLE menu_items ADD COLUMN addons jsonb;
  END IF;
END $$;

-- Add cooking_service and reservation_type columns to reservations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'cooking_service'
  ) THEN
    ALTER TABLE reservations ADD COLUMN cooking_service boolean NOT NULL DEFAULT false;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'reservation_type'
  ) THEN
    ALTER TABLE reservations ADD COLUMN reservation_type text NOT NULL DEFAULT 'dining';
  END IF;
END $$;

-- Insert notification email setting
INSERT INTO settings (key, value)
VALUES ('notification_email', 'hello.nielle@gmail.com')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Insert default chef specials seed data
INSERT INTO chef_specials (name, special_type, price, description, sort_order) VALUES
  ('Special Edition Jollof', 'special_edition', 14.00, 'Our signature jollof rice with a special twist', 1),
  ('Chef''s Pepper Soup', 'special_edition', 12.00, 'Rich spicy pepper soup with fresh fish', 2),
  ('Today''s Special Rice', 'todays_menu', 10.00, 'Freshly cooked rice dish of the day', 1),
  ('Combo Jollof & Chicken', 'combo_meal', 16.00, 'Jollof rice with grilled chicken and plantain', 1),
  ('Combo Beans & Plantain', 'combo_meal', 14.00, 'Beans porridge with fried plantain and stew', 2),
  ('Vegan Vegetable Soup', 'vegan_option', 11.00, 'Rich vegetable soup with assorted greens', 1),
  ('Vegan Bean Stew', 'vegan_option', 10.00, 'Hearty bean stew with peppers and spices', 2)
ON CONFLICT DO NOTHING;
