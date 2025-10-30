import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase.js';
import { useAuth } from '../hooks/useAuth.js';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { completeProfile } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    bio: '',
    location: '',
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      await completeProfile({
        username: form.username,
        bio: form.bio,
        location: form.location,
        interests: [],
      });
      navigate('/');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-guff-sand">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-semibold text-guff-dusk">Join the GuffGaff community</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Earn Payback Points for being your kind self.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="email"
              required
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-full border border-guff-sand px-4 py-3 text-sm focus:border-guff-sky focus:outline-none"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-full border border-guff-sand px-4 py-3 text-sm focus:border-guff-sky focus:outline-none"
            />
            <input
              type="text"
              required
              placeholder="Username"
              value={form.username}
              onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              className="rounded-full border border-guff-sand px-4 py-3 text-sm focus:border-guff-sky focus:outline-none"
            />
            <input
              type="text"
              placeholder="Location"
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
              className="rounded-full border border-guff-sand px-4 py-3 text-sm focus:border-guff-sky focus:outline-none"
            />
          </div>
          <textarea
            placeholder="Tell the community about yourself"
            value={form.bio}
            onChange={(event) => setForm((prev) => ({ ...prev, bio: event.target.value }))}
            className="h-24 w-full rounded-2xl border border-guff-sand px-4 py-3 text-sm focus:border-guff-sky focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-guff-sky px-4 py-3 text-sm font-semibold text-white hover:bg-guff-dusk"
          >
            Create account
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500">
          Already part of the village?{' '}
          <Link to="/login" className="font-semibold text-guff-sky">
            Log in
          </Link>
        </p>
        {status && <p className="mt-4 text-center text-xs text-rose-500">{status}</p>}
      </div>
    </div>
  );
};
