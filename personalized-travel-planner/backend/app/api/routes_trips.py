import json
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query
from app.models.trip import (
    TripPreferences, TripItineraryResponse, ItineraryDay, Activity,
    RegenerateDayRequest, SwapActivityRequest
)
from app.services.ai_generator import ai_generator
from app.services.supabase_client import SupabaseService

router = APIRouter(prefix="/trips", tags=["Trips & Itineraries"])

@router.get("/scenarios/presets")
async def get_scenario_presets():
    """Returns the 3 official project scenarios for 1-click testing & grading."""
    return ai_generator.sample_scenarios

@router.post("/generate", response_model=TripItineraryResponse)
async def generate_itinerary(preferences: TripPreferences):
    """Epic 4: Generates a complete AI-personalized day-by-day travel itinerary."""
    try:
        itinerary = await ai_generator.generate_itinerary(preferences)
        return itinerary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/regenerate-day", response_model=ItineraryDay)
async def regenerate_day(req: RegenerateDayRequest):
    """Regenerates a specific day with custom feedback/preferences."""
    try:
        new_day = await ai_generator.regenerate_day(req)
        return new_day
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Day regeneration failed: {str(e)}")

@router.post("/swap-activity", response_model=Activity)
async def swap_activity(req: SwapActivityRequest):
    """Replaces a single activity with a smart alternative."""
    try:
        new_act = await ai_generator.swap_activity(req)
        return new_act
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Activity swap failed: {str(e)}")

@router.post("/save")
async def save_trip(trip: TripItineraryResponse, user_id: Optional[str] = "guest-user"):
    """Epic 2: Saves the generated trip to Supabase database."""
    try:
        saved = await SupabaseService.save_trip(trip.model_dump(), user_id=user_id)
        return {"success": True, "trip": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save trip: {str(e)}")

@router.get("", response_model=List[Dict[str, Any]])
async def list_trips(user_id: Optional[str] = "guest-user"):
    """Lists all saved trips from Supabase."""
    trips = await SupabaseService.get_all_trips(user_id=user_id)
    return trips

@router.get("/{trip_id}")
async def get_trip(trip_id: str):
    """Retrieves a single trip itinerary."""
    trip = await SupabaseService.get_trip_by_id(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.delete("/{trip_id}")
async def delete_trip(trip_id: str):
    """Deletes a saved trip."""
    success = await SupabaseService.delete_trip(trip_id)
    return {"success": success, "deleted_id": trip_id}
