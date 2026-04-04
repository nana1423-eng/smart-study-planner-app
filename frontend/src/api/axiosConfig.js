import axios from 'axios';
import { cacheData, getCachedData, queueRequest } from '../utils/offlineSync';

const api = axios.create({
  baseURL: window.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8081/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Cache successful GET requests
    if (response.config.method === 'get') {
      cacheData(response.config.url, response.data);
    }
    return response;
  },
  async (error) => {
    const config = error.config;
    if (!error.response) { // Network error (offline)
      if (config.method === 'get') {
        const cached = await getCachedData(config.url);
        if (cached) {
           console.log("Serving from local cache: " + config.url);
           return Promise.resolve({ data: cached, status: 200, statusText: 'OK', headers: {}, config, isCached: true });
        }
      } else {
        // Queue mutating requests for Background Sync
        await queueRequest({ method: config.method, url: config.url, data: JSON.parse(config.data || "{}") });
        // Return a mocked success so the UI doesn't crash on "offline"
        return Promise.resolve({ data: { message: "Action queued while offline." }, status: 202 });
      }
    } else if (error.response.status === 401 || error.response.status === 403) {
      // Handle expired or invalid tokens globally
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
