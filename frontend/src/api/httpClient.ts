import axios, { AxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.DEV ? "http://localhost:8000" : "/api";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(function (config: AxiosRequestConfig) {
  config.headers = { token: localStorage.getItem("token") || "" };
  return config;
});
