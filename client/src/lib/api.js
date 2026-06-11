import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api'
});

api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('veloura_auth') || 'null');
  const guestId = localStorage.getItem('veloura_guest_id') || `guest-${crypto.randomUUID()}`;
  localStorage.setItem('veloura_guest_id', guestId);
  if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  config.headers['x-guest-id'] = guestId;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error.response?.data?.message || error.message)
);
