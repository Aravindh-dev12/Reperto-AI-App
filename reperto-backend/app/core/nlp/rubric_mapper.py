from app.core.nlp.normalizer import normalize_input
from app.core.repertory.rubric_search import search_rubrics
from app.core.nlp.rubric_confidence import compute_rubric_confidence


def map_text_to_rubrics(db, doctor_text: str, limit=30):
    """
    Doctor text → rubric candidates with confidence
    """

    normalized_tokens = normalize_input(doctor_text)

    query = " ".join(normalized_tokens)

    rubrics = search_rubrics(db, query, limit=limit)

    ranked = []

    for r in rubrics:
        confidence, matched = compute_rubric_confidence(r, normalized_tokens)

        if confidence > 0:
            ranked.append({
                "rubric": r,
                "confidence": confidence,
                "matched_tokens": matched
            })

    ranked.sort(key=lambda x: x["confidence"], reverse=True)

    return normalized_tokens, ranked
