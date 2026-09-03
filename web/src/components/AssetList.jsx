import { formatPrice } from "../utils";

export default function AssetList({ assets, selected, onSelect }) {
  return (
    <div className="asset-list">
      {assets.map((a) => {
        const changeClass =
          a.change_pct == null ? "flat" : a.change_pct > 0 ? "up" : a.change_pct < 0 ? "down" : "flat";
        const changeText =
          a.change_pct == null ? "—" : `${a.change_pct > 0 ? "+" : ""}${a.change_pct.toFixed(2)}%`;
        return (
          <button
            key={a.symbol}
            className={`asset-card${a.symbol === selected ? " active" : ""}`}
            onClick={() => onSelect(a.symbol)}
          >
            <div className="row1">
              <span className="symbol">{a.display_name}</span>
              <span className={`badge ${a.asset_type}`}>{a.asset_type === "crypto" ? "Kripto" : "Doviz"}</span>
            </div>
            <div className="row2">
              <span className="price">{formatPrice(a.last_price, a.asset_type)}</span>
              <span className={`change ${changeClass}`}>{changeText}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
