export default function AnomalyList({ anomalies }) {
  return (
    <div className="card">
      <h3>Son anomaliler</h3>
      {anomalies.length === 0 && <p style={{ color: "#9aa0a6" }}>Henuz anomali yok.</p>}
      {anomalies.map((a) => (
        <div key={a.id} className="anomaly-row">
          <span>{a.message}</span>
          <span className={a.direction === "spike" ? "direction-spike" : "direction-drop"}>
            {new Date(a.created_at).toLocaleTimeString("tr-TR")}
          </span>
        </div>
      ))}
    </div>
  );
}
