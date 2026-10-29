from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import routes_trips, routes_preferences
from app.services.supabase_client import SupabaseService

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Full-stack AI-Powered Personalized Travel Itinerary Planner API with Google Cloud Gemini & Supabase",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(routes_trips.router, prefix=settings.API_V1_STR)
app.include_router(routes_preferences.router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
async def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "supabase_connected": SupabaseService.is_connected(),
        "gemini_configured": bool(settings.GEMINI_API_KEY),
        "docs": "/docs"
    }

@app.get("/health", tags=["Health Check"])
async def health():
    return {"status": "ok"}
