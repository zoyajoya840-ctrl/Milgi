from uuid import UUID

from pydantic import BaseModel


class VehicleCreate(BaseModel):

    driver_id: UUID

    vehicle_type: str = "auto"

    registration_number: str

    vehicle_model: str | None = None

    vehicle_color: str | None = None


class VehicleResponse(BaseModel):

    id: UUID

    driver_id: UUID

    vehicle_type: str

    registration_number: str

    vehicle_model: str | None

    vehicle_color: str | None

    verification_status: str

    is_active: bool