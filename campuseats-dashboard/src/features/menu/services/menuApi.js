const apiBaseUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

export const isDemoMenu = !apiBaseUrl || apiBaseUrl.toLowerCase() === "demo";
export const menuUrl = isDemoMenu ? "/menu.json" : `${apiBaseUrl}/api/menu`;
