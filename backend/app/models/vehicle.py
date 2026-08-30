from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    driver_id: Mapped[UUID] = mapped_column(
        ForeignKey("driver_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    vehicle_type: Mapped[str] = mapped_column(
        String(50),
        default="auto",
        nullable=False,
    )

    registration_number: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    vehicle_model: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    vehicle_color: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    verification_status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        default=True,
        nullable=False,
    )