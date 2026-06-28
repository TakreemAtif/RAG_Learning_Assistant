import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext, load_index_from_storage, Settings
from llama_index.llms.gemini import Gemini
from llama_index.embeddings.fastembed import FastEmbedEmbedding
from llama_index.core.node_parser import SentenceSplitter
import shutil
from gemini_client import GeminiClient

# Configure LlamaIndex to use Gemini
def configure_settings():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found")
    
    Settings.llm = Gemini(model="models/gemini-2.5-flash", api_key=api_key)
    Settings.embed_model = FastEmbedEmbedding(model_name="BAAI/bge-small-en-v1.5")
    Settings.node_parser = SentenceSplitter(chunk_size=1024, chunk_overlap=20)

class RAGEngine:
    def __init__(self, storage_dir="./storage", data_dir="./data"):
        self.storage_dir = storage_dir
        self.data_dir = data_dir
        self.index = None
        self.gemini_client = GeminiClient()
        
        if not os.path.exists(self.data_dir):
            os.makedirs(self.data_dir)
            
        configure_settings()
        self._load_or_create_index()

    def _load_or_create_index(self):
        if os.path.exists(self.storage_dir):
            try:
                storage_context = StorageContext.from_defaults(persist_dir=self.storage_dir)
                self.index = load_index_from_storage(storage_context)
                print("Index loaded from storage.")
            except Exception as e:
                print(f"Failed to load index: {e}. Creating new one.")
                self.index = VectorStoreIndex([])
        else:
            self.index = VectorStoreIndex([])
            print("Created new empty index.")

    def ingest_file(self, file_path: str, filename: str):
        # Copy file to data dir
        target_path = os.path.join(self.data_dir, filename)
        shutil.copy(file_path, target_path)
        
        # Load and index
        documents = SimpleDirectoryReader(input_files=[target_path]).load_data()
        for doc in documents:
            self.index.insert(doc)
        
        # Persist
        self.index.storage_context.persist(persist_dir=self.storage_dir)
        print(f"Ingested {filename}")

    def query(self, query_text: str):
        if not self.index:
            return "Index not initialized."
        
        from llama_index.core import PromptTemplate
        
        # Custom text qa prompt
        text_qa_template_str = (
            "You are an intelligent and helpful Computer Vision Study Assistant.\n"
            "Your goal is to help the user understand the material in the provided context.\n"
            "If the user asks a question that is not in the context (like 'who are you' or general chat), "
            "answer it politely and helpfully using your general knowledge, but mention that it's not in the notes if relevant.\n"
            "Always be polite and professional.\n"
            "Context information is below.\n"
            "---------------------\n"
            "{context_str}\n"
            "---------------------\n"
            "Given the context information and not prior knowledge, "
            "answer the question: {query_str}\n"
        )
        text_qa_template = PromptTemplate(text_qa_template_str)
        
        query_engine = self.index.as_query_engine(text_qa_template=text_qa_template)
        response = query_engine.query(query_text)
        return str(response)

    def get_documents_list(self):
        if os.path.exists(self.data_dir):
            return os.listdir(self.data_dir)
        return []
