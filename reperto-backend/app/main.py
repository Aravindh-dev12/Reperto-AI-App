# backend/app/main.py
from app.database import SessionLocal
from app.core.cdss.case_analyzer import analyze_case
from app.core.repertory.repository import get_rubric_by_fullpath
from app.core.repertory.scoring import score_remedies
from app.core.cdss.explanation import build_explanations
import os
import uuid
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional

from dotenv import load_dotenv
load_dotenv()

from .database import SessionLocal
from .models import User, Case
from .schemas import UserCreate, UserLogin, Token, CaseResponse, CaseCreate, UserResponse
from .auth import create_user, authenticate_user, create_access_token, SECRET_KEY, ALGORITHM
from .ai import parse_text_endpoint
from sqlalchemy.orm import Session
from jose import jwt, JWTError
import json

app = FastAPI(title="Reperto AI Backend")

# Health check endpoint
@app.get("/", tags=["health"])
async def health_check():
    """Root endpoint - returns API status."""
    return {"status": "ok", "service": "Reperto AI Backend", "version": "1.0"}

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to frontend domain in production (e.g., ["https://frontend.example.com"])
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return {"name": user.name, "email": user.email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.on_event("startup")
async def startup():
    # We no longer need database.connect() since we use SQLAlchemy engine directly
    pass

@app.on_event("shutdown")
async def shutdown():
    pass

@app.post("/auth/signup", response_model=dict)
async def signup(payload: UserCreate, db: Session = Depends(get_db)):
    success = create_user(db, payload.name, payload.email, payload.password)
    if not success:
        raise HTTPException(status_code=400, detail="User already exists")
    return {"status":"ok"}

@app.post("/auth/login", response_model=Token)
async def login(payload: UserLogin, db: Session = Depends(get_db)):
    auth_data = authenticate_user(db, payload.email, payload.password)
    if not auth_data:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return auth_data

@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

@app.get("/cases", response_model=List[CaseResponse])
async def get_cases(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    cases = db.query(Case).order_by(Case.created_at.desc()).all()
    # Convert string JSON back to lists/dicts for response
    result = []
    for c in cases:
        case_dict = {
            "id": c.id,
            "name": c.name,
            "initials": c.initials,
            "specialty": c.specialty,
            "time": c.time,
            "summary": c.summary,
            "rubrics": json.loads(c.rubrics) if c.rubrics else [],
            "remedies": json.loads(c.remedies) if c.remedies else []
        }
        result.append(case_dict)
    return result

@app.post("/cases", response_model=CaseResponse)
async def create_case(payload: CaseCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    case_id = str(uuid.uuid4())
    new_case = Case(
        id=case_id,
        name=payload.name,
        initials=payload.initials,
        specialty=payload.specialty,
        time=payload.time,
        summary=payload.summary,
        rubrics=json.dumps(payload.rubrics) if payload.rubrics else "[]",
        remedies=json.dumps(payload.remedies) if payload.remedies else "[]"
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    
    return {
        "id": new_case.id,
        "name": new_case.name,
        "initials": new_case.initials,
        "specialty": new_case.specialty,
        "time": new_case.time,
        "summary": new_case.summary,
        "rubrics": payload.rubrics or [],
        "remedies": payload.remedies or []
    }

@app.post("/ai/parse-text")
async def parse_text(body: dict, current_user: dict = Depends(get_current_user)):
    text = body.get("text", "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    return parse_text_endpoint(text)

@app.post("/cdss/analyze")
def cdss_analyze(
    body: dict,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    text = body.get("text", "").strip()

    if not text:
        raise HTTPException(status_code=400, detail="No text provided")

    result = analyze_case(db, text)

    return {
        "user": current_user,
        "input": text,
        "result": result
    }

@app.post("/cdss/score")
def cdss_score(
    body: dict,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    rubric_paths = body.get("rubrics", [])
    if not rubric_paths:
        return {"remedies": []}

    # Fetch rubric objects
    rubrics = []
    for path in rubric_paths:
        r = get_rubric_by_fullpath(db, path)
        if r:
            rubrics.append(r)

    if not rubrics:
        return {"remedies": []}

    # 3. Deterministic repertory scoring
    raw_scores = score_remedies(db, rubrics)
    explained_scores = build_explanations(db, raw_scores, rubrics)

    return {
        "remedies": explained_scores[:10]
    }
