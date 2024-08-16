from fastapi import FastAPI
from routers import router
from models import create_db_and_tables
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    # Add future cleanup code here.

app = FastAPI(lifespan=lifespan)

app.include_router(router)
