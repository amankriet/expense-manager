import axios from "axios";
import { apiClient } from "./http";

interface RefreshTokenResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    mobile: number;
    dob: string;
    name: string;
  };
  tokens: {
    accessToken: string;
  };
}

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        // prevent multiple refresh calls simultaneously
        if (!refreshPromise) {
          refreshPromise = axios
            .get<RefreshTokenResponse>(
              `${apiClient.defaults.baseURL}/auth/refresh-token`,
              {
                withCredentials: true,
              },
            )
            .then((response) => response.data);
        }

        const data = await refreshPromise;
        const accessToken = data.tokens.accessToken;

        localStorage.setItem("accessToken", accessToken);

        refreshPromise = null;

        // retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");

        window.location.href = "/signin";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
