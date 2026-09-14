/*
# Create menu_items and orders tables

1. New Tables
- `menu_items`: stores all dishes available for ordering.
  - id (uuid, PK)
  - name (text, not null) — dish name
  - description (text, nullable) — short description
  - category (text, not null) — e.g. "Rice Dishes", "Pepper Soups"
  - sizes (jsonb, nullable) — array of size objects: [{label: "Small", price: 8}, ...]
  - price (numeric, nullable) — base price when no sizes; null means "Price on request"
  - pairs (jsonb, nullable) — array of strings for "Pairs well with" chips
  - featured (boolean, default false) — shown on homepage
  - moq_required (boolean, default false) — minimum order quantity badge
  - available (boolean, default true) — only true items shown on menu
  - sort_order (int, default 0) — display ordering
  - created_at (timestamptz)

- `orders`: stores orders submitted via the email checkout form.
  - id (uuid, PK)
  - full_name (text, not null)
  - phone (text, not null)
  - email (text, not null)
  - order_type (text, not null) — "Dine In", "Collection", or "Delivery"
  - delivery_address (text, nullable)
  - preferred_datetime (text, nullable)
  - items (jsonb, not null) — array of {name, size, quantity, price}
  - total (numeric, not null)
  - special_requests (text, nullable)
  - status (text, default 'pending')
  - created_at (timestamptz)

2. Security
- Enable RLS on both tables.
- menu_items: anon+authenticated can SELECT (public menu data). No writes from frontend.
- orders: anon+authenticated can INSERT (customers submit orders). No SELECT/UPDATE/DELETE from frontend (orders are managed server-side).
*/

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  sizes jsonb,
  price numeric(10,2),
  pairs jsonb,
  featured boolean NOT NULL DEFAULT false,
  moq_required boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_menu_items" ON menu_items;
CREATE POLICY "anon_select_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  order_type text NOT NULL,
  delivery_address text,
  preferred_datetime text,
  items jsonb NOT NULL,
  total numeric(10,2) NOT NULL,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);
