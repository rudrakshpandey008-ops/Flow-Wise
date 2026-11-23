import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flowwise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('flowwise_token');
      localStorage.removeItem('flowwise_user');
    }
    return Promise.reject(error);
  }
);

export const planJourney = (data) =>
  api.post('/journeys/plan', data).then((res) => res.data);

export const getJourneyHistory = () =>
  api.get('/journeys/history').then((res) => res.data);

export const getNearbyData = (lat = 27.5046, lng = 77.6713, radius = 25) =>
  api.get('/crowd/nearby', { params: { lat, lng, radius } }).then((res) => res.data);

export const getLocationCrowd = (id) =>
  api.get(`/crowd/location/${id}`).then((res) => res.data);

export const submitCrowdReport = (data) =>
  api.post('/crowd/report', data).then((res) => res.data);

export const getHeatmapData = () =>
  api.get('/crowd/heatmap').then((res) => res.data);

export const getCrowdPrediction = (locationId, targetTime) =>
  api.post('/prediction/forecast', { locationId, targetTime }).then((res) => res.data);

export const getAnalyticsOverview = () =>
  api.get('/analytics/overview').then((res) => res.data);

export const getAnalyticsTrends = () =>
  api.get('/analytics/trends').then((res) => res.data);

export const compareRoutes = (data) =>
  api.post('/routes/compare', data).then((res) => res.data);

export default api;
