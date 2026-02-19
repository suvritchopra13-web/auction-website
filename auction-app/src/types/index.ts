export type ListingStatus = 'active' | 'sold' | 'expired' | 'awaiting_payment';

export interface Profile {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  about: string;
  country: string;
  avatar_url: string;
  created_at: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  slug: string;
  image_url: string;
  start_price: number;
  current_price: number;
  status: ListingStatus;
  seller_id: string;
  current_winner_id: string | null;
  expires_at: string;
  created_at: string;
  profiles?: Profile;
}

export interface Bid {
  id: string;
  listing_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
  listings?: Listing;
  profiles?: Profile;
}

export interface AuthUser {
  id: string;
  email: string;
}
