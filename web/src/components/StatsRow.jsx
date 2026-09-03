export default function StatsRow({ assets, anomalies }) {
  const cryptoCount = assets.filter((a) => a.asset_type === "crypto").length;
  const forexCount = assets.length - cryptoCount;

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="label">Takip Edilen Varlik</div>
        <div className="value">{assets.length}</div>
      </div>
      <div className="stat-card">
        <div className="label">Aktif Anomali</div>
        <div className="value">{anomalies.length}</div>
      </div>
      <div className="stat-card">
        <div className="label">Kripto / Doviz</div>
        <div className="value">{cryptoCount} / {forexCount}</div>
      </div>
      <div className="stat-card">
        <div className="label">Tarama Sikligi</div>
        <div className="value">5 dk</div>
      </div>
    </div>
  );
}
