import axios from "axios";

const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === "localhost";
  const host = isLocalhost ? "localhost:3001" : "api.amankriet.com";
  const protocol = isLocalhost ? "http" : "https";

  return `${protocol}://${host}/v1`;
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = token;
  }

  return config;
});
