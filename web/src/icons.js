const CRYPTO_ICONS = {
  BTCUSDT: { glyph: "₿", bg: "linear-gradient(135deg,#f7931a,#c9740a)" },
  ETHUSDT: { glyph: "Ξ", bg: "linear-gradient(135deg,#8ea6f0,#627eea)" },
  SOLUSDT: { glyph: "◎", bg: "linear-gradient(135deg,#c299ff,#9945ff)" },
  BNBUSDT: { glyph: "B", bg: "linear-gradient(135deg,#f8d675,#f3ba2f)" },
};

const FOREX_CODES = { USD: "US", EUR: "EU", GBP: "GB", TRY: "TR", JPY: "JP" };

function hashColor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  const hue = Math.abs(h) % 360;
  return `linear-gradient(135deg, hsl(${hue},70%,60%), hsl(${(hue + 40) % 360},70%,45%))`;
}

export function getIcon(asset) {
  if (asset.asset_type === "crypto") {
    const c = CRYPTO_ICONS[asset.symbol];
    if (c) return { content: c.glyph, bg: c.bg };
    return { content: asset.symbol.replace("USDT", "").slice(0, 1), bg: hashColor(asset.symbol) };
  }
  const base = asset.symbol.split("-")[0];
  return { content: FOREX_CODES[base] || "FX", bg: "linear-gradient(135deg,#3a4258,#232834)" };
}
