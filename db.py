from sqlalchemy import TIMESTAMP, create_engine, func
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.dialects.postgresql import BYTEA
from geoalchemy2 import Geometry
from sqlalchemy.orm import sessionmaker
from app import settings

Base = declarative_base()


class Tracks(Base):
    __tablename__ = "tracks"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    time = Column(String)
    geometry = Column(Geometry("LINESTRING", srid=4326))


class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(255), nullable=False, unique=True)
    password_hash = Column(BYTEA, nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    created_at = Column(TIMESTAMP, server_default=func.current_timestamp())
    updated_at = Column(
        TIMESTAMP,
        server_default=func.current_timestamp(),
        onupdate=func.current_timestamp(),
    )


engine = create_engine(settings.pg_dsn, echo=True)

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
