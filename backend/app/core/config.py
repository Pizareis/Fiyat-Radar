from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./fiyatradar.db"
    collect_interval_minutes: int = 5
    anomaly_zscore_threshold: float = 3.0
    anomaly_window_size: int = 30
    crypto_symbols: str = "BTCUSDT,ETHUSDT,SOLUSDT,BNBUSDT"
    forex_pairs: str = "USD-TRY,EUR-TRY,GBP-TRY"

    class Config:
        env_file = ".env"

    @property
    def crypto_symbol_list(self) -> list[str]:
        return [s.strip() for s in self.crypto_symbols.split(",") if s.strip()]

    @property
    def forex_pair_list(self) -> list[str]:
        return [p.strip() for p in self.forex_pairs.split(",") if p.strip()]


settings = Settings()
