from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    profile_image: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Patient Schemas
class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    phone: Optional[str] = None
    address: Optional[str] = None
    medical_history: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    patient_id: str
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Case Schemas
class CaseBase(BaseModel):
    title: str
    complaint: str
    patient_id: int

class CaseCreate(CaseBase):
    pass

class CaseResponse(CaseBase):
    id: int
    case_id: str
    summary: Optional[str] = None
    risk_level: Optional[str] = None
    status: str
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Rubric Schemas
class RubricBase(BaseModel):
    path: str
    confidence: float = Field(ge=0, le=1)
    evidence: Optional[str] = None
    category: Optional[str] = None
    confirmed: bool = False

class RubricResponse(RubricBase):
    id: int
    case_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Remedy Schemas
class RemedyBase(BaseModel):
    name: str
    percentage: float = Field(ge=0, le=100)
    matched_rubrics: Optional[List[str]] = None
    details: Optional[str] = None
    selected: bool = False

class RemedyResponse(RemedyBase):
    id: int
    case_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# AI Analysis Schemas
class AIParseRequest(BaseModel):
    text: str

class AIAnalysisResponse(BaseModel):
    summary: str
    risk: str
    rubrics: List[Dict[str, Any]]

class CaseCompleteResponse(BaseModel):
    case: CaseResponse
    rubrics: List[RubricResponse]
    remedies: List[RemedyResponse]