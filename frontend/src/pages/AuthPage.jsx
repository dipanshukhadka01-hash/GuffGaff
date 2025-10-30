import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthPage() {
  const { login, signup, loginWithGoogle, requestPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      if (mode === 'login') {
        await login({ email: form.email, password: form.password });
      } else {
        await signup(form);
      }
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const email = prompt('Enter your email address for a password reset link:');
    if (!email) return;
    await requestPasswordReset(email);
    alert('If that email is registered, a reset link has been sent.');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
      <div className="grid w-full max-w-5xl items-center gap-10 rounded-3xl bg-white p-10 shadow-2xl lg:grid-cols-[1fr,1fr]">
        <div>
          <h1 className="text-4xl font-black text-slate-800">GuffGaff</h1>
          <p className="mt-4 text-lg text-slate-600">
            Join the friendliest corner of the internet. Help others, share knowledge, and rack up Payback Points.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-slate-500">
            <li>✅ Earn Payback Points for being helpful</li>
            <li>🎉 Share fun banter with mood tags</li>
            <li>🏆 Climb ranks from Newbie to Legend</li>
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex rounded-full bg-slate-100 p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                mode === 'login' ? 'bg-white text-primary shadow' : 'text-slate-500'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-full px-4 py-2 transition ${
                mode === 'signup' ? 'bg-white text-primary shadow' : 'text-slate-500'
              }`}
            >
              Sign up
            </button>
          </div>

          {mode === 'signup' && (
            <label className="block text-sm font-medium text-slate-600">
              Username
              <input name="username" value={form.username} onChange={handleChange} required />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-600">
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label className="block text-sm font-medium text-slate-600">
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-4 py-3 font-semibold text-white"
          >
            {loading ? 'Working...' : mode === 'login' ? 'Log in' : 'Create account'}
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            className="w-full rounded-full border border-slate-200 px-4 py-3 font-semibold text-slate-600"
          >
            Continue with Google
          </button>
          <button type="button" onClick={handleReset} className="text-sm text-primary">
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}
