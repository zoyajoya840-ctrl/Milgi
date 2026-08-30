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