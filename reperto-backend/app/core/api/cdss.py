from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.database import get_db
from app.core.cdss.case_analyzer import analyze_case

router = APIRouter()


class AnalyzeRequest(BaseModel):
    text: str


@router.post("/analyze")
def analyze(req: AnalyzeRequest, db=Depends(get_db)):
    result = analyze_case(db, req.text)
    return result
