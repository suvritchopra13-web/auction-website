/*
  # Auction Website Schema

  ## Tables Created
  - `profiles` - User profile info (linked to auth.users)
    - id, username, first_name, last_name, about, country, avatar_url, created_at
  - `listings` - Auction listings
    - id, title, description, slug, image_url, start_price, current_price, status, seller_id, current_winner_id, expires_at, created_at
  - `bids` - Bids placed on listings
    - id, listing_id, bidder_id, amount, created_at

  ## Security
  - RLS enabled on all tables
  - Profiles: readable by all authenticated, writable only by owner
  - Listings: readable by all, create by authenticated, delete by owner
  - Bids: readable by authenticated, create by authenticated, delete by bidder
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  first_name text DEFAULT '',
  last_name text DEFAULT '',
  about text DEFAULT '',
  country text DEFAULT '',
  avatar_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TYPE listing_status AS ENUM ('active', 'sold', 'expired', 'awaiting_payment');

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  slug text UNIQUE NOT NULL,
  image_url text DEFAULT '',
  start_price integer NOT NULL DEFAULT 0,
  current_price integer NOT NULL DEFAULT 0,
  status listing_status NOT NULL DEFAULT 'active',
  seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_winner_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are viewable by all"
  ON listings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create listings"
  ON listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Owners can update own listings"
  ON listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Owners can delete own listings"
  ON listings FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

CREATE TABLE IF NOT EXISTS bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  bidder_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Bids are viewable by authenticated users"
  ON bids FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create bids"
  ON bids FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = bidder_id);

CREATE POLICY "Bidders can delete own bids"
  ON bids FOR DELETE
  TO authenticated
  USING (auth.uid() = bidder_id);

CREATE INDEX IF NOT EXISTS listings_seller_id_idx ON listings(seller_id);
CREATE INDEX IF NOT EXISTS listings_slug_idx ON listings(slug);
CREATE INDEX IF NOT EXISTS listings_status_idx ON listings(status);
CREATE INDEX IF NOT EXISTS bids_listing_id_idx ON bids(listing_id);
CREATE INDEX IF NOT EXISTS bids_bidder_id_idx ON bids(bidder_id);
