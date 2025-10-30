import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import BadgePill from '../components/BadgePill.jsx';

const badges = [
  {
    label: 'Helper',
    description: 'Earned by solving community questions and being a friendly guide.'
  },
  {
    label: 'Witty Mind',
    description: 'Granted for lighting up the banter feed with wholesome humour.'
  },
  {
    label: 'Expert',
    description: 'For members who share in-depth knowledge consistently.'
  },
  {
    label: 'Community Leader',
    description: 'Celebrating those who keep the square welcoming and safe.'
  }
];

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profilePicture: user?.profilePicture || ''
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await updateProfile(form);
      alert('Profile updated!');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <section className="rounded-3xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-slate-800">Your profile</h1>
        <p className="mt-2 text-sm text-slate-500">
          Keep your profile welcoming so people know the friendly neighbour they are talking to.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-slate-600">
              Username
              <input name="username" value={form.username} onChange={handleChange} required />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-600">
              Location
              <input name="location" value={form.location} onChange={handleChange} />
            </label>
          </div>
          <label className="flex flex-col text-sm font-medium text-slate-600">
            Bio
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} />
          </label>
          <label className="flex flex-col text-sm font-medium text-slate-600">
            Profile picture URL
            <input name="profilePicture" value={form.profilePicture} onChange={handleChange} />
          </label>
          <button type="submit" disabled={saving} className="rounded-full bg-primary px-6 py-2 font-semibold text-white">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </section>

      <aside className="space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-secondary/30 to-primary/20 p-6 text-white shadow">
          <p className="text-sm uppercase tracking-wide">Payback Points</p>
          <p className="mt-2 text-4xl font-black">{user?.paybackPoints}</p>
          <p className="mt-3 text-sm text-white/80">Rank: {user?.rank}</p>
        </div>
        <section className="rounded-3xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-700">Badge Showcase</h2>
          <div className="mt-4 grid gap-3">
            {badges.map((badge) => (
              <BadgePill key={badge.label} {...badge} />
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
