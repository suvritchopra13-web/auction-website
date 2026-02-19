import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { MOCK_LISTINGS } from '../data/mockData';
import { useAppStore } from '../store/useAppStore';
import { centsToDollars } from '../utils/helpers';

const BID_INCREMENTS = [500, 1000, 2500, 5000, 7500, 10000];

const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomIncrement = () => randomPick(BID_INCREMENTS);

export const DemoModeEngine = () => {
  const { isDemoMode, demoListings, updateDemoListing, setDemoListings, pushTickerEvent } = useAppStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!isDemoMode) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      initialized.current = false;
      return;
    }

    if (!initialized.current) {
      setDemoListings(MOCK_LISTINGS.map((l) => ({ ...l })));
      initialized.current = true;
    }

    intervalRef.current = setInterval(() => {
      const store = useAppStore.getState();
      if (!store.isDemoMode || store.demoListings.length === 0) return;

      const active = store.demoListings.filter((l) => l.status === 'active');
      if (active.length === 0) return;

      const listing = randomPick(active);
      const inc = randomIncrement();
      const newPrice = listing.current_price + inc;

      updateDemoListing(listing.id, { current_price: newPrice });

      const bidders = ['vintagevault', 'techtrader99', 'artisangoods', 'collector42', 'raregoods_eu'];
      const username = randomPick(bidders);

      pushTickerEvent({
        id: `demo-${Date.now()}`,
        type: 'bid',
        listingTitle: listing.title,
        username,
        amount: newPrice,
        slug: listing.slug,
      });

      toast.info(
        `${username} bid ${centsToDollars(newPrice)} on "${listing.title.slice(0, 32)}…"`,
        { toastId: `demo-bid-${listing.id}`, updateId: `demo-bid-${listing.id}` }
      );
    }, 4500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isDemoMode, demoListings.length, updateDemoListing, setDemoListings, pushTickerEvent]);

  return null;
};
