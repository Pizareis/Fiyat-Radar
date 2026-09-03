import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
}

export default function PriceChart({ symbol, prices }) {
  const data = prices.map((p) => ({
    time: formatTime(p.recorded_at),
    price: p.price,
  }));

  return (
    <div className="card">
      <h3>{symbol} fiyat trendi</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#262a31" />
          <XAxis dataKey="time" stroke="#9aa0a6" minTickGap={30} />
          <YAxis stroke="#9aa0a6" domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ background: "#171a20", border: "1px solid #262a31" }}
          />
          <Line type="monotone" dataKey="price" stroke="#4f8cff" dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
