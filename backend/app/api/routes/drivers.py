from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.driver_profile import DriverProfile
from app.models.user import User
from app.schemas.driver import (
    DriverProfileCreate,
    DriverProfileResponse,
)


router = APIRouter(
    prefix="/drivers",
    tags=["Drivers"],
)


@router.post(
    "/profile",
    response_model=DriverProfileResponse,
)
def create_driver_profile(
    data: DriverProfileCreate,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.id == data.user_id)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    if user.role != "driver":
        raise HTTPException(
            status_code=403,
            detail="User is not a driver",
        )

    existing_profile = (
        db.query(DriverProfile)
        .filter(DriverProfile.user_id == data.user_id)
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Driver profile already exists",
        )

    profile = DriverProfile(
        user_id=data.user_id,
        license_number=data.license_number,
        operating_city=data.operating_city,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


@router.post("/{driver_id}/online")
def driver_go_online(
    driver_id: str,
    db: Session = Depends(get_db),
):
    driver = (
        db.query(DriverProfile)
        .filter(DriverProfile.id == driver_id)
        .first()
    )

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver profile not found",
        )

    if driver.verification_status != "approved":
        raise HTTPException(
            status_code=403,
            detail="Driver is not verified yet",
        )

    driver.driver_status = "online"

    db.commit()
    db.refresh(driver)

    return {
        "message": "Driver is now online",
        "driver_id": str(driver.id),
        "driver_status": driver.driver_status,
    }


@router.post("/{driver_id}/offline")
def driver_go_offline(
    driver_id: str,
    db: Session = Depends(get_db),
):
    driver = (
        db.query(DriverProfile)
        .filter(DriverProfile.id == driver_id)
        .first()
    )

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver profile not found",
        )

    driver.driver_status = "offline"

    db.commit()
    db.refresh(driver)

    return {
        "message": "Driver is now offline",
        "driver_id": str(driver.id),
        "driver_status": driver.driver_status,
    }


@router.get("/{driver_id}/status")
def get_driver_status(
    driver_id: str,
    db: Session = Depends(get_db),
):
    driver = (
        db.query(DriverProfile)
        .filter(DriverProfile.id == driver_id)
        .first()
    )

    if driver is None:
        raise HTTPException(
            status_code=404,
            detail="Driver profile not found",
        )

    return {
        "driver_id": str(driver.id),
        "driver_status": driver.driver_status,
        "verification_status": driver.verification_status,
    }

@router.get("/{driver_id}/rides")
def get_driver_rides(
    driver_id: str,
    db: Session = Depends(get_db),
):
    from app.models.ride import Ride

    rides = (
        db.query(Ride)
        .filter(Ride.driver_id == driver_id)
        .order_by(Ride.created_at.desc())
        .all()
    )

    return rides