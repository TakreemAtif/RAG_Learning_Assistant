import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    from backend.rag_engine import RAGEngine
    print("Import successful")
    
    # Mock environment variable if needed, but it should be set in the system or .env
    # We'll assume it's set or load it
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.getcwd(), 'backend', '.env'))
    
    if not os.getenv("GOOGLE_API_KEY"):
        print("GOOGLE_API_KEY not set")
        sys.exit(1)

    engine = RAGEngine()
    if hasattr(engine, 'gemini_client'):
        print("RAGEngine has gemini_client attribute")
    else:
        print("RAGEngine MISSING gemini_client attribute")
        sys.exit(1)

except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
