# app/database.py
import os
from sqlalchemy import create_engine, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Optional: Use SQLite if DATABASE_URL is provided
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./reperto_db.sqlite"
)

# For development with SQLite
try:
    if "sqlite" in DATABASE_URL:
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    else:
        engine = create_engine(DATABASE_URL)
    
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
except Exception as e:
    print(f"Database connection warning: {e}")
    raise e
