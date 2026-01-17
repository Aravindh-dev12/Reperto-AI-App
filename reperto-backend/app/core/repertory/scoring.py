from collections import defaultdict
from sqlalchemy.orm import Session

from app.core.repertory.repository import (
    get_rubric_relations,
    get_remedy_by_id,
)


def repertory_score(db: Session, selected_rubric_ids: list[int]):
    """
    Core CDSS scoring engine.

    Input:
        selected_rubric_ids -> list of GoldenRubric.id

    Output:
        sorted list of dicts:
        [
            {
                "remedy_id": int,
                "remedy_name": str,
                "score": int,
                "contributions": [
                    {
                        "rubric_id": int,
                        "grade": int
                    }
                ]
            }
        ]
    """

    relations = get_rubric_relations(db, selected_rubric_ids)

    remedy_scores = defaultdict(int)
    contributions = defaultdict(list)

    # accumulate scores
    for rel in relations:
        remedy_scores[rel.remedy_id] += rel.grade
        contributions[rel.remedy_id].append({
            "rubric_id": rel.rubric_id,
            "grade": rel.grade
        })

    # build final ranked list
    results = []

    for remedy_id, score in remedy_scores.items():
        remedy = get_remedy_by_id(db, remedy_id)

        results.append({
            "remedy_id": remedy_id,
            "remedy_name": remedy.long_name,
            "score": score,
            "contributions": contributions[remedy_id]
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results


def score_remedies(db: Session, rubrics: list):
    """
    Wrapper for CDSS scoring that takes GoldenRubric objects.
    """
    rubric_ids = [r.id for r in rubrics]
    return repertory_score(db, rubric_ids)
