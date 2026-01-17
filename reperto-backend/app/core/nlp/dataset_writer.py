import json
from sqlalchemy import text


def store_phrase_mapping(db, doctor_text, tokens, ranked_rubrics):
    """
    Save doctor language → rubric mappings
    """

    for item in ranked_rubrics:
        db.execute(
            text("""
                INSERT INTO clinical_phrase_map
                (doctor_text, normalized_tokens, rubric, confidence)
                VALUES (:d, :t, :r, :c)
            """),
            {
                "d": doctor_text,
                "t": json.dumps(tokens),
                "r": item["rubric"].full_path,
                "c": item["confidence"]
            }
        )

    db.commit()
