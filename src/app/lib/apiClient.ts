import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface TokenPayload {
  exp: number;
}

interface RefreshResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
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
    // Try to get token from store
    const store = useAuthStore.getState();
    let token = store.token;

    // If we have a token but it's expired, try to refresh before sending request
    if (token && isTokenExpired(token)) {
      try {
        // Get refresh token
        const refreshToken = store.refreshToken;

        if (!refreshToken) {
          store.logout();
          return Promise.reject(new Error("No refresh token available"));
        }

        // Call refresh token endpoint
        const response = await axios.post<RefreshResponse>(
          `${baseURL}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        // Update tokens
        const { token: newToken, refreshToken: newRefreshToken } =
          response.data;
        store.updateTokens(newToken, newRefreshToken);

        // Use new token for this request
        token = newToken;
      } catch (error) {
        // If refresh fails, log out
        store.logout();
        return Promise.reject(error);
      }
    }

    // Add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    // Only retry once to avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const store = useAuthStore.getState();
        const refreshToken = store.refreshToken;

        if (!refreshToken) {
          store.logout();
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const response = await axios.post<RefreshResponse>(
          `${baseURL}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        const { token, refreshToken: newRefreshToken } = response.data;

        // Update tokens in store
        store.updateTokens(token, newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        } else {
          originalRequest.headers = { Authorization: `Bearer ${token}` };
        }

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
