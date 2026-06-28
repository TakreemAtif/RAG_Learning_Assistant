# Intro to Computer Vision RAG

A Retrieval-Augmented Generation (RAG) system for studying Computer Vision, powered by Google Gemini 1.5 Flash.

## Features
- **Document Ingestion**: Upload PDF or Text files (chapters, books, notes).
- **RAG Engine**: Uses LlamaIndex and ChromaDB to index content.
- **AI Assistant**: Ask questions and get context-aware answers from Gemini 1.5 Flash.
- **Modern UI**: Built with React, Vite, and Tailwind CSS.

## Setup

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Create a `.env` file and add your Google API Key:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Open the frontend (usually `http://localhost:5173`).
2. Upload a study material (PDF/Text).
3. Start chatting!
