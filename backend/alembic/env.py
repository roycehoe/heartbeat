# NOTE: There is no automated base-schema creation. The init migration (1f0eaf0d0ffe)
# is an empty stub, there is no SQLModel.metadata.create_all anywhere (startup only
# starts the scheduler), and the later migrations ALTER care_receipient without ever
# creating it. `alembic upgrade head` therefore only works against a DB that already
# has the base tables; running it from an empty DB fails. This predates the
# routing/auth refactor; a baseline create-table migration is owed (follow-up task).
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

import models  # noqa: F401 — registers all SQLModel table classes with SQLModel.metadata
from sqlmodel import SQLModel

from alembic import context
from settings import AppSettings

config = context.config
config.set_main_option("sqlalchemy.url", AppSettings.SQLALCHEMY_DATABASE_URL_STAGING)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
