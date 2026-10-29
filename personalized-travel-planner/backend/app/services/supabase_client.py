import logging
from typing import Optional, List, Dict, Any
from app.config import settings

logger = logging.getLogger("supabase_client")

HAS_SUPABASE = False
supabase_client = None

if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        HAS_SUPABASE = True
        logger.info("Connected successfully to Supabase.")
    except Exception as e:
        logger.warning(f"Could not initialize Supabase client: {e}")

# In-memory store fallback for development / offline testing
_IN_MEMORY_TRIPS: Dict[str, Dict[str, Any]] = {}

class SupabaseService:
    @staticmethod
    def is_connected() -> bool:
        return HAS_SUPABASE and supabase_client is not None

    @staticmethod
    async def save_trip(trip_data: Dict[str, Any], user_id: Optional[str] = "guest-user") -> Dict[str, Any]:
        """Saves a generated trip itinerary to Supabase database (or in-memory fallback)."""
        trip_id = trip_data.get("id") or f"trip-{len(_IN_MEMORY_TRIPS) + 1}"
        trip_data["id"] = trip_id
        trip_data["user_id"] = user_id
        trip_data["is_saved"] = True

        if HAS_SUPABASE and supabase_client:
            try:
                res = supabase_client.table("trips").insert({
                    "id": trip_id,
                    "user_id": user_id,
                    "title": trip_data.get("title"),
                    "destination": trip_data.get("destination"),
                    "duration_days": trip_data.get("duration_days"),
                    "traveler_type": trip_data.get("traveler_type"),
                    "itinerary_json": trip_data,
                    "total_budget": trip_data.get("budget_breakdown", {}).get("budget_limit", 0),
                    "estimated_cost": trip_data.get("budget_breakdown", {}).get("total_estimated", 0),
                }).execute()
                logger.info(f"Trip {trip_id} saved to Supabase.")
                return trip_data
            except Exception as e:
                logger.error(f"Error saving trip to Supabase: {e}. Falling back to memory.")

        _IN_MEMORY_TRIPS[trip_id] = trip_data
        return trip_data

    @staticmethod
    async def get_all_trips(user_id: Optional[str] = "guest-user") -> List[Dict[str, Any]]:
        """Retrieves all saved trips for a user."""
        if HAS_SUPABASE and supabase_client:
            try:
                res = supabase_client.table("trips").select("*").eq("user_id", user_id).execute()
                if res.data:
                    return [row.get("itinerary_json", row) for row in res.data]
            except Exception as e:
                logger.error(f"Error fetching trips from Supabase: {e}")

        return list(_IN_MEMORY_TRIPS.values())

    @staticmethod
    async def get_trip_by_id(trip_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single trip by ID."""
        if HAS_SUPABASE and supabase_client:
            try:
                res = supabase_client.table("trips").select("*").eq("id", trip_id).single().execute()
                if res.data:
                    return res.data.get("itinerary_json", res.data)
            except Exception as e:
                logger.error(f"Error querying Supabase for trip {trip_id}: {e}")

        return _IN_MEMORY_TRIPS.get(trip_id)

    @staticmethod
    async def delete_trip(trip_id: str) -> bool:
        """Deletes a saved trip."""
        if HAS_SUPABASE and supabase_client:
            try:
                supabase_client.table("trips").delete().eq("id", trip_id).execute()
            except Exception as e:
                logger.error(f"Error deleting trip from Supabase: {e}")

        if trip_id in _IN_MEMORY_TRIPS:
            del _IN_MEMORY_TRIPS[trip_id]
            return True
        return False
