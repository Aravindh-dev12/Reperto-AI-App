from app.database import SessionLocal
from app.core.nlp.rubric_mapper import map_text_to_rubrics


def run():
    db = SessionLocal()
    try:
        text = "patient has anxiety, neend nahi aa rahi, pet me jalan"

        print("\nDoctor text:")
        print(text)

        tokens, rubrics = map_text_to_rubrics(db, text)

        print("\nNormalized tokens:")
        print(tokens)

        print("\nRubric candidates:\n")
        for r in rubrics:
            rubric_obj = r["rubric"]
            print(f"[{rubric_obj.chapter}] {rubric_obj.full_path} (Confidence: {r['confidence']:.2f})")


    finally:
        db.close()


if __name__ == "__main__":
    run()
