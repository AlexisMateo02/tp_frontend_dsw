//Manejamos todo el tema de las rutas de las imagenes y todos los probelmas 
// que nos estaba causando el tamaño de las imagenes, rutas absolutas, relativas, arrays, objetos, etc.


//Con esto normaliza cualquier formato y siempre te entrega una ruta final correcta.


export default function normalizeImagePath(img, subfolder = "products") {
  // Si es un array, tomamos el primer elemento "verdadero" (no null/undefined/empty) y recursamos
  if (Array.isArray(img)) {
    const first = img.find(Boolean);
    return normalizeImagePath(first, subfolder);
  }

  /// Si es un objeto, intentamos extraer la ruta desde { url, path, src, name, fileName }
  if (img && typeof img === "object") {
    const src = img.url || img.path || img.src || img.name || img.fileName;
    return normalizeImagePath(src, subfolder);
  }

    // Si no hay imagen, devolvemos un placeholder razonable
  if (!img) return "/assets/placeholder.webp";
   // Si no es string (ej: Blob u otra fuente ya construida), lo devolvemos tal cual
  if (typeof img !== "string") return img;

  const trimmed = img.trim();
  if (!trimmed) return "/assets/placeholder.webp";

  // Preservar URLs absolutas, rutas relativas a la raíz, data URLs y blob URLs
  if (
    trimmed.startsWith("http") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:")
  ) {
    // Si es una ruta de uploads relativa a la raíz, anteponer el host del API
    // para que el navegador pida el archivo al backend (y no al dev server).
    // Ejemplo: "/uploads/forum/abc.jpg" -> "http://localhost:3000/uploads/forum/abc.jpg"
    if (trimmed.startsWith("/uploads/")) {
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const host = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
      return `${host}${trimmed}`;
    }

    return trimmed;
  }

   // En cualquier otro caso, asumimos que es un nombre de archivo guardado en la BD y preparamos la ruta de uploads
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  const host = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
  /// Permitimos distintas subcarpetas de subida (products, forum, avatars, etc.)
  const folder = subfolder || "products";
  return `${host}/uploads/${folder}/${encodeURIComponent(trimmed)}`;
}
