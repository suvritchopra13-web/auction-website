import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Countdown from '../../components/Countdown';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Bid, Listing } from '../../types';
import { centsToDollars, formatDate } from '../../utils/helpers';

const ListingDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchListing = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*, profiles(id, username, avatar_url, country)')
      .eq('slug', slug)
      .maybeSingle();
    setListing(data);
  };

  const fetchBids = async (listingId: string) => {
    const { data } = await supabase
      .from('bids')
      .select('*, profiles(username, avatar_url)')
      .eq('listing_id', listingId)
      .order('amount', { ascending: false });
    setBids(data ?? []);
  };

  useEffect(() => {
    const load = async () => {
      await fetchListing();
      setLoading(false);
    };
    load();
  }, [slug]);

  useEffect(() => {
    if (listing) {
      fetchBids(listing.id);

      const channel = supabase
        .channel(`bids-${listing.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bids', filter: `listing_id=eq.${listing.id}` }, () => {
          fetchBids(listing.id);
          fetchListing();
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [listing?.id]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to place a bid');
      return;
    }
    if (!listing) return;

    const amountCents = Math.round(parseFloat(bidAmount) * 100);

    if (isNaN(amountCents) || amountCents <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }
    if (amountCents <= listing.current_price) {
      toast.error(`Bid must be higher than ${centsToDollars(listing.current_price)}`);
      return;
    }
    if (listing.seller_id === user.id) {
      toast.error("You can't bid on your own listing");
      return;
    }

    setSubmitting(true);

    const { error: bidError } = await supabase.from('bids').insert({
      listing_id: listing.id,
      bidder_id: user.id,
      amount: amountCents,
    });

    if (bidError) {
      toast.error('Failed to place bid. Please try again.');
      setSubmitting(false);
      return;
    }

    const { error: updateError } = await supabase
      .from('listings')
      .update({ current_price: amountCents, current_winner_id: user.id })
      .eq('id', listing.id);

    if (updateError) {
      toast.error('Bid placed but failed to update listing price.');
    } else {
      toast.success('Bid placed successfully!');
      setBidAmount('');
      await fetchListing();
      await fetchBids(listing.id);
    }

    setSubmitting(false);
  };

  const handleDeleteBid = async (bidId: string) => {
    if (!listing) return;
    const { error } = await supabase.from('bids').delete().eq('id', bidId);
    if (error) {
      toast.error('Failed to delete bid');
    } else {
      toast.success('Bid removed');
      await fetchBids(listing.id);

      const { data: topBid } = await supabase
        .from('bids')
        .select('amount, bidder_id')
        .eq('listing_id', listing.id)
        .order('amount', { ascending: false })
        .limit(1)
        .maybeSingle();

      await supabase
        .from('listings')
        .update({
          current_price: topBid ? topBid.amount : listing.start_price,
          current_winner_id: topBid ? topBid.bidder_id : null,
        })
        .eq('id', listing.id);

      await fetchListing();
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 aspect-video bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-2/3" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
        <p className="text-gray-500 mb-6">This listing may have been removed or doesn't exist.</p>
        <Link to="/listings" className="text-blue-600 hover:text-blue-500 font-medium">Browse all listings</Link>
      </div>
    );
  }

  const isExpired = new Date(listing.expires_at) < new Date();
  const isOwner = user?.id === listing.seller_id;
  const minBid = (listing.current_price / 100 + 0.01).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700">Home</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/listings" className="hover:text-gray-700">Listings</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium truncate max-w-xs">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
            {listing.image_url ? (
              <img src={listing.image_url} alt={listing.title} className="w-full aspect-video object-cover" />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-gray-100 text-gray-300">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">{listing.title}</h1>
              <StatusBadge status={listing.status} />
            </div>
            {listing.description && (
              <p className="text-gray-600 leading-relaxed">{listing.description}</p>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-700">
                  {(listing.profiles as any)?.username?.[0]?.toUpperCase() ?? 'S'}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500">Seller</p>
                <p className="text-sm font-medium text-gray-900">{(listing.profiles as any)?.username ?? 'Unknown'}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-500">Listed on</p>
                <p className="text-sm text-gray-600">{new Date(listing.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Bid History ({bids.length})</h2>
            {bids.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No bids yet. Be the first!</p>
            ) : (
              <div className="space-y-3">
                {bids.map((bid, i) => (
                  <div key={bid.id} className={`flex items-center justify-between py-3 ${i !== bids.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      {i === 0 && (
                        <span className="text-yellow-500">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </span>
                      )}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-gray-600">
                          {(bid.profiles as any)?.username?.[0]?.toUpperCase() ?? 'B'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{(bid.profiles as any)?.username ?? 'Bidder'}</p>
                        <p className="text-xs text-gray-400">{new Date(bid.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-bold ${i === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                        {centsToDollars(bid.amount)}
                      </span>
                      {user?.id === bid.bidder_id && (
                        <button
                          onClick={() => handleDeleteBid(bid.id)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Current bid</p>
              <p className="text-3xl font-bold text-gray-900">{centsToDollars(listing.current_price)}</p>
              <p className="text-xs text-gray-400 mt-1">Starting price: {centsToDollars(listing.start_price)}</p>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Time remaining</p>
              {isExpired ? (
                <p className="text-red-600 font-semibold">Auction ended</p>
              ) : (
                <p className="text-lg font-bold text-gray-900">
                  <Countdown expiresAt={listing.expires_at} />
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">Ends {formatDate(listing.expires_at)}</p>
            </div>

            {!isExpired && !isOwner && listing.status === 'active' && (
              <form onSubmit={handleBid} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your bid (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min={minBid}
                      value={bidAmount}
                      onChange={e => setBidAmount(e.target.value)}
                      placeholder={minBid}
                      className="block w-full pl-7 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Minimum bid: {centsToDollars(listing.current_price + 1)}</p>
                </div>
                {!user ? (
                  <Link to="/auth/signin" className="block w-full text-center py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    Sign in to bid
                  </Link>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? 'Placing bid...' : 'Place Bid'}
                  </button>
                )}
              </form>
            )}

            {isOwner && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700 text-center">
                This is your listing
              </div>
            )}

            {isExpired && (
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 text-center">
                This auction has ended
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Auction Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total bids</span>
                <span className="font-medium text-gray-900">{bids.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Start price</span>
                <span className="font-medium text-gray-900">{centsToDollars(listing.start_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={listing.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
