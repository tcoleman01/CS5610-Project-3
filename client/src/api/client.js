// client/src/api/client.js
const API_BASE = import.meta.env.VITE_API_BASE || ""; // keep empty for same-origin

export async function api(path, { method = "GET", data } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    try { err.message = (await res.json()).message || err.message; } catch {}
    throw err;
  }
  return res.json();
}
