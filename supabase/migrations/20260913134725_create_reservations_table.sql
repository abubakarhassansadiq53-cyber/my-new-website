/*
# Create reservations table for ARE restaurant

1. New Tables
- `reservations` — stores table reservation requests submitted via the contact form
  - id (uuid, primary key)
  - full_name (text, required) — guest's full name
  - phone (text, required) — contact phone number
  - email (text, required) — contact email
  - reservation_date (date, required) — requested dining date
  - reservation_time (text, required) — requested dining time slot
  - guests (integer, required) — number of guests (1-20+)
  - occasion (text, optional) — type of occasion
  - special_requests (text, optional) — any special requests/notes
  - status (text, default 'pending') — reservation status
  - created_at (timestamp) — when the request was submitted

2. Security
- Enable RLS on `reservations`.
- This is a no-auth public app: allow anon + authenticated to INSERT new reservations.
- No SELECT/UPDATE/DELETE from the client — only the owner can manage reservations server-side.
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  reservation_date date NOT NULL,
  reservation_time text NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  occasion text,
  special_requests text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_reservations" ON reservations;
CREATE POLICY "anon_insert_reservations"
ON reservations FOR INSERT
TO anon, authenticated
WITH CHECK (true);