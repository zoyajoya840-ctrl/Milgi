from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class PassengerProfile(Base):
    __tablename__ = "passenger_profiles"

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

    preferred_language: Mapped[str] = mapped_column(
        String(20),
        default="hinglish",
        nullable=False,
    )

    home_location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    work_location: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    emergency_contact_name: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
    )

    emergency_contact_phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
    )