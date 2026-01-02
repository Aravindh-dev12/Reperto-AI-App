# app/database.py
import os
from databases import Database
from sqlalchemy import create_engine, MetaData

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:password@localhost:5432/reperto_db"
)

# async database (used by FastAPI)
database = Database(DATABASE_URL)

# SQLAlchemy (used for migrations / table definitions)
engine = create_engine(DATABASE_URL)
metadata = MetaData()
