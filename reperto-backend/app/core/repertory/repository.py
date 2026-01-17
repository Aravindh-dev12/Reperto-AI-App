from sqlalchemy.orm import Session
from app.core.repertory.models import GoldenRubric, GoldenRemedy, GoldenRubricRemedy


# ---------------------------
# RUBRIC QUERIES
# ---------------------------

def get_all_chapters(db: Session):
    return (
        db.query(GoldenRubric.chapter)
        .distinct()
        .order_by(GoldenRubric.chapter)
        .all()
    )


def get_rubrics_by_chapter(db: Session, chapter: str):
    return (
        db.query(GoldenRubric)
        .filter(GoldenRubric.chapter == chapter)
        .order_by(GoldenRubric.depth, GoldenRubric.full_path)
        .all()
    )


def get_rubric_by_id(db: Session, rubric_id: int):
    return db.query(GoldenRubric).filter(GoldenRubric.id == rubric_id).first()


def get_rubric_by_fullpath(db: Session, fullpath: str):
    return (
        db.query(GoldenRubric)
        .filter(GoldenRubric.full_path == fullpath)
        .first()
    )


# ---------------------------
# REMEDY QUERIES
# ---------------------------

def get_remedies_for_rubric(db: Session, rubric_id: int):
    return (
        db.query(GoldenRemedy, GoldenRubricRemedy.grade)
        .join(GoldenRubricRemedy, GoldenRemedy.id == GoldenRubricRemedy.remedy_id)
        .filter(GoldenRubricRemedy.rubric_id == rubric_id)
        .all()
    )


def get_rubric_relations(db: Session, rubric_ids: list[int]):
    return (
        db.query(GoldenRubricRemedy)
        .filter(GoldenRubricRemedy.rubric_id.in_(rubric_ids))
        .all()
    )


def get_remedy_by_id(db: Session, remedy_id: int):
    return db.query(GoldenRemedy).filter(GoldenRemedy.id == remedy_id).first()
