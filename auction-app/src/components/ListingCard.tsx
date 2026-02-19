import { Link } from 'react-router-dom';
import type { Listing } from '../types';
import { centsToDollars } from '../utils/helpers';
import Countdown from './Countdown';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const isExpired = new Date(listing.expires_at) < new Date();

  return (
    <Link to={`/listings/${listing.slug}`} className="block group">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="aspect-video bg-gray-100 overflow-hidden">
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Current bid</p>
              <p className="text-lg font-bold text-gray-900">{centsToDollars(listing.current_price)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-0.5">Time left</p>
              {isExpired ? (
                <span className="text-xs font-semibold text-red-500">Ended</span>
              ) : (
                <p className="text-xs font-semibold text-gray-700">
                  <Countdown expiresAt={listing.expires_at} />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
