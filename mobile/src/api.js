import { API_BASE_URL } from "./config";

async function getJson(path) {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  return res.json();
}

export const fetchAssets = () => getJson("/assets");
export const fetchAnomalies = (limit = 30) => getJson(`/anomalies?limit=${limit}`);

export async function registerDeviceToken(token) {
  await fetch(`${API_BASE_URL}/devices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}
