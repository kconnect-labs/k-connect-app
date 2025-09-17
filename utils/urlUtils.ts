import { BASE_URL, IMAGE_BASE } from "./constants";

export function buildImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  // If url is already a full URL, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Handle malformed URLs from API (e.g., "https//" instead of "https://")
  if (url.startsWith("https//")) {
    return url.replace("https//", "https://");
  }
  // Otherwise prepend the IMAGE_BASE
  return `${IMAGE_BASE}${url}`;
}

export function buildApiUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}
