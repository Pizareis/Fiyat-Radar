import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { formatPrice, formatTime } from "../utils";

export default function PriceChart({ asset, prices }) {
  const data = prices.map((p) => ({
    time: formatTime(p.recorded_at),
    price: p.price,
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h2>{asset ? asset.display_name : "-"}</h2>
        <div className="current-price">{asset ? formatPrice(asset.last_price, asset.asset_type) : "-"}</div>
      </div>
      <p className="card-sub">
        {prices.length} veri noktasi - {asset?.asset_type === "crypto" ? "Kripto" : "Doviz"}
      </p>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5b8def" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#5b8def" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#232834" />
          <XAxis dataKey="time" stroke="#8b93a1" minTickGap={40} tick={{ fontSize: 12 }} />
          <YAxis stroke="#8b93a1" domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: "#171b24", border: "1px solid #232834", borderRadius: 8 }}
            labelStyle={{ color: "#8b93a1" }}
          />
          <Area type="monotone" dataKey="price" stroke="#5b8def" strokeWidth={2} fill="url(#priceFill)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
