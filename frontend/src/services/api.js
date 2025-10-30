import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(async (config) => {
  const token = await window.firebaseAuth?.currentUser?.getIdToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerProfile = async ({ idToken, username, bio, location, interests }) => {
  const response = await api.post('/auth/register', { idToken, username, bio, location, interests });
  return response.data;
};

export const getProfile = async (idToken) => {
  const response = await api.post('/auth/session', { idToken });
  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await api.post('/auth/password-reset', { email });
  return response.data;
};

export const fetchFeed = async () => {
  const response = await api.get('/feed');
  return response.data;
};

export const createFeedPost = async (payload) => {
  const response = await api.post('/forums', payload);
  return response.data;
};

export const reactToPost = async (postId, type) => {
  const response = await api.post(`/feed/${postId}/react`, { type });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/forums/categories');
  return response.data;
};

export const fetchForumPosts = async (category) => {
  const response = await api.get(`/forums/${category}/posts`);
  return response.data;
};

export const addForumComment = async (postId, payload) => {
  const response = await api.post(`/forums/${postId}/comments`, payload);
  return response.data;
};

export const markPostSolved = async (postId, commentId) => {
  const response = await api.post(`/forums/${postId}/solve/${commentId}`);
  return response.data;
};

export const fetchLeaderboard = async () => {
  const response = await api.get('/leaderboard');
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.post(`/notifications/${notificationId}/read`);
  return response.data;
};

export const fetchConversations = async () => {
  const response = await api.get('/chat');
  return response.data;
};

export const createConversation = async (payload) => {
  const response = await api.post('/chat', payload);
  return response.data;
};

export const fetchMessages = async (conversationId) => {
  const response = await api.get(`/chat/${conversationId}/messages`);
  return response.data;
};

export const sendMessage = async (conversationId, payload) => {
  const response = await api.post(`/chat/${conversationId}/messages`, payload);
  return response.data;
};

export const fetchAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const fetchAdminUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const toggleBanUser = async (userId) => {
  const response = await api.post(`/admin/users/${userId}/toggle-ban`);
  return response.data;
};

export const deletePost = async (postId) => api.delete(`/admin/posts/${postId}`);

export const awardBadge = async (userId, payload) => {
  const response = await api.post(`/admin/users/${userId}/badges`, payload);
  return response.data;
};

export const adjustPoints = async (userId, payload) => {
  const response = await api.post(`/admin/users/${userId}/points`, payload);
  return response.data;
};
