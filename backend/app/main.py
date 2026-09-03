import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.database import Base, engine
from app.workers.scheduler import start_scheduler

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Fiyat Radar API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    start_scheduler()


@app.get("/health")
def health():
    return {"status": "ok"}
