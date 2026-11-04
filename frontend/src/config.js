export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export const buildApiUrl = (path = "") => {
  const normalizedBase = API_BASE_URL.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
};
