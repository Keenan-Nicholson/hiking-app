from contextlib import asynccontextmanager
import bcrypt
from tipg.database import close_db_connection, connect_to_db
from tipg.collections import register_collection_catalog
from tipg.errors import DEFAULT_STATUS_CODES, add_exception_handlers
from tipg.factory import OGCFeaturesFactory
from tipg.settings import PostgresSettings

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, BaseSettings

import uvicorn

from db import Session, Users, get_db

from pydantic import BaseModel
from fastapi import HTTPException, FastAPI, Response, Depends
from uuid import UUID, uuid4


from fastapi_sessions.backends.implementations import InMemoryBackend
from fastapi_sessions.session_verifier import SessionVerifier
from fastapi_sessions.frontends.implementations import SessionCookie, CookieParameters

from app_settings import settings


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


def get_user_from_database(username: str, db: Session):
    user = db.query(Users).filter(Users.username == username).first()
    return user


def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password)


def authenticate_user(username: str, password: str, db: Session):
    user = get_user_from_database(username, db)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return True


app = FastAPI(openapi_url="/api", docs_url="/api.html", lifespan=lifespan)


class SessionData(BaseModel):
    username: str


cookie_params = CookieParameters()

# Uses UUID
cookie = SessionCookie(
    cookie_name="cookie",
    identifier="general_verifier",
    auto_error=True,
    secret_key="DONOTUSE",
    cookie_params=cookie_params,
)
backend = InMemoryBackend[UUID, SessionData]()


class LoginBody(BaseModel):
    username: str
    password: str


@app.post("/login/")
async def login_user(
    login: LoginBody, response: Response, db: Session = Depends(get_db)
):
    user = get_user_from_database(login.username, db)

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(login.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect password")

    session = uuid4()
    data = SessionData(username=user.username)

    await backend.create(session, data)
    cookie.attach_to_response(response, session)

    return f"created session for {user}"


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://keenannicholson.me",
    "https://www.trekspot.club",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

endpoints = OGCFeaturesFactory(with_common=True)
app.include_router(endpoints.router, tags=["OGC Features API"])

add_exception_handlers(app, DEFAULT_STATUS_CODES)

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, log_level="info", reload=True)
