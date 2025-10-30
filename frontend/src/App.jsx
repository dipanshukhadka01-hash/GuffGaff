import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import { Layout } from './components/Layout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { SignupPage } from './pages/SignupPage.jsx';
import { FeedPage } from './pages/FeedPage.jsx';
import { ForumPage } from './pages/ForumPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { LeaderboardPage } from './pages/LeaderboardPage.jsx';
import { NotificationsPage } from './pages/NotificationsPage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';
import { ChatPage } from './pages/ChatPage.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="flex h-screen items-center justify-center text-guff-dusk">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FeedPage />} />
        <Route path="forums" element={<ForumPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="admin" element={<AdminDashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
