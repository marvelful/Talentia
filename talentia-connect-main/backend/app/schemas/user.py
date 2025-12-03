from pydantic import BaseModel, EmailStr
from typing import Literal


UserRoleLiteral = Literal["STUDENT", "COMPANY", "MENTOR", "UNIVERSITY_ADMIN", "SUPER_ADMIN"]


class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRoleLiteral


class UserCreate(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    password: str
    role: Literal["STUDENT", "COMPANY", "MENTOR", "UNIVERSITY_ADMIN"]


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    firstName: str
    lastName: str
    role: UserRoleLiteral

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    accessToken: str
    user: UserOut
