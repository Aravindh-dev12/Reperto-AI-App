# backend/app/models.py
from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("name", String(100), nullable=False),
    Column("email", String(150), unique=True, nullable=False),
    Column("password_hash", String(255), nullable=False),
)
