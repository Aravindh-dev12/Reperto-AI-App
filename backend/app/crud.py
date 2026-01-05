from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
import uuid
from . import models, schemas

# Patient CRUD
def create_patient(db: Session, patient: schemas.PatientCreate, user_id: int):
    db_patient = models.Patient(
        patient_id=f"PT-{uuid.uuid4().hex[:8].upper()}",
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        phone=patient.phone,
        address=patient.address,
        medical_history=patient.medical_history,
        user_id=user_id
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def get_patients(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Patient).filter(
        models.Patient.user_id == user_id
    ).order_by(desc(models.Patient.created_at)).offset(skip).limit(limit).all()

def get_patient(db: Session, patient_id: int, user_id: int):
    return db.query(models.Patient).filter(
        models.Patient.id == patient_id,
        models.Patient.user_id == user_id
    ).first()

# Case CRUD
def create_case(db: Session, case: schemas.CaseCreate, user_id: int):
    db_case = models.Case(
        case_id=f"CASE-{uuid.uuid4().hex[:8].upper()}",
        title=case.title,
        complaint=case.complaint,
        user_id=user_id,
        patient_id=case.patient_id
    )
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case

def get_cases(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Case).filter(
        models.Case.user_id == user_id
    ).order_by(desc(models.Case.created_at)).offset(skip).limit(limit).all()

def get_case(db: Session, case_id: int, user_id: int):
    return db.query(models.Case).filter(
        models.Case.id == case_id,
        models.Case.user_id == user_id
    ).first()

def update_case_summary(db: Session, case_id: int, summary: str, risk: str):
    case = db.query(models.Case).filter(models.Case.id == case_id).first()
    if case:
        case.summary = summary
        case.risk_level = risk
        case.status = "analyzed"
        db.commit()
        db.refresh(case)
    return case

# Rubric CRUD
def create_rubrics(db: Session, rubrics: list, case_id: int):
    db_rubrics = []
    for rubric in rubrics:
        db_rubric = models.Rubric(
            path=rubric.get("path", ""),
            confidence=rubric.get("confidence", 0),
            evidence=rubric.get("evidence", ""),
            category=rubric.get("category", ""),
            case_id=case_id
        )
        db.add(db_rubric)
        db_rubrics.append(db_rubric)
    db.commit()
    for r in db_rubrics:
        db.refresh(r)
    return db_rubrics

def get_case_rubrics(db: Session, case_id: int):
    return db.query(models.Rubric).filter(
        models.Rubric.case_id == case_id
    ).all()

# Remedy CRUD
def create_remedies(db: Session, remedies: list, case_id: int):
    db_remedies = []
    for remedy in remedies:
        db_remedy = models.Remedie(
            name=remedy.get("name", ""),
            percentage=remedy.get("percentage", 0),
            matched_rubrics=remedy.get("matched_rubrics", []),
            details=remedy.get("details", ""),
            case_id=case_id
        )
        db.add(db_remedy)
        db_remedies.append(db_remedy)
    db.commit()
    for r in db_remedies:
        db.refresh(r)
    return db_remedies

def get_case_remedies(db: Session, case_id: int):
    return db.query(models.Remedy).filter(
        models.Remedy.case_id == case_id
    ).order_by(desc(models.Remedy.percentage)).all()