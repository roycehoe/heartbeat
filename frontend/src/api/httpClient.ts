import axios from "axios";

const BASE_URL = "http://localhost:8000";

export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
