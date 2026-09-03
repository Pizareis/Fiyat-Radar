import { useEffect, useState, useCallback } from "react";
import { fetchAssets, fetchAssetPrices, fetchAnomalies } from "./api";
import PriceChart from "./components/PriceChart";
import AnomalyList from "./components/AnomalyList";

const POLL_MS = 30000;

export default function App() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [prices, setPrices] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  const loadAssets = useCallback(async () => {
    const data = await fetchAssets();
    setAssets(data);
    setSelected((prev) => prev ?? data[0]?.symbol ?? null);
  }, []);

  const loadAnomalies = useCallback(async () => {
    setAnomalies(await fetchAnomalies());
  }, []);

  useEffect(() => {
    loadAssets();
    loadAnomalies();
    const id = setInterval(() => {
      loadAssets();
      loadAnomalies();
    }, POLL_MS);
    return () => clearInterval(id);
  }, [loadAssets, loadAnomalies]);

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    fetchAssetPrices(selected).then((data) => {
      if (!cancelled) setPrices(data);
    });
    const id = setInterval(async () => {
      const data = await fetchAssetPrices(selected);
      if (!cancelled) setPrices(data);
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [selected]);

  return (
    <div className="app">
      <h1>Fiyat Radar</h1>
      <p className="subtitle">Kripto ve doviz fiyatlarinda anomali takibi</p>
      <div className="layout">
        <div className="asset-list">
          {assets.map((a) => (
            <button
              key={a.symbol}
              className={a.symbol === selected ? "active" : ""}
              onClick={() => setSelected(a.symbol)}
            >
              {a.display_name}
            </button>
          ))}
        </div>
        <div>
          {selected && <PriceChart symbol={selected} prices={prices} />}
          <AnomalyList anomalies={anomalies} />
        </div>
      </div>
    </div>
  );
}
