from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    IS_PROD: bool = True
    DB_ENCRYPTION_SECRET: str
    ADMIN_PASSWORD: str
    SQLALCHEMY_DATABASE_URL_STAGING: str = (
        "postgresql://postgres:password@localhost:5432/postgres"
    )
    PHONE_NUMBER_ID: str
    WHATSAPP_API_ACCESS_TOKEN: str
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: str
    CLERK_SECRET_KEY: str
    SUPERADMIN_CLERK_ID: str
    ERRANT_USER_CONSECUTIVE_NON_CHECKIN_CRITERION: int = 3

    model_config = SettingsConfigDict(env_file=".env", frozen=True)


AppSettings = Settings()
