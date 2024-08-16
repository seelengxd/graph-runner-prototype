from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import router
from models import create_db_and_tables
from contextlib import asynccontextmanager

origins = [
    "http://localhost:3000",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    # Add future cleanup code here.


app = FastAPI(lifespan=lifespan)

app.add_middleware(CORSMiddleware, allow_origins=origins,
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(router)
