from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import shutil
from dotenv import load_dotenv
from rag_engine import RAGEngine

load_dotenv()

app = FastAPI(title="Intro to Computer Vision RAG")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG Engine
# We initialize it lazily or on startup. For now, global.
rag_engine = None

@app.on_event("startup")
async def startup_event():
    global rag_engine
    try:
        rag_engine = RAGEngine()
    except Exception as e:
        print(f"Failed to initialize RAG Engine: {e}")

class QueryRequest(BaseModel):
    query: str

@app.get("/")
async def root():
    return {"message": "Welcome to the Computer Vision RAG "}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    if not rag_engine:
        raise HTTPException(status_code=500, detail="RAG Engine not initialized")
    
    try:
        # Save temp file
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Ingest
        rag_engine.ingest_file(temp_path, file.filename)
        
        # Cleanup
        os.remove(temp_path)
        
        return {"message": f"Successfully uploaded and indexed {file.filename}"}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(request: QueryRequest):
    if not rag_engine:
        raise HTTPException(status_code=500, detail="RAG Engine not initialized")
    
    response = rag_engine.query(request.query)
    return {"response": response}

@app.get("/documents")
async def list_documents():
    if not rag_engine:
        return []
    return rag_engine.get_documents_list()

@app.post("/parse-diagram")
async def parse_diagram(file: UploadFile = File(...)):
    if not rag_engine:
        raise HTTPException(status_code=500, detail="RAG Engine not initialized")
    
    try:
        contents = await file.read()
        prompt = (
            "Analyze this diagram in detail. "
            "1. **Overview**: Briefly describe what the diagram represents. "
            "2. **Components**: List the key nodes, shapes, or actors involved. "
            "3. **Relationships**: Explain how the components are connected or related (arrows, lines, hierarchy). "
            "4. **Process Flow**: If applicable, trace the flow of the process or logic from start to finish. "
            "5. **Key Insights**: Highlight any important decisions, loops, or critical points. "
            "Provide a clear and structured explanation."
        )
        # Use a slightly higher temperature for creative description but still focused
        response = rag_engine.gemini_client.generate_content_from_image(
            prompt, 
            contents, 
            file.content_type,
            generation_config={"temperature": 0.2}
        )
        return {"explanation": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/solve-equation")
async def solve_equation(file: UploadFile = File(...)):
    if not rag_engine:
        raise HTTPException(status_code=500, detail="RAG Engine not initialized")
    
    try:
        contents = await file.read()
        prompt = (
            "You are an expert mathematician. Solve the equation or math problem in this image step-by-step using a Chain of Thought approach.\n\n"
            "**Step 1: Problem Identification**\n"
            "- Transcribe the equation or problem exactly as it appears.\n"
            "- Identify the type of problem (e.g., calculus, algebra, geometry).\n\n"
            "**Step 2: Methodology**\n"
            "- Briefly explain the mathematical method or formula you will use to solve it.\n\n"
            "**Step 3: Step-by-Step Solution**\n"
            "- Show every step of the calculation clearly.\n"
            "- Explain the logic behind each step.\n"
            "- If the problem is complex, break it down into smaller parts.\n\n"
            "**Step 4: Verification**\n"
            "- Briefly check your work to ensure the result makes sense.\n\n"
            "**Step 5: Final Answer**\n"
            "- State the final answer clearly and concisely.\n"
        )
        # Use low temperature for precision
        response = rag_engine.gemini_client.generate_content_from_image(
            prompt, 
            contents, 
            file.content_type,
            generation_config={"temperature": 0.1}
        )
        return {"solution": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
