import axios, { AxiosError } from 'axios';

// Augment AxiosRequestConfig to include our custom options
declare module 'axios' {
  export interface AxiosRequestConfig {
    skipRefresh?: boolean;
    _retry?: boolean;
  }
}

const API_BASE_URL = window.env?.API_BASE_URL || 'https://poll-api.vncsmyrnk.dev';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipRefresh
    ) {
      originalRequest._retry = true;
      try {
        await apiClient.post('/auth/refresh', null, { skipRefresh: true });
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
