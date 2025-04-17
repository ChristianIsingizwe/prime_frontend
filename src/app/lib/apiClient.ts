import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

interface TokenPayload {
  exp: number;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

// Request interceptor to add authentication token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Attempt to refresh the token
      const refreshToken = useAuthStore.getState().refreshToken;
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
        { refreshToken }
      );

      const { token, refreshToken: newRefreshToken } = response.data;

      // Update auth store with new tokens
      useAuthStore.getState().setAuth({
        ...useAuthStore.getState(),
        token,
        refreshToken: newRefreshToken,
      });

      // Retry the original request with new token
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return apiClient(originalRequest);
    } catch (error) {
      // If refresh fails, clear auth and redirect to login
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      return Promise.reject(error);
    }
  }
);

export default apiClient;
