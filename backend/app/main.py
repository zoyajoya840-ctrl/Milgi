from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.api.routes.auth import router as auth_router
from app.api.routes.rides import router as rides_router
from app.api.routes.passengers import router as passenger_router
from app.api.routes.drivers import router as driver_router
from app.api.routes.vehicles import router as vehicle_router

from app.models.driver_profile import DriverProfile
from app.models.passenger_profile import PassengerProfile
from app.models.vehicle import Vehicle


app = FastAPI(
    title=settings.app_name
)


# Allow MILGI frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Routers
app.include_router(auth_router)
app.include_router(rides_router)
app.include_router(passenger_router)
app.include_router(driver_router)
app.include_router(vehicle_router)


@app.get("/")
def home():
    return {
        "message": "MILGI Backend is running",
        "environment": settings.environment,
    }