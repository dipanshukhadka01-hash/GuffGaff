import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  login as apiLogin,
  signup as apiSignup,
  fetchProfile,
  updateProfile as updateProfileApi,
  requestPasswordReset as requestPasswordResetApi
} from '../services/api.js';
import { firebaseAuth, googleProvider } from '../services/firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('gg_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchProfile(token);
        setUser(data.user);
      } catch (error) {
        console.error(error);
        setToken(null);
        localStorage.removeItem('gg_token');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  const login = async ({ email, password }) => {
    const creds = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const firebaseToken = await creds.user.getIdToken();
    const data = await apiLogin({ email, password, idToken: firebaseToken });
    setToken(data.token);
    localStorage.setItem('gg_token', data.token);
    setUser(data.user);
  };

  const signup = async ({ email, password, username }) => {
    const creds = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const firebaseToken = await creds.user.getIdToken();
    const data = await apiSignup({ email, password, username, idToken: firebaseToken });
    setToken(data.token);
    localStorage.setItem('gg_token', data.token);
    setUser(data.user);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    const idToken = await result.user.getIdToken();
    const data = await apiLogin({ idToken, provider: 'google' });
    setToken(data.token);
    localStorage.setItem('gg_token', data.token);
    setUser(data.user);
  };

  const updateProfile = async (updates) => {
    if (!token) return;
    const data = await updateProfileApi(token, updates);
    setUser(data.user);
  };

  const requestPasswordReset = async (email) => requestPasswordResetApi(email);

  const logout = async () => {
    await signOut(firebaseAuth);
    setToken(null);
    setUser(null);
    localStorage.removeItem('gg_token');
  };

  const value = useMemo(
    () => ({ token, user, loading, login, signup, loginWithGoogle, updateProfile, logout, requestPasswordReset }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
