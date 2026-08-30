from uuid import UUID

from pydantic import BaseModel


class DriverProfileCreate(BaseModel):

    user_id: UUID

    license_number: str | None = None

    operating_city: str | None = None


class DriverProfileResponse(BaseModel):

    id: UUID

    user_id: UUID

    license_number: str | None

    verification_status: str

    driver_status: str

    operating_city: str | None
