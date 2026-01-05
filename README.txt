Reperto AI

Frontend (Expo React Native)
----------------------------
1. Install Node / Yarn / Expo CLI
2. cd frontend
3. npm install
4. expo start

Backend (FastAPI)
-----------------
1. Create python venv
2. python -m venv venv / venv\Scripts\activate 
2. pip install -r requirements.txt / python -m app.create_tables
3. Copy .env.example to .env and set OPENAI_API_KEY 
4. uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Notes
-----
- The OpenAI API key must be stored on the backend only.
- This MVP contains a minimal in-memory auth store for quick testing. Replace with DB for production.
- Frontend uses http://10.0.2.2:8000 as backend URL for Android emulator; change to your server IP when testing on device.
- UI uses white background and light purple accents as requested.
