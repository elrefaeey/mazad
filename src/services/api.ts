import axios, { AxiosResponse } from "axios";
import { VITE_API_BASE_URL } from "../config/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = Record<string, any>;

const apiInstance = axios.create({
  baseURL: VITE_API_BASE_URL,
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },     
  (error) => {
    return Promise.reject(error);
  }
);
  
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && window.location.pathname !== "/admin/login") {
      localStorage.removeItem("token");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);
       
export const Api = {
  get: <T>(endpoint: string, params?: Params): Promise<AxiosResponse<T>> =>
    apiInstance.get<T>(endpoint, { params }),

  post: <T>(endpoint: string, data: Params): Promise<AxiosResponse<T>> =>
    apiInstance.post<T>(endpoint, data),
  patch: <T>(endpoint: string, data: Params): Promise<AxiosResponse<T>> =>
    apiInstance.patch<T>(endpoint, data),

  put: <T>(endpoint: string, data: Params): Promise<AxiosResponse<T>> =>
    apiInstance.put<T>(endpoint, data),

  delete: <T>(endpoint: string, params?: Params): Promise<AxiosResponse<T>> =>
    apiInstance.delete<T>(endpoint, { params }),
};
