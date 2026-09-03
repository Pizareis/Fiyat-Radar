import logging

from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import SessionLocal
from app.models.models import Anomaly, Asset, AssetType, DeviceToken, PriceTick
from app.services.anomaly import detect_anomaly
from app.services.collectors import fetch_crypto_prices, fetch_forex_prices
from app.services.push import send_push_notifications

logger = logging.getLogger(__name__)


def _get_or_create_asset(db: Session, symbol: str, display_name: str, asset_type: AssetType) -> Asset:
    asset = db.query(Asset).filter(Asset.symbol == symbol).one_or_none()
    if asset is None:
        asset = Asset(symbol=symbol, display_name=display_name, asset_type=asset_type)
        db.add(asset)
        db.commit()
        db.refresh(asset)
    return asset


def collect_and_detect() -> None:
    db = SessionLocal()
    try:
        prices: dict[str, tuple[float, AssetType]] = {}
        try:
            for symbol, price in fetch_crypto_prices().items():
                prices[symbol] = (price, AssetType.CRYPTO)
        except Exception:
            logger.exception("Crypto fetch failed")

        try:
            for pair, price in fetch_forex_prices().items():
                prices[pair] = (price, AssetType.FOREX)
        except Exception:
            logger.exception("Forex fetch failed")

        for symbol, (price, asset_type) in prices.items():
            asset = _get_or_create_asset(db, symbol, symbol, asset_type)

            tick = PriceTick(asset_id=asset.id, price=price)
            db.add(tick)
            db.commit()
            db.refresh(tick)

            history = (
                db.query(PriceTick.price)
                .filter(PriceTick.asset_id == asset.id)
                .order_by(PriceTick.recorded_at.asc())
                .all()
            )
            price_history = [h[0] for h in history]

            is_anomaly, zscore, direction = detect_anomaly(price_history)
            if is_anomaly:
                message = f"{asset.display_name} fiyatinda beklenmedik {direction} tespit edildi (z={zscore:.2f})"
                anomaly = Anomaly(
                    asset_id=asset.id,
                    price_tick_id=tick.id,
                    zscore=zscore,
                    direction=direction,
                    message=message,
                )
                db.add(anomaly)
                db.commit()

                tokens = [t.token for t in db.query(DeviceToken).all()]
                send_push_notifications(tokens, "Fiyat Radar - Firsat/Anomali", message)
                logger.info("Anomaly detected: %s", message)
    finally:
        db.close()


scheduler = BackgroundScheduler()


def start_scheduler() -> None:
    scheduler.add_job(
        collect_and_detect,
        "interval",
        minutes=settings.collect_interval_minutes,
        next_run_time=None,
        id="collect_and_detect",
        replace_existing=True,
    )
    scheduler.start()
    collect_and_detect()
