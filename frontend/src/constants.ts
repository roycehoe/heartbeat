export const BACKEND_BASE_URL = import.meta.env.DEV ? "http://localhost:8000/api" : "/api";
export const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const CARECOMPASS_BASE_URL = import.meta.env.VITE_CARECOMPASS_BASE_URL ?? "https://my.carecompass.sg";
