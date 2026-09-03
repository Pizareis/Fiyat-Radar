import { formatPrice } from "../utils";
import { getIcon } from "../icons";
import Sparkline from "./Sparkline";

export default function AssetList({ assets, selected, onSelect }) {
  return (
    <div className="asset-list">
      {assets.map((a) => {
        const icon = getIcon(a);
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
            <div className="icon-badge" style={{ background: icon.bg }}>{icon.content}</div>
            <div className="asset-main">
              <span className="symbol">{a.display_name}</span>
              <span className="type">{a.asset_type === "crypto" ? "Kripto" : "Doviz"}</span>
            </div>
            <div className="asset-right">
              <span className="price mono">{formatPrice(a.last_price, a.asset_type)}</span>
              <span className={`change mono ${changeClass}`}>{changeText}</span>
            </div>
            <div className="spark-row">
              <Sparkline prices={a.sparkline} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
