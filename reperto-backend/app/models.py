from sqlalchemy import Table, Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)

class Case(Base):
    __tablename__ = "cases"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    initials = Column(String)
    specialty = Column(String)
    time = Column(String)
    summary = Column(Text, nullable=True)
    rubrics = Column(Text, nullable=True) # JSON string
    remedies = Column(Text, nullable=True) # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
