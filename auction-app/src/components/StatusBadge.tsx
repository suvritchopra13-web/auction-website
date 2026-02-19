import type { ListingStatus } from '../types';

const statusConfig: Record<ListingStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-800' },
  sold: { label: 'Sold', className: 'bg-blue-100 text-blue-800' },
  expired: { label: 'Expired', className: 'bg-gray-100 text-gray-600' },
  awaiting_payment: { label: 'Awaiting Payment', className: 'bg-yellow-100 text-yellow-800' },
};

const StatusBadge = ({ status }: { status: ListingStatus }) => {
  const config = statusConfig[status] ?? statusConfig.active;
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
