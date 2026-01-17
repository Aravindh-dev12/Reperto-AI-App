from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# OOREP PostgreSQL connection (source DB)
OOREP_DATABASE_URL = "postgresql://postgres:Anil%409052@localhost:5432/oorep_raw"

oorep_engine = create_engine(OOREP_DATABASE_URL)
OorepSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=oorep_engine)
