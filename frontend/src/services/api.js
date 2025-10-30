import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'
});

const withAuth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

export const signup = async ({ email, password, username, idToken }) => {
  const { data } = await api.post('/auth/signup', { email, password, username, idToken });
  return data;
};

export const login = async ({ email, password, idToken, provider }) => {
  if (provider === 'google' || idToken) {
    const { data } = await api.post('/auth/google', { idToken });
    return data;
  }
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const fetchProfile = async (token) => {
  const { data } = await api.get('/auth/me', withAuth(token));
  return data;
};

export const updateProfile = async (token, updates) => {
  const { data } = await api.put('/auth/me', updates, withAuth(token));
  return data;
};

export const requestPasswordReset = async (email) => {
  const { data } = await api.post('/auth/password/request-reset', { email });
  return data;
};

export const fetchFeed = async (token, params = {}) => {
  const { data } = await api.get('/posts', { ...withAuth(token), params });
  return data.posts;
};

export const createPost = async (token, payload) => {
  const { data } = await api.post('/posts', payload, withAuth(token));
  return data.post;
};

export const togglePostLike = async (token, id) => {
  const { data } = await api.post(`/posts/${id}/like`, null, withAuth(token));
  return data.post;
};

export const markPostSolved = async (token, id, commentId) => {
  const { data } = await api.post(`/posts/${id}/solve`, { commentId }, withAuth(token));
  return data.post;
};

export const fetchComments = async (token, postId) => {
  const { data } = await api.get(`/posts/${postId}/comments`, withAuth(token));
  return data.comments;
};

export const addComment = async (token, postId, payload) => {
  const { data } = await api.post(`/posts/${postId}/comments`, payload, withAuth(token));
  return data.comment;
};

export const likeComment = async (token, postId, commentId) => {
  const { data } = await api.post(
    `/posts/${postId}/comments/${commentId}/like`,
    null,
    withAuth(token)
  );
  return data.comment;
};

export const fetchLeaderboard = async (token) => {
  const { data } = await api.get('/leaderboard', withAuth(token));
  return data;
};

export const fetchNotifications = async (token) => {
  const { data } = await api.get('/notifications', withAuth(token));
  return data.notifications;
};

export const markNotificationRead = async (token, notificationId) =>
  api.post(`/notifications/${notificationId}/read`, null, withAuth(token));

export const fetchConversations = async (token) => {
  const { data } = await api.get('/chat', withAuth(token));
  return data.conversations;
};

export const startConversation = async (token, payload) => {
  const { data } = await api.post('/chat', payload, withAuth(token));
  return data.conversation;
};

export const fetchMessages = async (token, conversationId) => {
  const { data } = await api.get(`/chat/${conversationId}/messages`, withAuth(token));
  return data.messages;
};

export const sendMessage = async (token, conversationId, payload) => {
  const { data } = await api.post(`/chat/${conversationId}/messages`, payload, withAuth(token));
  return data.message;
};

export const fetchAdminOverview = async (token) => {
  const { data } = await api.get('/admin/overview', withAuth(token));
  return data.stats;
};

export const fetchAdminUsers = async (token) => {
  const { data } = await api.get('/admin/users', withAuth(token));
  return data.users;
};

export const updateUserBan = async (token, userId, bannedUntil) => {
  const { data } = await api.patch(
    `/admin/users/${userId}/ban`,
    { bannedUntil },
    withAuth(token)
  );
  return data.user;
};
