import axios from "axios";
import { refreshAccessToken } from "./authService";
import { API_BASE_URL } from "../components/item";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// A shared variable that stores the token
let currentAccessToken = null;

// ✅ Attach token without re-adding request interceptor
export const attachToken = (accessToken) => {
  currentAccessToken = accessToken;
};

// ✅ Add request interceptor ONCE
api.interceptors.request.use(
  (config) => {
    if (currentAccessToken) {
      config.headers["Authorization"] = `Bearer ${currentAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Add response interceptor ONCE
let isResponseInterceptorSet = false;
export const responseInterceptor = (setAccessToken) => {
  if (isResponseInterceptorSet) return;
  isResponseInterceptorSet = true;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const newAccessToken = await refreshAccessToken(setAccessToken);
        if (newAccessToken) {
          attachToken(newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;
