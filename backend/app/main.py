import os
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import jwt
from datetime import datetime, timedelta
import uuid

from app.database import get_db, engine, Base
from app import models, schemas, auth, ai
from dotenv import load_dotenv

load_dotenv()

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Reperto AI Medical System")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get current user
def get_current_user(
    token: str = Depends(auth.oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.JWTError:
        raise credentials_exception
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# Auth endpoints
@app.post("/auth/signup", response_model=schemas.Token)
async def signup(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    hashed_password = auth.get_password_hash(user_data.password)
    db_user = models.User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create token
    access_token = auth.create_access_token(data={"sub": user_data.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": schemas.UserResponse.from_orm(db_user)
    }

@app.post("/auth/login", response_model=schemas.Token)
async def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth.verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": schemas.UserResponse.from_orm(user)
    }

@app.get("/auth/me", response_model=schemas.UserResponse)
async def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# Patient endpoints
@app.post("/patients/", response_model=schemas.PatientResponse)
async def create_patient(
    patient: schemas.PatientCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Generate unique patient ID
    patient_id = f"PT-{uuid.uuid4().hex[:8].upper()}"
    
    db_patient = models.Patient(
        patient_id=patient_id,
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        phone=patient.phone,
        address=patient.address,
        medical_history=patient.medical_history,
        user_id=current_user.id
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.get("/patients/", response_model=List[schemas.PatientResponse])
async def get_patients(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patients = db.query(models.Patient).filter(
        models.Patient.user_id == current_user.id
    ).order_by(models.Patient.created_at.desc()).offset(skip).limit(limit).all()
    return patients

@app.get("/patients/{patient_id}", response_model=schemas.PatientResponse)
async def get_patient(
    patient_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient = db.query(models.Patient).filter(
        models.Patient.id == patient_id,
        models.Patient.user_id == current_user.id
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

# Case endpoints
@app.post("/cases/", response_model=schemas.CaseResponse)
async def create_case(
    case: schemas.CaseCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if patient belongs to user
    patient = db.query(models.Patient).filter(
        models.Patient.id == case.patient_id,
        models.Patient.user_id == current_user.id
    ).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Generate unique case ID
    case_id = f"CASE-{uuid.uuid4().hex[:8].upper()}"
    
    db_case = models.Case(
        case_id=case_id,
        title=case.title,
        complaint=case.complaint,
        user_id=current_user.id,
        patient_id=case.patient_id
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

@app.get("/cases/", response_model=List[schemas.CaseResponse])
async def get_cases(
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cases = db.query(models.Case).filter(
        models.Case.user_id == current_user.id
    ).order_by(models.Case.created_at.desc()).offset(skip).limit(limit).all()
    return cases

@app.get("/cases/{case_id}", response_model=schemas.CaseCompleteResponse)
async def get_case(
    case_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    case = db.query(models.Case).filter(
        models.Case.id == case_id,
        models.Case.user_id == current_user.id
    ).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    rubrics = db.query(models.Rubric).filter(
        models.Rubric.case_id == case_id
    ).all()
    
    remedies = db.query(models.Remedy).filter(
        models.Remedy.case_id == case_id
    ).order_by(models.Remedy.percentage.desc()).all()
    
    return {
        "case": case,
        "rubrics": rubrics,
        "remedies": remedies
    }

@app.post("/cases/{case_id}/analyze")
async def analyze_case(
    case_id: int,
    ai_request: schemas.AIParseRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get case
    case = db.query(models.Case).filter(
        models.Case.id == case_id,
        models.Case.user_id == current_user.id
    ).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Call AI
    analysis = ai.parse_text_endpoint(ai_request.text)
    
    # Update case with summary
    case.summary = analysis.get("summary", "")
    case.risk_level = analysis.get("risk", "unknown")
    case.status = "analyzed"
    db.commit()
    db.refresh(case)
    
    # Save rubrics
    rubrics_data = analysis.get("rubrics", [])
    for rubric_data in rubrics_data:
        rubric = models.Rubric(
            path=rubric_data.get("path", ""),
            confidence=rubric_data.get("confidence", 0),
            evidence=rubric_data.get("evidence", ""),
            category=rubric_data.get("category", ""),
            case_id=case_id
        )
        db.add(rubric)
    db.commit()
    
    # Generate remedies (simulated for now)
    remedies_data = generate_remedies_from_rubrics(rubrics_data)
    for remedy_data in remedies_data:
        remedy = models.Remedy(
            name=remedy_data.get("name", ""),
            percentage=remedy_data.get("percentage", 0),
            matched_rubrics=remedy_data.get("matched_rubrics", []),
            details=remedy_data.get("details", ""),
            case_id=case_id
        )
        db.add(remedy)
    db.commit()
    
    # Get updated data
    rubrics = db.query(models.Rubric).filter(
        models.Rubric.case_id == case_id
    ).all()
    
    remedies = db.query(models.Remedy).filter(
        models.Remedy.case_id == case_id
    ).order_by(models.Remedy.percentage.desc()).all()
    
    return {
        "case": case,
        "rubrics": rubrics,
        "remedies": remedies
    }

def generate_remedies_from_rubrics(rubrics: list) -> list:
    """Generate remedy suggestions based on rubrics."""
    common_remedies = [
        {"name": "Nux Vomica", "percentage": 98, "matched_rubrics": ["Mind-Irritable", "Stomach-Nausea"], "details": "For digestive issues with irritability"},
        {"name": "Arsenicum Album", "percentage": 95, "matched_rubrics": ["Anxiety", "Restlessness"], "details": "For anxiety and restlessness with burning pains"},
        {"name": "Pulsatilla", "percentage": 85, "matched_rubrics": ["Weeping", "Changeable"], "details": "For emotional symptoms with changeability"},
        {"name": "Sulphur", "percentage": 80, "matched_rubrics": ["Skin-Itching", "Heat"], "details": "For skin conditions with heat sensation"},
        {"name": "Bryonia", "percentage": 75, "matched_rubrics": ["Worse-Motion", "Thirst"], "details": "For motion-related symptoms with great thirst"},
    ]
    return common_remedies[:3]

# AI endpoints
@app.post("/ai/parse-text", response_model=schemas.AIAnalysisResponse)
async def parse_text(
    request: schemas.AIParseRequest,
    current_user: models.User = Depends(get_current_user)
):
    result = ai.parse_text_endpoint(request.text)
    return result

@app.post("/ai/suggest-complaint")
async def suggest_complaint(
    request: schemas.AIParseRequest,
    current_user: models.User = Depends(get_current_user)
):
    """AI suggestion for completing complaint text"""
    try:
        # Use the existing AI function with a different prompt
        prompt = f"Complete this medical complaint with relevant symptoms, history, and details:\n\n{request.text}\n\nComplete complaint:"
        
        # Use the OpenAI client directly
        from openai import OpenAI
        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You are a medical assistant. Given a partial patient complaint, suggest how to complete it with relevant symptoms, history, and details. Return only the suggested text."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3,
            max_tokens=200,
        )
        
        suggestion = response.choices[0].message.content.strip()
        return {"suggestion": suggestion}
    
    except Exception as e:
        print(f"AI suggestion error: {e}")
        return {"suggestion": "Unable to generate suggestion. Please add more details about symptoms, duration, and history."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)