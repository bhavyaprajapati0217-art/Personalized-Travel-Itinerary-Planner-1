from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import date

class Activity(BaseModel):
    id: Optional[str] = None
    time_slot: str = Field(..., description="e.g. 'Morning', 'Afternoon', 'Evening', 'Night'")
    time_range: str = Field(..., description="e.g. '09:00 AM - 11:30 AM'")
    title: str = Field(..., description="Name of attraction, venue or transit")
    category: str = Field(..., description="attraction | dining | accommodation | logistics | leisure")
    description: str = Field(..., description="Detailed description and what to do")
    location: str = Field(..., description="Address or district name")
    estimated_cost: float = Field(0.0, description="Cost in USD per person")
    duration_hours: float = Field(1.5, description="Duration in hours")
    booking_tip: Optional[str] = Field(None, description="Pro-tip or booking advice")
    transit_info: Optional[str] = Field(None, description="How to reach from previous activity")
    coordinates: Optional[Dict[str, float]] = Field(default_factory=dict, description="lat and lng")

class ItineraryDay(BaseModel):
    day_number: int
    date: Optional[str] = None
    theme: str = Field(..., description="Theme of the day, e.g. 'Historic Old Town & Culinary Delights'")
    summary: str = Field(..., description="High level summary of the day's flow")
    activities: List[Activity] = Field(default_factory=list)
    day_estimated_cost: float = 0.0

class BudgetBreakdown(BaseModel):
    currency: str = "USD"
    attractions: float = 0.0
    dining: float = 0.0
    accommodation: float = 0.0
    transportation: float = 0.0
    miscellaneous: float = 0.0
    total_estimated: float = 0.0
    budget_limit: float = 0.0
    remaining_balance: float = 0.0
    is_within_budget: bool = True

class LogisticsRecommendation(BaseModel):
    best_transit_mode: str
    airport_transfer_tip: str
    local_transport_pass: Optional[str] = None
    packing_tips: List[str] = Field(default_factory=list)
    safety_notes: Optional[str] = None

class TripPreferences(BaseModel):
    destination: str = Field(..., example="Kyoto, Japan")
    start_date: str = Field(..., example="2026-11-10")
    end_date: str = Field(..., example="2026-11-13")
    duration_days: int = Field(..., ge=1, le=14, example=3)
    traveler_type: str = Field(..., description="solo | couple | group | family", example="solo")
    group_size: int = Field(1, ge=1, le=30)
    budget_tier: str = Field("balanced", description="budget | balanced | luxury")
    total_budget: float = Field(1500.0, ge=50.0)
    pacing: str = Field("balanced", description="relaxed | balanced | fast-paced")
    interests: List[str] = Field(default_factory=lambda: ["sightseeing", "food"], example=["food", "sightseeing", "culture"])
    accommodation_preference: Optional[str] = Field("hotel", description="hostel | hotel | boutique | luxury_resort")
    dietary_restrictions: Optional[List[str]] = Field(default_factory=list)
    special_requirements: Optional[str] = None

class TripItineraryResponse(BaseModel):
    id: Optional[str] = None
    title: str
    destination: str
    trip_summary: str
    traveler_type: str
    duration_days: int
    dates: str
    pacing: str
    budget_breakdown: BudgetBreakdown
    logistics: LogisticsRecommendation
    days: List[ItineraryDay]
    created_at: Optional[str] = None
    is_saved: bool = False

class RegenerateDayRequest(BaseModel):
    trip_id: Optional[str] = None
    destination: str
    day_number: int
    current_theme: Optional[str] = None
    feedback_or_preference: str = Field(..., description="e.g. 'I want more food tours and fewer museums'")
    traveler_type: str = "solo"
    budget_tier: str = "balanced"

class SwapActivityRequest(BaseModel):
    destination: str
    current_activity_title: str
    category: str
    time_slot: str
    reason: Optional[str] = "Prefer outdoor or scenic alternative"
