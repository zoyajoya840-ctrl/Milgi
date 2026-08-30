from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class DriverProfile(Base):
    __tablename__ = "driver_profiles"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    license_number: Mapped[str | None] = mapped_column(
        String(100),
        unique=True,
        nullable=True,
    )

    verification_status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    driver_status: Mapped[str] = mapped_column(
        String(30),
        default="offline",
        nullable=False,
    )

    operating_city: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )