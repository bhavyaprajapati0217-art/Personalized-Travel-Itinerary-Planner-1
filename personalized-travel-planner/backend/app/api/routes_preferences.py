from fastapi import APIRouter
from app.models.trip import TripPreferences
from app.services.recommendation import recommendation_engine

router = APIRouter(prefix="/preferences", tags=["Preferences & Recommendation Engine"])

@router.post("/analyze")
async def analyze_travel_preferences(preferences: TripPreferences):
    """Epic 3: Preference Collection & Recommendation Engine.
    Analyzes traveler input, scores interest vectors, and generates tailored recommendations.
    """
    analysis = recommendation_engine.analyze_preferences(preferences)
    return {
        "status": "success",
        "analysis": analysis
    }
