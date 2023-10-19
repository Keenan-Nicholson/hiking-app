from pydantic import BaseSettings


class Settings(BaseSettings):
    pg_dsn: str = "postgresql://postgres:password@127.0.0.1:5432/postgres"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
