import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token, user } = useAuth();
  const socketRef = useRef();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || socketRef.current) return;
    const socket = io(import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:5000', {
      auth: { token: `Bearer ${token}` }
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      if (user?.id) socket.emit('auth:register', user.id);
    });

    socket.on('disconnect', () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = undefined;
    };
  }, [token, user?.id]);

  const value = useMemo(
    () => ({ socket: socketRef.current, connected }),
    [connected]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
