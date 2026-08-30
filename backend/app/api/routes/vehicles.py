from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.vehicle import Vehicle
from app.models.driver_profile import DriverProfile
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleResponse,
)


router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"],
)


@router.post(
    "/",
    response_model=VehicleResponse,
)
def create_vehicle(
    data: VehicleCreate,
    db: Session = Depends(get_db),
):
    driver = (
        db.query(DriverProfile)
        .filter(DriverProfile.id == data.driver_id)
        .first()
    )

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver profile not found",
        )

    existing_vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.registration_number
            == data.registration_number
        )
        .first()
    )

    if existing_vehicle:
        raise HTTPException(
            status_code=400,
            detail="Vehicle with this registration number already exists",
        )

    vehicle = Vehicle(
        driver_id=data.driver_id,
        vehicle_type=data.vehicle_type,
        registration_number=data.registration_number,
        vehicle_model=data.vehicle_model,
        vehicle_color=data.vehicle_color,
    )

    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)

    return vehicle