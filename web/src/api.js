const BASE_URL = "/api";

async function getJson(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${path}`);
  return res.json();
}

export const fetchAssets = () => getJson("/assets");
export const fetchAssetPrices = (symbol, limit = 200) =>
  getJson(`/assets/${symbol}/prices?limit=${limit}`);
export const fetchAnomalies = (limit = 50) => getJson(`/anomalies?limit=${limit}`);
