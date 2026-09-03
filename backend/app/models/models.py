import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class AssetType(str, enum.Enum):
    CRYPTO = "crypto"
    FOREX = "forex"


class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = (UniqueConstraint("symbol", name="uq_asset_symbol"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    symbol: Mapped[str] = mapped_column(String(20), index=True)
    display_name: Mapped[str] = mapped_column(String(50))
    asset_type: Mapped[AssetType] = mapped_column(Enum(AssetType))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    ticks: Mapped[list["PriceTick"]] = relationship(back_populates="asset")
    anomalies: Mapped[list["Anomaly"]] = relationship(back_populates="asset")


class PriceTick(Base):
    __tablename__ = "price_ticks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), index=True)
    price: Mapped[float] = mapped_column(Float)
    recorded_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    asset: Mapped["Asset"] = relationship(back_populates="ticks")


class Anomaly(Base):
    __tablename__ = "anomalies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    asset_id: Mapped[int] = mapped_column(ForeignKey("assets.id"), index=True)
    price_tick_id: Mapped[int] = mapped_column(ForeignKey("price_ticks.id"))
    zscore: Mapped[float] = mapped_column(Float)
    direction: Mapped[str] = mapped_column(String(10))  # "spike" or "drop"
    message: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    notified: Mapped[bool] = mapped_column(Boolean, default=False)

    asset: Mapped["Asset"] = relationship(back_populates="anomalies")


class DeviceToken(Base):
    __tablename__ = "device_tokens"
    __table_args__ = (UniqueConstraint("token", name="uq_device_token"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    token: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
