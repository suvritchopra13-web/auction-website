import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListingCard from '../components/ListingCard';
import { supabase } from '../lib/supabase';
import type { Listing } from '../types';

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await supabase
        .from('listings')
        .select('*, profiles(username, avatar_url)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(6);
      setFeaturedListings(data ?? []);
      setLoading(false);
    };
    fetchListings();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live Auctions Available
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Buy & Sell at<br />Auction
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Discover unique items, place competitive bids, and sell your own goods — all in one place. Real-time auctions with instant updates.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/listings"
                className="px-8 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Browse Listings
              </Link>
              <Link
                to="/auth/signup"
                className="px-8 py-3 bg-blue-500/40 text-white border border-blue-400 rounded-xl font-semibold hover:bg-blue-500/60 transition-colors"
              >
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10K+', label: 'Active Listings' },
              { value: '50K+', label: 'Happy Bidders' },
              { value: '$2M+', label: 'Items Sold' },
              { value: '99.9%', label: 'Uptime' },
            ].map(stat => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Auctions</h2>
            <p className="text-gray-500 mt-1 text-sm">Ending soon — place your bid now</p>
          </div>
          <Link to="/listings" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center gap-1">
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500 mb-6">Be the first to create an auction listing!</p>
            <Link to="/sell" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Create a Listing
            </Link>
          </div>
        )}
      </section>

      <section className="bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
            <p className="text-gray-500 mt-2">Get started in just a few steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create an account',
                description: 'Sign up for free and complete your profile to start buying and selling.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                ),
              },
              {
                step: '02',
                title: 'List your item',
                description: 'Upload photos, set a starting price, and choose your auction duration.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                ),
              },
              {
                step: '03',
                title: 'Bid & win',
                description: 'Place bids on items you love. The highest bidder when time runs out wins.',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <div className="text-xs font-bold text-blue-600 mb-2 tracking-wider uppercase">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
