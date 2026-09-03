import { useEffect, useState, useCallback } from "react";
import { fetchAssets, fetchAssetPrices, fetchAnomalies } from "./api";
import PriceChart from "./components/PriceChart";
import AnomalyList from "./components/AnomalyList";
import AssetList from "./components/AssetList";
import StatsRow from "./components/StatsRow";
import { formatTime } from "./utils";

const POLL_MS = 15000;

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
    const load = async () => {
      const data = await fetchAssetPrices(selected);
      if (!cancelled) setPrices(data);
    };
    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [selected]);

  const selectedAsset = assets.find((a) => a.symbol === selected);
  const latestUpdate = assets.map((a) => a.last_updated).filter(Boolean).sort().pop();

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="dot" />
          <h1>Fiyat Radar</h1>
        </div>
        <div className="updated-at">
          {latestUpdate ? `Son guncelleme: ${formatTime(latestUpdate)}` : "Veri bekleniyor"}
        </div>
      </div>

      <StatsRow assets={assets} anomalies={anomalies} />

      <div className="layout">
        <div>
          <p className="panel-title">Varliklar</p>
          <AssetList assets={assets} selected={selected} onSelect={setSelected} />
        </div>
        <div>
          <PriceChart asset={selectedAsset} prices={prices} />
          <AnomalyList anomalies={anomalies} />
        </div>
      </div>
    </div>
  );
}
