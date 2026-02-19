import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardTabs from '../../components/DashboardTabs';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Listing } from '../../types';
import { centsToDollars, formatDate } from '../../utils/helpers';

const DashboardExpired = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('seller_id', user!.id)
      .eq('status', 'expired')
      .order('created_at', { ascending: false });
    setListings(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchListings(); }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this listing?')) return;
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Deleted'); setListings(p => p.filter(l => l.id !== id)); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Expired Listings</h1>
        <p className="text-gray-500 mt-1 text-sm">Listings that have passed their auction end date without selling</p>
      </div>

      <DashboardTabs />

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No expired listings.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  {['Listing', 'Expired', 'Final Price', 'Start Price', 'Status', ''].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {listings.map(listing => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link to={`/listings/${listing.slug}`} className="font-medium text-gray-900 hover:text-blue-600 text-sm">{listing.title}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(listing.expires_at)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{centsToDollars(listing.current_price)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{centsToDollars(listing.start_price)}</td>
                    <td className="px-6 py-4"><StatusBadge status={listing.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(listing.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardExpired;
