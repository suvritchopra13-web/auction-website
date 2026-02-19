import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ListingCard from '../../components/ListingCard';
import { supabase } from '../../lib/supabase';
import type { Listing } from '../../types';

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchQuery);
  const [filter, setFilter] = useState<'active' | 'all'>('active');

  const fetchListings = async (query: string, statusFilter: 'active' | 'all') => {
    setLoading(true);
    let req = supabase
      .from('listings')
      .select('*, profiles(username, avatar_url)')
      .order('created_at', { ascending: false });

    if (statusFilter === 'active') req = req.eq('status', 'active');
    if (query) req = req.ilike('title', `%${query}%`);

    const { data } = await req;
    setListings(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings(searchQuery, filter);
  }, [searchQuery, filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchParams({ search: search.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearch('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Browse Auctions</h1>
        <p className="text-gray-500 text-sm">
          {searchQuery ? `Showing results for "${searchQuery}"` : 'Discover items up for auction'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="block w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Search
          </button>
          {searchQuery && (
            <button type="button" onClick={clearSearch} className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Clear
            </button>
          )}
        </form>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${filter === 'active' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            All
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length > 0 ? (
        <>
          <p className="text-sm text-gray-500 mb-4">{listings.length} listing{listings.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-500 text-sm">
            {searchQuery ? `No results for "${searchQuery}". Try different keywords.` : 'There are no listings yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Listings;
