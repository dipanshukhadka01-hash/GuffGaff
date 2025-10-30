import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth.js';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user) {
      setSocket(null);
      return;
    }

    const instance = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000', {
      query: { userId: user._id },
    });

    setSocket(instance);

    return () => instance.disconnect();
  }, [user]);

  const value = useMemo(() => ({ socket }), [socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
