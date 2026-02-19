import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/dashboard/listings', label: 'All Listings' },
  { path: '/dashboard/sold', label: 'Sold' },
  { path: '/dashboard/expired', label: 'Expired' },
  { path: '/dashboard/bids', label: 'Your Bids' },
];

const DashboardTabs = () => {
  return (
    <div className="border-b border-gray-200 mt-4 mb-6">
      <nav className="-mb-px flex gap-6 overflow-x-auto">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `whitespace-nowrap pb-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default DashboardTabs;
