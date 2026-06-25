const PROD_API_BASE = "/api/v1";
const DEV_API_BASE = "http://localhost:4000/api/v1";

export const VITE_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? PROD_API_BASE : "/api/v1");

export const VITE_SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "https://dev.enterprise-egy.com";

/** For local dev fallback when no .env is set */
export const DEV_FALLBACK_API_BASE = DEV_API_BASE;
