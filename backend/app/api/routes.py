from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.api.schemas import AnomalyOut, AssetOut, DeviceTokenIn, PriceTickOut
from app.core.database import get_db
from app.models.models import Anomaly, Asset, DeviceToken, PriceTick

router = APIRouter()


@router.get("/assets", response_model=list[AssetOut])
def list_assets(db: Session = Depends(get_db)):
    return db.query(Asset).order_by(Asset.symbol).all()


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
    result = []
    for anomaly, symbol in rows:
        item = AnomalyOut.model_validate(anomaly)
        item.symbol = symbol
        result.append(item)
    return result


@router.post("/devices", status_code=201)
def register_device(payload: DeviceTokenIn, db: Session = Depends(get_db)):
    existing = db.query(DeviceToken).filter(DeviceToken.token == payload.token).one_or_none()
    if existing is None:
        db.add(DeviceToken(token=payload.token))
        db.commit()
    return {"status": "ok"}
