from datetime import datetime

from pydantic import BaseModel


class AssetOut(BaseModel):
    id: int
    symbol: str
    display_name: str
    asset_type: str

    class Config:
        from_attributes = True


class PriceTickOut(BaseModel):
    price: float
    recorded_at: datetime

    class Config:
        from_attributes = True


class AnomalyOut(BaseModel):
    id: int
    asset_id: int
    symbol: str
    zscore: float
    direction: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True


class DeviceTokenIn(BaseModel):
    token: str
