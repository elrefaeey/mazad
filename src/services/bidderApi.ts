import axios, { AxiosResponse } from "axios";
import { VITE_API_BASE_URL } from "../config/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = Record<string, any>;

const bidderApiInstance = axios.create({
  baseURL: VITE_API_BASE_URL,
});

bidderApiInstance.interceptors.request.use(
  (config) => {
    const bidderToken = localStorage.getItem("bidderToken");
    if (bidderToken) {
      config.headers.Authorization = `Bearer ${bidderToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

bidderApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("bidderToken");
      localStorage.removeItem("bidderData");
      // Redirect to bidder login or home page
      window.location.href = "/client";
    }
    return Promise.reject(error);
  }
);

export const BidderApi = {
  get: <T>(endpoint: string, params?: Params): Promise<AxiosResponse<T>> =>
    bidderApiInstance.get<T>(endpoint, { params }),

  post: <T>(endpoint: string, data: Params): Promise<AxiosResponse<T>> =>
    bidderApiInstance.post<T>(endpoint, data),

  patch: <T>(endpoint: string, data: Params): Promise<AxiosResponse<T>> =>
    bidderApiInstance.patch<T>(endpoint, data),

  put: <T>(endpoint: string, data: Params): Promise<AxiosResponse<T>> =>
    bidderApiInstance.put<T>(endpoint, data),

  delete: <T>(endpoint: string, params?: Params): Promise<AxiosResponse<T>> =>
    bidderApiInstance.delete<T>(endpoint, { params }),
};
