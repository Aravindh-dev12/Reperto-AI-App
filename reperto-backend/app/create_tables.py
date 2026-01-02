# backend/app/create_tables.py
from .database import engine, metadata
from .models import users

def create():
    metadata.create_all(bind=engine)
    print("Tables created (if not present)")

if __name__ == "__main__":
    create()
