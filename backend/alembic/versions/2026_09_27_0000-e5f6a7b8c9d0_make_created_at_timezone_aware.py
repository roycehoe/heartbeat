"""make created_at timezone aware

Existing values were written as naive UTC, so they are reinterpreted with an
explicit UTC offset rather than being reinterpreted in the server's timezone.

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2026-09-27 00:00:00.000000

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "e5f6a7b8c9d0"
down_revision: Union[str, Sequence[str], None] = "d4e5f6a7b8c9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_TABLES = ("mood", "care_receipient")


def upgrade() -> None:
    for table in _TABLES:
        op.alter_column(
            table,
            "created_at",
            type_=sa.TIMESTAMP(timezone=True),
            existing_type=sa.TIMESTAMP(),
            existing_nullable=False,
            postgresql_using="created_at AT TIME ZONE 'UTC'",
        )


def downgrade() -> None:
    for table in _TABLES:
        op.alter_column(
            table,
            "created_at",
            type_=sa.TIMESTAMP(),
            existing_type=sa.TIMESTAMP(timezone=True),
            existing_nullable=False,
            postgresql_using="created_at AT TIME ZONE 'UTC'",
        )
