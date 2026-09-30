import { BACKEND_BASE_URL } from "@/constants";
import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const httpClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(function (config: AxiosRequestConfig) {
  config.headers = {
    token: localStorage.getItem("token") || "",
    clerk_token: localStorage.getItem("clerk_token") || "",
  };
  return config;
});

export const httpClerkClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

httpClerkClient.interceptors.request.use(function (config: AxiosRequestConfig) {
  config.headers = {
    token: `${localStorage.getItem("clerk_token")}` || "",
  };
  return config;
});
