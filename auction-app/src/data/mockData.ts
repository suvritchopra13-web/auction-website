import type { Bid, Listing, Profile } from '../types';

export const MOCK_PROFILES: Profile[] = [
  { id: 'user-1', username: 'vintagevault', first_name: 'James', last_name: 'Hartley', about: 'Collector of rare vintage items.', country: 'US', avatar_url: '', created_at: '2024-01-10T00:00:00Z' },
  { id: 'user-2', username: 'techtrader99', first_name: 'Sophia', last_name: 'Chen', about: 'Electronics enthusiast and reseller.', country: 'CA', avatar_url: '', created_at: '2024-02-14T00:00:00Z' },
  { id: 'user-3', username: 'artisangoods', first_name: 'Marco', last_name: 'Russo', about: 'Handcrafted goods and antiques.', country: 'IT', avatar_url: '', created_at: '2024-03-01T00:00:00Z' },
];

const future = (hours: number) => new Date(Date.now() + hours * 3_600_000).toISOString();

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'listing-1',
    title: 'Vintage Leica M3 Camera — 1956',
    description: 'Exceptionally well-preserved Leica M3 double-stroke rangefinder. All mechanics smooth. Original leather case included.',
    slug: 'vintage-leica-m3-camera-1956-abc123',
    image_url: 'https://images.pexels.com/photos/821651/pexels-photo-821651.jpeg?auto=compress&cs=tinysrgb&w=800',
    start_price: 45000,
    current_price: 87500,
    status: 'active',
    seller_id: 'user-1',
    current_winner_id: 'user-2',
    expires_at: future(3.5),
    created_at: '2025-02-01T10:00:00Z',
    profiles: MOCK_PROFILES[0],
  },
  {
    id: 'listing-2',
    title: 'Apple MacBook Pro 16" M3 Max — Like New',
    description: 'Barely used MacBook Pro with M3 Max chip, 64GB RAM, 1TB SSD. AppleCare+ until 2027. Perfect condition.',
    slug: 'apple-macbook-pro-16-m3-max-def456',
    image_url: 'https://images.pexels.com/photos/812264/pexels-photo-812264.jpeg?auto=compress&cs=tinysrgb&w=800',
    start_price: 150000,
    current_price: 198000,
    status: 'active',
    seller_id: 'user-2',
    current_winner_id: 'user-3',
    expires_at: future(11),
    created_at: '2025-02-05T09:00:00Z',
    profiles: MOCK_PROFILES[1],
  },
  {
    id: 'listing-3',
    title: 'Hand-carved Walnut Writing Desk',
    description: 'Custom artisan writing desk in solid black walnut. Dovetail joinery, oil finish, brass hardware. One of a kind.',
    slug: 'hand-carved-walnut-writing-desk-ghi789',
    image_url: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=800',
    start_price: 60000,
    current_price: 72000,
    status: 'active',
    seller_id: 'user-3',
    current_winner_id: null,
    expires_at: future(26),
    created_at: '2025-02-08T11:00:00Z',
    profiles: MOCK_PROFILES[2],
  },
  {
    id: 'listing-4',
    title: 'Rolex Submariner 16610 — Box & Papers',
    description: 'Rolex Submariner Date ref. 16610, complete set with original box, papers dated 2003. Full service history.',
    slug: 'rolex-submariner-16610-jkl012',
    image_url: 'https://images.pexels.com/photos/125779/pexels-photo-125779.jpeg?auto=compress&cs=tinysrgb&w=800',
    start_price: 700000,
    current_price: 845000,
    status: 'active',
    seller_id: 'user-1',
    current_winner_id: 'user-2',
    expires_at: future(48),
    created_at: '2025-02-10T14:00:00Z',
    profiles: MOCK_PROFILES[0],
  },
  {
    id: 'listing-5',
    title: 'Gibson Les Paul Standard 1959 Reissue',
    description: 'Gibson Custom Shop 1959 Les Paul Standard Reissue. Aged finish, Brazilian rosewood board, hand-wired electronics.',
    slug: 'gibson-les-paul-1959-reissue-mno345',
    image_url: 'https://images.pexels.com/photos/165971/pexels-photo-165971.jpeg?auto=compress&cs=tinysrgb&w=800',
    start_price: 380000,
    current_price: 412000,
    status: 'active',
    seller_id: 'user-2',
    current_winner_id: null,
    expires_at: future(6),
    created_at: '2025-02-12T08:00:00Z',
    profiles: MOCK_PROFILES[1],
  },
  {
    id: 'listing-6',
    title: 'First Edition — The Great Gatsby (1925)',
    description: 'First edition, first printing of F. Scott Fitzgerald\'s The Great Gatsby. Original dust jacket, minor wear.',
    slug: 'first-edition-great-gatsby-pqr678',
    image_url: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=800',
    start_price: 120000,
    current_price: 155000,
    status: 'active',
    seller_id: 'user-3',
    current_winner_id: 'user-1',
    expires_at: future(1.2),
    created_at: '2025-02-14T16:00:00Z',
    profiles: MOCK_PROFILES[2],
  },
];

export const MOCK_BIDS: Bid[] = [
  { id: 'bid-1', listing_id: 'listing-1', bidder_id: 'user-2', amount: 87500, created_at: '2025-02-18T10:00:00Z', listings: MOCK_LISTINGS[0], profiles: MOCK_PROFILES[1] },
  { id: 'bid-2', listing_id: 'listing-1', bidder_id: 'user-3', amount: 75000, created_at: '2025-02-17T15:00:00Z', listings: MOCK_LISTINGS[0], profiles: MOCK_PROFILES[2] },
  { id: 'bid-3', listing_id: 'listing-2', bidder_id: 'user-3', amount: 198000, created_at: '2025-02-18T11:00:00Z', listings: MOCK_LISTINGS[1], profiles: MOCK_PROFILES[2] },
  { id: 'bid-4', listing_id: 'listing-4', bidder_id: 'user-2', amount: 845000, created_at: '2025-02-18T12:30:00Z', listings: MOCK_LISTINGS[3], profiles: MOCK_PROFILES[1] },
  { id: 'bid-5', listing_id: 'listing-6', bidder_id: 'user-1', amount: 155000, created_at: '2025-02-18T09:00:00Z', listings: MOCK_LISTINGS[5], profiles: MOCK_PROFILES[0] },
];

export type TickerEvent = {
  id: string;
  type: 'bid' | 'sold' | 'new';
  listingTitle: string;
  username: string;
  amount?: number;
  slug: string;
};

export const MOCK_TICKER_EVENTS: TickerEvent[] = [
  { id: 't1', type: 'bid',  listingTitle: 'Vintage Leica M3 Camera', username: 'techtrader99', amount: 87500,  slug: 'vintage-leica-m3-camera-1956-abc123' },
  { id: 't2', type: 'bid',  listingTitle: 'Rolex Submariner 16610',  username: 'techtrader99', amount: 845000, slug: 'rolex-submariner-16610-jkl012' },
  { id: 't3', type: 'new',  listingTitle: 'Gibson Les Paul 1959 Reissue', username: 'techtrader99', slug: 'gibson-les-paul-1959-reissue-mno345' },
  { id: 't4', type: 'bid',  listingTitle: 'Apple MacBook Pro M3 Max', username: 'artisangoods', amount: 198000, slug: 'apple-macbook-pro-16-m3-max-def456' },
  { id: 't5', type: 'sold', listingTitle: 'First Edition — The Great Gatsby', username: 'vintagevault', amount: 155000, slug: 'first-edition-great-gatsby-pqr678' },
  { id: 't6', type: 'bid',  listingTitle: 'Hand-carved Walnut Writing Desk', username: 'vintagevault', amount: 72000, slug: 'hand-carved-walnut-writing-desk-ghi789' },
  { id: 't7', type: 'new',  listingTitle: 'Rolex Submariner 16610', username: 'vintagevault', slug: 'rolex-submariner-16610-jkl012' },
  { id: 't8', type: 'bid',  listingTitle: 'First Edition — The Great Gatsby', username: 'artisangoods', amount: 140000, slug: 'first-edition-great-gatsby-pqr678' },
];
