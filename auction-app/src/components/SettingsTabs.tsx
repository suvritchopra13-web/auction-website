import { NavLink } from 'react-router-dom';

const tabs = [
  { path: '/settings/profile', label: 'Profile' },
  { path: '/settings/security', label: 'Security' },
];

const SettingsTabs = () => {
  return (
    <div className="border-b border-gray-200 mt-4 mb-6">
      <nav className="-mb-px flex gap-6">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `pb-3 text-sm font-medium border-b-2 transition-colors ${
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

export default SettingsTabs;
