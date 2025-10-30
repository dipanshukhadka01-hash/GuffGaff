import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../services/firebase.js';
import { getProfile, registerProfile } from '../services/api.js';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncProfile = useCallback(async (firebaseUser) => {
    if (!firebaseUser) {
      setUser(null);
      return;
    }
    const token = await firebaseUser.getIdToken();
    const profile = await getProfile(token);
    setUser({ ...profile, firebaseUser });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          await syncProfile(firebaseUser);
        } catch (error) {
          console.error('Failed to sync profile', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [syncProfile]);

  const completeProfile = useCallback(async ({ username, bio, location, interests }) => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    const idToken = await firebaseUser.getIdToken();
    const profile = await registerProfile({ idToken, username, bio, location, interests });
    setUser({ ...profile, firebaseUser });
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, completeProfile, logout }),
    [user, loading, completeProfile, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
