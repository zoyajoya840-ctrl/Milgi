from uuid import UUID

from pydantic import BaseModel


class RideRequest(BaseModel):
    passenger_id: UUID
    pickup_location: str
    drop_location: str
    estimated_fare: float | None = None


class RideResponse(BaseModel):
    ride_id: UUID
    passenger_id: UUID
    driver_id: UUID | None
    pickup_location: str
    drop_location: str
    status: str
    estimated_fare: float | None

class RideAcceptRequest(BaseModel):
    driver_id: UUID


class RideActionResponse(BaseModel):
    message: str
    ride_id: UUID
    status: str