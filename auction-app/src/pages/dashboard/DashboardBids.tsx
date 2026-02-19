import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Countdown from '../../components/Countdown';
import DashboardTabs from '../../components/DashboardTabs';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Bid } from '../../types';
import { centsToDollars } from '../../utils/helpers';

const DashboardBids = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBids = async () => {
    const { data } = await supabase
      .from('bids')
      .select('*, listings(id, title, slug, current_price, status, expires_at, seller_id, profiles(username))')
      .eq('bidder_id', user!.id)
      .order('created_at', { ascending: false });
    setBids(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchBids(); }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this bid?')) return;
    const { error } = await supabase.from('bids').delete().eq('id', id);
    if (error) toast.error('Failed to remove bid');
    else { toast.success('Bid removed'); setBids(p => p.filter(b => b.id !== id)); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Your Bids</h1>
        <p className="text-gray-500 mt-1 text-sm">All bids you've placed across auctions</p>
      </div>

      <DashboardTabs />

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : bids.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 mb-4">You haven't placed any bids yet.</p>
          <Link to="/listings" className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Listing', 'Your Bid', 'Current Price', 'Time Left', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bids.map(bid => {
                  const listing = bid.listings as any;
                  const isWinning = listing && listing.current_price === bid.amount;
                  return (
                    <tr key={bid.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link to={`/listings/${listing?.slug}`} className="font-medium text-gray-900 hover:text-blue-600 text-sm">
                          {listing?.title ?? 'Unknown listing'}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Seller: {listing?.profiles?.username ?? 'Unknown'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${isWinning ? 'text-green-600' : 'text-gray-900'}`}>
                          {centsToDollars(bid.amount)}
                        </span>
                        {isWinning && <span className="ml-2 text-xs text-green-600 font-medium">Winning</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{listing ? centsToDollars(listing.current_price) : '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {listing?.expires_at ? <Countdown expiresAt={listing.expires_at} /> : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {listing?.status && <StatusBadge status={listing.status} />}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {listing?.status === 'active' && (
                          <button onClick={() => handleDelete(bid.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">Remove</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBids;
