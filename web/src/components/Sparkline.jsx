export default function Sparkline({ prices, width = 100, height = 30 }) {
  if (!prices || prices.length < 2) return <svg width="100%" height={height} />;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const step = width / (prices.length - 1);
  const points = prices
    .map((p, i) => `${(i * step).toFixed(1)},${(height - ((p - min) / range) * (height - 4) - 2).toFixed(1)}`)
    .join(" ");
  const up = prices[prices.length - 1] >= prices[0];

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={up ? "#17c78f" : "#ff5c7a"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
