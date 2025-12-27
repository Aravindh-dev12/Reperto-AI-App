from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import jwt
from auth import create_user, authenticate_user, UserCreate, UserLogin
from ai import parse_text_endpoint

app = FastAPI(title='Reperto AI Backend')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.post('/auth/signup')
async def signup(payload: UserCreate):
    ok = create_user(payload.name,payload.email,payload.password)
    if not ok:
        raise HTTPException(status_code=400,detail='User exists')
    return {'status':'ok'}

@app.post('/auth/login')
async def login(payload: UserLogin):
    token = authenticate_user(payload.email,payload.password)
    if not token:
        raise HTTPException(status_code=401,detail='Invalid credentials')
    return {'access_token':token}

@app.post('/ai/parse-text')
async def parse_text(body: dict):
    text = body.get('text','')
    if not text:
        raise HTTPException(status_code=400,detail='No text')
    return await parse_text_endpoint(text)
