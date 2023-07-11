from contextlib import asynccontextmanager
from tipg.database import close_db_connection, connect_to_db
from tipg.collections import register_collection_catalog
from tipg.errors import DEFAULT_STATUS_CODES, add_exception_handlers
from tipg.factory import OGCFeaturesFactory
from tipg.settings import PostgresSettings

from fastapi import FastAPI

from typing import Any, Callable, Set

from pydantic import PostgresDsn, BaseSettings

import uvicorn

class Settings(BaseSettings):
    pg_dsn: PostgresDsn = 'postgres://postgres:password@localhost:5432/postgres'

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'

settings = Settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI Lifespan

    - Create DB connection POOL and `register` the custom tipg SQL function within `pg_temp`
    - Create the collection_catalog
    - Close the connection pool when closing the application

    """
    await connect_to_db(
        app,
        settings=PostgresSettings(database_url=settings.pg_dsn),
        schemas=["public"],
    )
    await register_collection_catalog(app, schemas=["public"])

    yield

    await close_db_connection(app)


app = FastAPI(openapi_url="/api", docs_url="/api.html", lifespan=lifespan)

endpoints = OGCFeaturesFactory(with_common=True)
app.include_router(endpoints.router, tags=["OGC Features API"])

add_exception_handlers(app, DEFAULT_STATUS_CODES)

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, log_level="info")