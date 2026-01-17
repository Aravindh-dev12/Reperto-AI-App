from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.repertory.models import GoldenRubric


def normalize_text(text: str) -> str:
    return text.lower().strip()


def search_rubrics(db: Session, query: str, limit: int = 20):
    """
    Basic rubric discovery engine.
    Phase 1: lexical search (no AI yet)

    Input:
        query = free words ("anxiety burning stomach")
    Output:
        list of GoldenRubric
    """

    tokens = [t for t in normalize_text(query).split() if len(t) > 2]

    if not tokens:
        return []

    conditions = []
    for token in tokens:
        conditions.append(GoldenRubric.full_path.ilike(f"%{token}%"))

    results = (
        db.query(GoldenRubric)
        .filter(or_(*conditions))
        .limit(limit)
        .all()
    )

    return results
