import { useState } from 'react';
import { toast } from 'react-toastify';
import SettingsTabs from '../../components/SettingsTabs';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const SettingsProfile = () => {
  const { profile, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name ?? '');
  const [lastName, setLastName] = useState(profile?.last_name ?? '');
  const [about, setAbout] = useState(profile?.about ?? '');
  const [country, setCountry] = useState(profile?.country ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ first_name: firstName, last_name: lastName, about, country })
      .eq('id', profile.id);

    setSaving(false);

    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated');
      await refreshProfile();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage your account preferences</p>
      </div>

      <SettingsTabs />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-700">
                {profile?.username?.[0]?.toUpperCase() ?? 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">@{profile?.username}</p>
              <p className="text-sm text-gray-500">Profile picture is auto-generated from your username</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="John"
                maxLength={64}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Doe"
                maxLength={64}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
            <input
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
              placeholder="United States"
              maxLength={64}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">About</label>
            <textarea
              value={about}
              onChange={e => setAbout(e.target.value)}
              placeholder="Tell others a bit about yourself..."
              rows={4}
              maxLength={5000}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">{about.length}/5000</p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsProfile;
