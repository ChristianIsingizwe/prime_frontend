import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../stores/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api";

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
    // Commenting out token checks for testing
    // const store = useAuthStore.getState();
    // let token = store.token;

    // if (token && isTokenExpired(token)) {
    //   try {
    //     const refreshToken = store.refreshToken;

    //     if (!refreshToken) {
    //       store.logout();
    //       return Promise.reject(new Error("No refresh token available"));
    //     }

    //     const response = await axios.post<RefreshResponse>(
    //       `${baseURL}/auth/refresh-token`,
    //       {
    //         refreshToken,
    //       }
    //     );

    //     const { token: newToken, refreshToken: newRefreshToken } =
    //       response.data;
    //     store.updateTokens(newToken, newRefreshToken);

    //     token = newToken;
    //   } catch (error) {
    //     store.logout();
    //     return Promise.reject(error);
    //   }
    // }

    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Commenting out token refresh logic for testing
    // const originalRequest = error.config as AxiosRequestConfig & {
    //   _retry: boolean;
    // };

    // if (error.response?.status === 401 && !originalRequest._retry) {
    //   originalRequest._retry = true;

    //   try {
    //     const store = useAuthStore.getState();
    //     const refreshToken = store.refreshToken;

    //     if (!refreshToken) {
    //       store.logout();
    //       return Promise.reject(error);
    //     }

    //     const response = await axios.post<RefreshResponse>(
    //       `${baseURL}/auth/refresh-token`,
    //       {
    //         refreshToken,
    //       }
    //     );

    //     const { token, refreshToken: newRefreshToken } = response.data;

    //     store.updateTokens(token, newRefreshToken);

    //     if (originalRequest.headers) {
    //       originalRequest.headers.Authorization = `Bearer ${token}`;
    //     } else {
    //       originalRequest.headers = { Authorization: `Bearer ${token}` };
    //     }

    //     return axios(originalRequest);
    //   } catch (refreshError) {
    //     useAuthStore.getState().logout();
    //     return Promise.reject(refreshError);
    //   }
    // }

    return Promise.reject(error);
  }
);

export default apiClient;
