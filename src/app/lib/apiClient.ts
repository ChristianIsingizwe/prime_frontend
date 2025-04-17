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

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const { token, refreshToken } = useAuthStore.getState();

    if (token) {
      const tokenExpiration = JSON.parse(atob(token.split(".")[1])).exp * 1000;
      const currentTime = Date.now();

      if (currentTime >= tokenExpiration) {
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(new Error("No refresh token available"));
        }

        try {
          const response = await axios.post<RefreshResponse>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          useAuthStore.getState().updateTokens(accessToken, newRefreshToken);
          config.headers.Authorization = `Bearer ${accessToken}`;
        } catch (error) {
          useAuthStore.getState().logout();
          throw error;
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const { refreshToken } = useAuthStore.getState();
      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post<RefreshResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        useAuthStore.getState().updateTokens(accessToken, newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (error) {
        useAuthStore.getState().logout();
        throw error;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
