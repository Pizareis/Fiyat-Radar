import { formatPrice } from "../utils";

export default function TickerTape({ assets }) {
  const items = assets.map((a) => {
    const cls = a.change_pct == null ? "flat" : a.change_pct > 0 ? "up" : a.change_pct < 0 ? "down" : "flat";
    const changeText = a.change_pct == null ? "—" : `${a.change_pct > 0 ? "+" : ""}${a.change_pct.toFixed(2)}%`;
    return (
      <span className="ticker-item mono" key={a.symbol}>
        <span className="sym">{a.display_name}</span>
        <span className="val">{formatPrice(a.last_price, a.asset_type)}</span>
        <span className={`chg ${cls}`}>{changeText}</span>
      </span>
    );
  });

  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {items}
        {items}
      </div>
    </div>
  );
}
