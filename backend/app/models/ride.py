from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Ride(Base):
    __tablename__ = "rides"

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
    )

    passenger_id: Mapped[UUID] = mapped_column(
        ForeignKey("passenger_profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    driver_id: Mapped[UUID | None] = mapped_column(
        ForeignKey("driver_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    pickup_location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    drop_location: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="requested",
        nullable=False,
        index=True,
    )

    estimated_fare: Mapped[float | None] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    accepted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )