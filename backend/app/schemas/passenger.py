from uuid import UUID

from pydantic import BaseModel


class PassengerProfileCreate(BaseModel):
    user_id: UUID
    preferred_language: str = "hinglish"
    home_location: str | None = None
    work_location: str | None = None
    emergency_contact_name: str | None = None
    emergency_contact_phone: str | None = None


class PassengerProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    preferred_language: str
    home_location: str | None
    work_location: str | None
    emergency_contact_name: str | None
    emergency_contact_phone: str | None