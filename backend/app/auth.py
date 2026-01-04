# backend/app/auth.py
import os
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

# local imports (relative)
from .database import database
from .models import users

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

async def create_user(name: str, email: str, password: str):
    # bcrypt hard limit: 72 bytes
    password = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")

    query = users.select().where(users.c.email == email)
    existing = await database.fetch_one(query)
    if existing:
        return False

    hashed = pwd_ctx.hash(password)
    insert_q = users.insert().values(
        name=name,
        email=email,
        password_hash=hashed
    )
    await database.execute(insert_q)
    return True


async def authenticate_user(email: str, password: str):
    password = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")

    query = users.select().where(users.c.email == email)
    user = await database.fetch_one(query)
    if not user:
        return None

    if not pwd_ctx.verify(password, user["password_hash"]):
        return None

    access_token = create_access_token(user["email"])
    return access_token


def create_access_token(subject: str, expires_delta: int | None = None):
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": subject}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
