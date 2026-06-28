# Setup Instructions

## 1. API Key
You need a Google Gemini API Key.
1. Go to `backend` directory.
2. Rename `.env.example` to `.env`.
3. Open `.env` and paste your API key:
   ```
   GOOGLE_API_KEY=AIzaSy...
   ```

## 2. Running the App
The app has two parts: Backend and Frontend.

### Option A: Using the script (Windows)
Double-click `run.bat` in the `d:/RAG` folder.

### Option B: Manual Start
**Backend:**
```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## 3. Access
Open your browser at `http://localhost:5173`.
