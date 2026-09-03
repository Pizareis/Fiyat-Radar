import logging

import requests

from app.core.config import settings

logger = logging.getLogger(__name__)

BINANCE_TICKER_URL = "https://api.binance.com/api/v3/ticker/price"
FOREX_RATE_URL = "https://open.er-api.com/v6/latest/{base}"


def fetch_crypto_prices() -> dict[str, float]:
    """symbol (e.g. BTCUSDT) -> last price, via Binance public REST API."""
    symbols = settings.crypto_symbol_list
    resp = requests.get(BINANCE_TICKER_URL, timeout=10)
    resp.raise_for_status()
    all_prices = {row["symbol"]: float(row["price"]) for row in resp.json()}
    return {s: all_prices[s] for s in symbols if s in all_prices}


def fetch_forex_prices() -> dict[str, float]:
    """pair (e.g. USD-TRY) -> rate, via open.er-api.com (free, no key)."""
    prices: dict[str, float] = {}
    bases = {pair.split("-")[0] for pair in settings.forex_pair_list}
    for base in bases:
        resp = requests.get(FOREX_RATE_URL.format(base=base), timeout=10)
        resp.raise_for_status()
        data = resp.json()
        rates = data.get("rates", {})
        for pair in settings.forex_pair_list:
            pair_base, quote = pair.split("-")
            if pair_base == base and quote in rates:
                prices[pair] = float(rates[quote])
    return prices
