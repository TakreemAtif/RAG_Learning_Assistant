import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class GeminiClient:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def generate_content(self, prompt: str) -> str:
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            print(f"Error generating content: {e}")
            return "Error generating response."

    def generate_content_from_image(self, prompt: str, image_data: bytes, mime_type: str = "image/jpeg", generation_config: dict = None) -> str:
        try:
            image_part = {
                "mime_type": mime_type,
                "data": image_data
            }
            response = self.model.generate_content([prompt, image_part], generation_config=generation_config)
            return response.text
        except Exception as e:
            print(f"Error generating content from image: {e}")
            return f"Error analyzing image: {str(e)}"

    async def generate_content_async(self, prompt: str) -> str:
        # Gemini python SDK is synchronous for now, but we can wrap it if needed or use async methods if available in newer versions
        # For now, we'll keep it simple.
        return self.generate_content(prompt)
