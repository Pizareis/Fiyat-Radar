import { formatTime } from "../utils";

export default function AnomalyList({ anomalies }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Son Anomaliler</h2>
      </div>
      {anomalies.length === 0 && <p className="empty">Henuz anomali tespit edilmedi.</p>}
      {anomalies.map((a) => (
        <div key={a.id} className="anomaly-row">
          <div className={`anomaly-icon ${a.direction}`}>{a.direction === "spike" ? "▲" : "▼"}</div>
          <div className="anomaly-body">
            <div className="anomaly-symbol">{a.symbol}</div>
            <div className="anomaly-msg">{a.message}</div>
          </div>
          <div className="anomaly-time">{formatTime(a.created_at)}</div>
        </div>
      ))}
    </div>
  );
}
