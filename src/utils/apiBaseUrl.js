const configuredBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

const API_BASE_URL = configuredBaseUrl.replace(/\/+$/, "");

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export { API_BASE_URL };
