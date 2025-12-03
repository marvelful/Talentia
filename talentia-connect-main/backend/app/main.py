from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from .api.api_v1.api import api_router
from .core.config import settings
from .db.session import Base, engine
from . import models  # noqa: F401  # ensure all models are imported

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="TALENTIA API", openapi_url="/api/openapi.json")

# CORS configuration for development: allow any origin (no credentials)
# This works because we are not using cookies for auth, only Bearer tokens.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
