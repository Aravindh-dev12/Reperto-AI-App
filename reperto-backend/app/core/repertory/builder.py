from app.database import SessionLocal
from app.core.repertory.engine import OorepSessionLocal
from app.core.repertory.loader import build_golden_repertory


def run_build():
    golden_db = SessionLocal()
    oorep_db = OorepSessionLocal()

    try:
        build_golden_repertory(golden_db, oorep_db)
    finally:
        golden_db.close()
        oorep_db.close()


if __name__ == "__main__":
    run_build()
