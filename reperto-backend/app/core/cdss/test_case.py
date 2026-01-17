from app.database import SessionLocal
from app.core.cdss.case_analyzer import analyze_case


def run():
    db = SessionLocal()
    try:
        text = "patient has anxiety, neend nahi aa rahi, pet me jalan"

        result = analyze_case(db, text)

        print("\n==============================")
        print("   REPERTO AI — CDSS RESULT")
        print("==============================")

        print("\nDoctor input:")
        print(text)

        print("\nSystem understanding (rubrics):")
        for r in result["rubrics"]:
            print(" -", r["rubric"])
            print("   confidence:", r["confidence"])
            print("   matched:", r["matched"])

        print("\nTop remedies with explanation:")

        for i, rem in enumerate(result["remedies"], start=1):
            print(f"\n{i}. {rem['remedy']}  |  Score: {rem['score']}")

            for r in rem["rubrics"]:
                print("   -", r["rubric"], "| grades:", r["grades"], "| total:", r["total"])



    finally:
        db.close()


if __name__ == "__main__":
    run()
