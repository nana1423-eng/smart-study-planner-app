import axios from 'axios';
import { cacheData, getCachedData, queueRequest } from '../utils/offlineSync';

let finalUrl = window.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:8081/api';

if (finalUrl === "RUNTIME_" + "VITE_API_URL") {
  alert("WARNING: Backend URL was not injected into index.html by the Docker Server! It is pointing to a broken relative path. Nginx deployment has failed.");
  finalUrl = 'http://localhost:8081/api';
} else if (finalUrl.includes('localhost')) {
  alert("WARNING: The frontend is trying to connect to localhost. This means VITE_API_URL was empty! If you cleared your browser cache and this happens, Render is completely missing the VITE_API_URL environment variable.");
}

const api = axios.create({
  baseURL: finalUrl,
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
