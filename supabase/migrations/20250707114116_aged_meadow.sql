/*
  # Restaurant Management Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `key` (text, unique)
      - `label` (text)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `menu_items`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `category_key` (text, foreign key)
      - `is_vegetarian` (boolean, default false)
      - `is_spicy` (boolean, default false)
      - `order_index` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage data
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  label text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  category_key text NOT NULL REFERENCES categories(key) ON UPDATE CASCADE,
  is_vegetarian boolean DEFAULT false,
  is_spicy boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories are manageable by authenticated users"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for menu items
CREATE POLICY "Menu items are viewable by everyone"
  ON menu_items
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Menu items are manageable by authenticated users"
  ON menu_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (key, label, order_index) VALUES
  ('mezze', 'Mezze & Appetizers', 1),
  ('salads', 'Fresh Salads', 2),
  ('mains', 'Main Courses', 3),
  ('desserts', 'Traditional Desserts', 4),
  ('beverages', 'Beverages', 5),
  ('bread', 'Bread & Flatbreads', 6)
ON CONFLICT (key) DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, category_key, is_vegetarian, is_spicy, order_index) VALUES
  ('Hummus', 'Classic chickpea dip with tahini, olive oil, and spices', 8.99, 'mezze', true, false, 1),
  ('Baba Ganoush', 'Roasted eggplant puree with tahini and garlic', 9.99, 'mezze', true, false, 2),
  ('Kibbeh', 'Deep-fried bulgur shells stuffed with spiced meat', 12.99, 'mezze', false, false, 3),
  ('Fattoush', 'Mixed greens with crispy pita chips and sumac dressing', 11.99, 'salads', true, false, 1),
  ('Grilled Lamb Kabab', 'Tender marinated lamb grilled to perfection with herbs', 24.99, 'mains', false, false, 1),
  ('Chicken Shawarma', 'Marinated chicken with garlic sauce and pickles', 18.99, 'mains', false, false, 2),
  ('Mansaf', 'Traditional lamb and rice dish with jameed sauce', 26.99, 'mains', false, false, 3),
  ('Baklava', 'Layers of phyllo pastry with nuts and honey', 6.99, 'desserts', true, false, 1),
  ('Kunafa', 'Sweet cheese pastry with crispy kadaif and syrup', 8.99, 'desserts', true, false, 2),
  ('Arabic Coffee', 'Traditional cardamom-spiced coffee', 4.99, 'beverages', true, false, 1),
  ('Fresh Mint Tea', 'Refreshing mint tea served hot', 3.99, 'beverages', true, false, 2),
  ('Pita Bread', 'Freshly baked traditional pita bread', 2.99, 'bread', true, false, 1)
ON CONFLICT DO NOTHING;