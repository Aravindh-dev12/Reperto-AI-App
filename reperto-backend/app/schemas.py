# schemas.py
from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    name: str
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class CaseCreate(BaseModel):
    name: str
    initials: str
    specialty: str
    time: str
    summary: Optional[str] = None
    rubrics: Optional[List[str]] = None
    remedies: Optional[List[dict]] = None

class CaseResponse(CaseCreate):
    id: str
