// src/utils/axiosConfig.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Your backend base URL
});

// Request interceptor for adding token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    
    console.log('Axios Interceptor Token Check:', {
      tokenExists: !!token,
      url: config.url
    });

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Axios Response Interceptor Error:', {
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem('authToken');
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);

export default api;