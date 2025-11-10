export default function normalizeImagePath(img, subfolder = "products") {
  // Handle arrays (take first truthy element)
  if (Array.isArray(img)) {
    const first = img.find(Boolean);
    return normalizeImagePath(first, subfolder);
  }

  // Handle object shapes: { url, path, src, name }
  if (img && typeof img === "object") {
    const src = img.url || img.path || img.src || img.name || img.fileName;
    return normalizeImagePath(src, subfolder);
  }

  // Return a sensible placeholder for empty values
  if (!img) return "/assets/placeholder.webp";
  // If it's not a string (could be a pre-built <img> source like Blob), return as-is
  if (typeof img !== "string") return img;

  const trimmed = img.trim();
  if (!trimmed) return "/assets/placeholder.webp";

  // Preserve absolute URLs, root-relative paths, data URLs and blob URLs
  if (
    trimmed.startsWith("http") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    return trimmed;
  }

  // Otherwise assume it's a filename stored in the DB and prepend the uploads path
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const host = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
  // Allow different upload subfolders (products, forum, avatars, etc.)
  const folder = subfolder || "products";
  return `${host}/uploads/${folder}/${encodeURIComponent(trimmed)}`;
}
