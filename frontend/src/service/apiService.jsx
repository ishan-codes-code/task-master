import axios from "axios";
import { refreshAccessToken } from "./authService";

const api = axios.create({
  baseURL:
    "https://1b57e44a-991a-4eb9-9662-666a3ba399d6-00-370g4lciek7gs.sisko.replit.dev",
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
  (error) => Promise.reject(error),
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
    },
  );
};

export default api;
