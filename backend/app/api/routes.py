from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.api.schemas import AnomalyOut, AssetOut, DeviceTokenIn, PriceTickOut
from app.core.database import get_db
from app.models.models import Anomaly, Asset, DeviceToken, PriceTick

router = APIRouter()


@router.get("/assets", response_model=list[AssetOut])
def list_assets(db: Session = Depends(get_db)):
    assets = db.query(Asset).order_by(Asset.symbol).all()
    result = []
    for asset in assets:
        recent = (
            db.query(PriceTick)
            .filter(PriceTick.asset_id == asset.id)
            .order_by(desc(PriceTick.recorded_at))
            .limit(20)
            .all()
        )
        recent = list(reversed(recent))  # oldest -> newest

        last_price = recent[-1].price if recent else None
        last_updated = recent[-1].recorded_at if recent else None
        change_pct = None
        if len(recent) >= 2 and recent[-2].price:
            change_pct = (recent[-1].price - recent[-2].price) / recent[-2].price * 100

        prices = [t.price for t in recent]
        result.append(
            AssetOut(
                id=asset.id,
                symbol=asset.symbol,
                display_name=asset.display_name,
                asset_type=asset.asset_type,
                last_price=last_price,
                last_updated=last_updated,
                change_pct=change_pct,
                session_high=max(prices) if prices else None,
                session_low=min(prices) if prices else None,
                sparkline=prices,
            )
        )
    return result


@router.get("/assets/{symbol}/prices", response_model=list[PriceTickOut])
def get_asset_prices(symbol: str, limit: int = 200, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.symbol == symbol).one_or_none()
    if asset is None:
        raise HTTPException(status_code=404, detail="Asset not found")
    ticks = (
        db.query(PriceTick)
        .filter(PriceTick.asset_id == asset.id)
        .order_by(desc(PriceTick.recorded_at))
        .limit(limit)
        .all()
    )
    return list(reversed(ticks))


@router.get("/anomalies", response_model=list[AnomalyOut])
def list_anomalies(limit: int = 50, db: Session = Depends(get_db)):
    rows = (
        db.query(Anomaly, Asset.symbol)
        .join(Asset, Anomaly.asset_id == Asset.id)
        .order_by(desc(Anomaly.created_at))
        .limit(limit)
        .all()
    )
    return [
        AnomalyOut(
            id=anomaly.id,
            asset_id=anomaly.asset_id,
            symbol=symbol,
            zscore=anomaly.zscore,
            direction=anomaly.direction,
            message=anomaly.message,
            created_at=anomaly.created_at,
        )
        for anomaly, symbol in rows
    ]


@router.post("/devices", status_code=201)
def register_device(payload: DeviceTokenIn, db: Session = Depends(get_db)):
    existing = db.query(DeviceToken).filter(DeviceToken.token == payload.token).one_or_none()
    if existing is None:
        db.add(DeviceToken(token=payload.token))
        db.commit()
    return {"status": "ok"}
