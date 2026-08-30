from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    role: str = "passenger"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str