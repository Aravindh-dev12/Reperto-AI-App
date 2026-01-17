# backend/app/create_tables.py
import sys
import os

# Add the current directory to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import text
from app.database import engine, Base
# Import all models to register them
from app.models import User, Case
from app.core.repertory.models import GoldenRubric, GoldenRemedy, GoldenRubricRemedy

def create():
    if engine is None:
        print("Error: Database engine is not configured. Check your DATABASE_URL.")
        return
        
    print("⏳ Creating tables...")
    Base.metadata.create_all(bind=engine)

    # Add proprietary dataset table
    with engine.connect() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS clinical_phrase_map (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                doctor_text TEXT NOT NULL,
                normalized_tokens TEXT NOT NULL,
                rubric TEXT NOT NULL,
                confidence REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """))
        conn.commit()

    print("✅ Tables created successfully in SQLite (reperto_db.sqlite)")

if __name__ == "__main__":
    create()
