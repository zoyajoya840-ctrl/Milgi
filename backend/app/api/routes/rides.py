from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.driver_profile import DriverProfile
from app.models.passenger_profile import PassengerProfile
from app.models.ride import Ride
from app.schemas.ride import (
    RideAcceptRequest,
    RideActionResponse,
    RideRequest,
)


router = APIRouter(
    prefix="/rides",
    tags=["Rides"],
)


@router.post("/request")
def request_ride(
    data: RideRequest,
    db: Session = Depends(get_db),
):
    passenger = (
        db.query(PassengerProfile)
        .filter(PassengerProfile.id == data.passenger_id)
        .first()
    )

    if passenger is None:
        raise HTTPException(
            status_code=404,
            detail="Passenger profile not found",
        )

    ride = Ride(
        passenger_id=data.passenger_id,
        pickup_location=data.pickup_location,
        drop_location=data.drop_location,
        estimated_fare=data.estimated_fare,
        status="requested",
    )

    db.add(ride)
    db.commit()
    db.refresh(ride)

    return {
        "message": "Ride requested successfully",
        "ride_id": str(ride.id),
        "status": ride.status,
    }


@router.get("/available")
def get_available_rides(
    db: Session = Depends(get_db),
):
    rides = (
        db.query(Ride)
        .filter(Ride.status == "requested")
        .order_by(Ride.created_at.asc())
        .all()
    )

    return rides


@router.post(
    "/{ride_id}/accept",
    response_model=RideActionResponse,
)
def accept_ride(
    ride_id: str,
    data: RideAcceptRequest,
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

    ride = (
        db.query(Ride)
        .filter(Ride.id == ride_id)
        .first()
    )

    if ride is None:
        raise HTTPException(
            status_code=404,
            detail="Ride not found",
        )

    if ride.status != "requested":
        raise HTTPException(
            status_code=400,
            detail="Ride is no longer available",
        )

    ride.driver_id = data.driver_id
    ride.status = "accepted"
    ride.accepted_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ride)

    return {
        "message": "Ride accepted successfully",
        "ride_id": ride.id,
        "status": ride.status,
    }

@router.post(
    "/{ride_id}/start",
    response_model=RideActionResponse,
)
def start_ride(
    ride_id: str,
    db: Session = Depends(get_db),
):
    ride = (
        db.query(Ride)
        .filter(Ride.id == ride_id)
        .first()
    )

    if ride is None:
        raise HTTPException(
            status_code=404,
            detail="Ride not found",
        )

    if ride.status != "accepted":
        raise HTTPException(
            status_code=400,
            detail="Ride must be accepted before starting",
        )

    ride.status = "started"
    ride.started_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ride)

    return {
        "message": "Ride started successfully",
        "ride_id": ride.id,
        "status": ride.status,
    }

@router.post(
    "/{ride_id}/complete",
    response_model=RideActionResponse,
)
def complete_ride(
    ride_id: str,
    db: Session = Depends(get_db),
):
    ride = (
        db.query(Ride)
        .filter(Ride.id == ride_id)
        .first()
    )

    if ride is None:
        raise HTTPException(
            status_code=404,
            detail="Ride not found",
        )

    if ride.status != "started":
        raise HTTPException(
            status_code=400,
            detail="Ride must be started before completing",
        )

    ride.status = "completed"
    ride.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(ride)

    return {
        "message": "Ride completed successfully",
        "ride_id": ride.id,
        "status": ride.status,
    }