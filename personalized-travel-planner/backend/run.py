import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"🚀 Starting Personalized Travel Itinerary Planner API on http://localhost:{port}")
    print(f"📖 Swagger UI Docs: http://localhost:{port}/docs")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
