import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase.js';
import { requestPasswordReset } from '../services/api.js';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate('/');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleReset = async () => {
    try {
      await requestPasswordReset(form.email);
      setStatus('Password reset link sent!');
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-guff-sand">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-3xl font-semibold text-guff-dusk">Welcome to GuffGaff</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Log in to rejoin the conversation.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            className="w-full rounded-full border border-guff-sand px-4 py-3 text-sm focus:border-guff-sky focus:outline-none"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="w-full rounded-full border border-guff-sand px-4 py-3 text-sm focus:border-guff-sky focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-guff-sky px-4 py-3 text-sm font-semibold text-white hover:bg-guff-dusk"
          >
            Log in
          </button>
        </form>
        <button
          type="button"
          onClick={handleGoogle}
          className="mt-4 w-full rounded-full border border-guff-sky px-4 py-3 text-sm font-semibold text-guff-sky hover:bg-guff-sky/10"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="mt-3 text-xs font-medium text-guff-sky hover:text-guff-dusk"
        >
          Forgot password?
        </button>
        <p className="mt-4 text-center text-xs text-slate-500">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-guff-sky">
            Create an account
          </Link>
        </p>
        {status && <p className="mt-4 text-center text-xs text-rose-500">{status}</p>}
      </div>
    </div>
  );
};
