import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { formatPrice, formatTime } from "../utils";
import { getIcon } from "../icons";

export default function PriceChart({ asset, prices }) {
  const data = prices.map((p) => ({
    time: formatTime(p.recorded_at),
    price: p.price,
  }));
  const icon = asset ? getIcon(asset) : { content: "-", bg: "#232834" };
  const up = data.length < 2 || data[data.length - 1].price >= data[0].price;
  const lineColor = up ? "#17c78f" : "#ff5c7a";
  const changeClass = asset?.change_pct == null ? "flat" : asset.change_pct > 0 ? "up" : asset.change_pct < 0 ? "down" : "flat";
  const changeText = asset?.change_pct == null ? "—" : `${asset.change_pct > 0 ? "+" : ""}${asset.change_pct.toFixed(2)}%`;

  return (
    <div className="card">
      <div className="card-header">
        <div className="title-block">
          <div className="icon-badge" style={{ background: icon.bg, width: 40, height: 40, fontSize: "1.15rem" }}>
            {icon.content}
          </div>
          <div>
            <h2>{asset ? asset.display_name : "-"}</h2>
            <div className="card-sub" style={{ margin: "2px 0 0" }}>
              {asset?.asset_type === "crypto" ? "Kripto" : "Doviz"} - canli fiyat akisi
            </div>
          </div>
        </div>
        <div className="price-block">
          <div className="current-price mono">{asset ? formatPrice(asset.last_price, asset.asset_type) : "-"}</div>
          <div className={`current-change mono change ${changeClass}`}>{changeText}</div>
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.25} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f222b" />
            <XAxis dataKey="time" stroke="#7c8494" minTickGap={40} tick={{ fontSize: 10, fontFamily: "monospace" }} />
            <YAxis stroke="#7c8494" domain={["auto", "auto"]} tick={{ fontSize: 10, fontFamily: "monospace" }} />
            <Tooltip
              contentStyle={{ background: "#14161d", border: "1px solid #1f222b", borderRadius: 8, fontFamily: "monospace" }}
              labelStyle={{ color: "#7c8494" }}
            />
            <Area type="monotone" dataKey="price" stroke={lineColor} strokeWidth={2} fill="url(#priceFill)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mini-stats">
        <div className="mini-stat">
          <div className="label">Oturum En Yuksek</div>
          <div className="value mono">{asset ? formatPrice(asset.session_high, asset.asset_type) : "-"}</div>
        </div>
        <div className="mini-stat">
          <div className="label">Oturum En Dusuk</div>
          <div className="value mono">{asset ? formatPrice(asset.session_low, asset.asset_type) : "-"}</div>
        </div>
        <div className="mini-stat">
          <div className="label">Veri Noktasi</div>
          <div className="value mono">{prices.length}</div>
        </div>
      </div>
    </div>
  );
}
