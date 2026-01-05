from app.database import engine, Base
from app.models import User, Patient, Case, Rubric, Remedy

def create_tables():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Tables created successfully!")

if __name__ == "__main__":
    create_tables()