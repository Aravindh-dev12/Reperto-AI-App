from pydantic import BaseModel
import hashlib, os, jwt, time
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
SECRET = os.environ.get('SECRET_KEY','reperto-secret')

# In-memory users (for MVP). Replace with DB in prod.
_users = {}

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

def create_user(name,email,password):
    if email in _users:
        return False
    hashed = pwd_context.hash(password)
    _users[email] = {'name':name,'password':hashed}
    return True

def authenticate_user(email,password):
    user = _users.get(email)
    if not user:
        return None
    if not pwd_context.verify(password,user['password']):
        return None
    # simple JWT
    payload = {'sub':email,'iat':int(time.time())}
    token = jwt.encode(payload,SECRET,algorithm='HS256')
    return token
