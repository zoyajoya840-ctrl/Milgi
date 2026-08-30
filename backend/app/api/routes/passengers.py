from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.passenger_profile import PassengerProfile
from app.models.user import User
from app.schemas.passenger import (
    PassengerProfileCreate,
    PassengerProfileResponse,
)


router = APIRouter(
    prefix="/passengers",
    tags=["Passengers"],
)


@router.post(
    "/profile",
    response_model=PassengerProfileResponse,
)
def create_passenger_profile(
    data: PassengerProfileCreate,
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

    if user.role != "passenger":
        raise HTTPException(
            status_code=403,
            detail="User is not a passenger",
        )

    existing_profile = (
        db.query(PassengerProfile)
        .filter(PassengerProfile.user_id == data.user_id)
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Passenger profile already exists",
        )

    profile = PassengerProfile(
        user_id=data.user_id,
        preferred_language=data.preferred_language,
        home_location=data.home_location,
        work_location=data.work_location,
        emergency_contact_name=data.emergency_contact_name,
        emergency_contact_phone=data.emergency_contact_phone,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile