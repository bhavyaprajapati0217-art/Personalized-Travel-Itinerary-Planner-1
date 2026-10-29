import json
import logging
import uuid
from typing import Dict, Any, Optional
from app.config import settings
from app.models.trip import (
    TripPreferences, TripItineraryResponse, ItineraryDay, Activity,
    BudgetBreakdown, LogisticsRecommendation, RegenerateDayRequest, SwapActivityRequest
)

logger = logging.getLogger("travel_ai")

# Check if google.generativeai is available
HAS_GEMINI = False
try:
    import google.generativeai as genai
    if settings.GEMINI_API_KEY:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        HAS_GEMINI = True
except Exception as e:
    logger.warning(f"Could not initialize Gemini SDK: {e}")

class TravelAIGenerator:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        
        # Load sample scenario bank
        try:
            with open("app/data/sample_scenarios.json", "r", encoding="utf-8") as f:
                self.sample_scenarios = json.load(f)
        except Exception:
            # Fallback path if run from root or different working directory
            try:
                import os
                base = os.path.dirname(os.path.dirname(__file__))
                with open(os.path.join(base, "data", "sample_scenarios.json"), "r", encoding="utf-8") as f:
                    self.sample_scenarios = json.load(f)
            except Exception:
                self.sample_scenarios = {}

    def _build_system_prompt(self) -> str:
        return """You are the World's Premier AI Travel Planner & Logistics Architect.
Your mission is to generate hyper-personalized, realistic, logically sequenced day-by-day travel itineraries.

Core Instructions:
1. Pacing & Geography: Sequence activities by geographical proximity to minimize transit time. Respect traveler pacing (relaxed: 2-3 activities/day; balanced: 3-4 activities/day; fast-paced: 4-5 activities/day).
2. Category Breakdown: Ensure a balanced mix of 'attraction', 'dining', 'accommodation', 'logistics', and 'leisure'.
3. Budget Optimization: Deliver itemized estimated costs in USD per person that strictly respect the overall budget.
4. Logistics & Booking Pro-tips: Provide actionable transit directions between consecutive spots and insider booking tips (e.g. skip-the-line times, reservations needed, crowd avoidance).
5. Persona Adaptation:
   - Solo Traveler: Prioritize walkable areas, safe solo-friendly counter dining, high-efficiency sightseeing, low transit overhead.
   - Couple: Highlight scenic viewpoints, romantic ambiances, relaxed pacing, clifftop/candlelit dining, boutique stays.
   - Small Group: Balance varied preferences (e.g., adventure vs. culture), include group-friendly dining, clear meeting points, cost splitting tips.

You MUST respond strictly with valid JSON conforming to the requested schema. Do NOT include markdown fences, backticks, or preamble."""

    def _build_user_prompt(self, prefs: TripPreferences) -> str:
        return f"""Generate a {prefs.duration_days}-day travel itinerary for:
- Destination: {prefs.destination}
- Dates: {prefs.start_date} to {prefs.end_date}
- Traveler Type: {prefs.traveler_type} (Group Size: {prefs.group_size})
- Budget Tier: {prefs.budget_tier} (Total Budget: ${prefs.total_budget} USD)
- Pacing: {prefs.pacing}
- Interests: {", ".join(prefs.interests)}
- Accommodation Style: {prefs.accommodation_preference}
- Dietary Restrictions: {", ".join(prefs.dietary_restrictions) if prefs.dietary_restrictions else "None"}
- Special Requirements: {prefs.special_requirements or "None"}

Required JSON Schema structure:
{{
  "title": "Inspiring Title",
  "destination": "{prefs.destination}",
  "trip_summary": "2-3 sentences overviewing the experience",
  "traveler_type": "{prefs.traveler_type}",
  "duration_days": {prefs.duration_days},
  "dates": "{prefs.start_date} - {prefs.end_date}",
  "pacing": "{prefs.pacing}",
  "budget_breakdown": {{
    "currency": "USD",
    "attractions": 0.0,
    "dining": 0.0,
    "accommodation": 0.0,
    "transportation": 0.0,
    "miscellaneous": 0.0,
    "total_estimated": 0.0,
    "budget_limit": {prefs.total_budget},
    "remaining_balance": 0.0,
    "is_within_budget": true
  }},
  "logistics": {{
    "best_transit_mode": "string",
    "airport_transfer_tip": "string",
    "local_transport_pass": "string",
    "packing_tips": ["item1", "item2", "item3"],
    "safety_notes": "string"
  }},
  "days": [
    {{
      "day_number": 1,
      "date": "{prefs.start_date}",
      "theme": "Theme of Day 1",
      "summary": "Brief summary",
      "day_estimated_cost": 0.0,
      "activities": [
        {{
          "id": "act-1",
          "time_slot": "Morning",
          "time_range": "09:00 AM - 11:30 AM",
          "title": "Activity Title",
          "category": "attraction",
          "description": "Details",
          "location": "Address / district",
          "estimated_cost": 25.0,
          "duration_hours": 2.0,
          "booking_tip": "Pro-tip",
          "transit_info": "How to get there",
          "coordinates": {{"lat": 0.0, "lng": 0.0}}
        }}
      ]
    }}
  ]
}}"""

    async def generate_itinerary(self, prefs: TripPreferences) -> TripItineraryResponse:
        """Generates full itinerary using Gemini if configured, else smart heuristic engine."""
        if HAS_GEMINI and self.api_key:
            try:
                model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=self._build_system_prompt()
                )
                response = model.generate_content(
                    self._build_user_prompt(prefs),
                    generation_config={"response_mime_type": "application/json"}
                )
                raw_text = response.text.strip()
                # Clean any accidental markdown fences
                if raw_text.startswith("```json"):
                    raw_text = raw_text[7:]
                if raw_text.endswith("```"):
                    raw_text = raw_text[:-3]
                data = json.loads(raw_text.strip())
                data["id"] = f"trip-{uuid.uuid4().hex[:8]}"
                return TripItineraryResponse(**data)
            except Exception as e:
                logger.error(f"Gemini API error, falling back to heuristic engine: {e}")

        # Fallback heuristic engine
        return self._generate_heuristic_itinerary(prefs)

    def _generate_heuristic_itinerary(self, prefs: TripPreferences) -> TripItineraryResponse:
        """Generates realistic structured itinerary tailored to input preferences."""
        # Check if matching sample scenario
        dest_lower = prefs.destination.lower()
        if "barcelona" in dest_lower and "scenario_1" in self.sample_scenarios:
            base = self.sample_scenarios["scenario_1"]["itinerary"]
            return TripItineraryResponse(**base)
        elif ("amalfi" in dest_lower or "positano" in dest_lower or "italy" in dest_lower) and "scenario_2" in self.sample_scenarios:
            base = self.sample_scenarios["scenario_2"]["itinerary"]
            return TripItineraryResponse(**base)
        elif ("kyoto" in dest_lower or "osaka" in dest_lower or "japan" in dest_lower) and "scenario_3" in self.sample_scenarios:
            base = self.sample_scenarios["scenario_3"]["itinerary"]
            return TripItineraryResponse(**base)

        # Dynamic generation for any other custom destination
        days_list = []
        daily_budget = prefs.total_budget / max(prefs.duration_days, 1)
        attr_budget = round(daily_budget * 0.25, 2)
        dining_budget = round(daily_budget * 0.35, 2)
        hotel_budget = round(daily_budget * 0.30, 2)
        transit_budget = round(daily_budget * 0.10, 2)

        interests_str = ", ".join(prefs.interests) if prefs.interests else "cultural sights & dining"

        for i in range(1, prefs.duration_days + 1):
            day_cost = attr_budget + dining_budget + transit_budget
            activities = [
                Activity(
                    id=f"act-{i}-1",
                    time_slot="Morning",
                    time_range="09:00 AM - 11:30 AM",
                    title=f"Iconic Landmarks & Heritage of {prefs.destination}",
                    category="attraction",
                    description=f"Explore the premier cultural and historical highlights of {prefs.destination} tailored for {prefs.traveler_type} travelers.",
                    location=f"Central Historic District, {prefs.destination}",
                    estimated_cost=round(attr_budget * 0.6, 2),
                    duration_hours=2.5,
                    booking_tip="Arrive early at opening to avoid queues; check for student or online discounts.",
                    transit_info="Public metro or local taxi from city center hotel.",
                    coordinates={"lat": 48.8566 + (i * 0.01), "lng": 2.3522 + (i * 0.01)}
                ),
                Activity(
                    id=f"act-{i}-2",
                    time_slot="Afternoon",
                    time_range="12:30 PM - 02:00 PM",
                    title=f"Authentic Local Dining & Market Tasting",
                    category="dining",
                    description=f"Sample regional cuisine at an acclaimed local eatery catering to your preferences ({interests_str}).",
                    location=f"Old Town Food Bazaar, {prefs.destination}",
                    estimated_cost=round(dining_budget * 0.45, 2),
                    duration_hours=1.5,
                    booking_tip="Try the house specialty and ask for daily seasonal chef recommendations.",
                    transit_info="10-minute walk through pedestrian precinct.",
                    coordinates={"lat": 48.8570, "lng": 2.3530}
                ),
                Activity(
                    id=f"act-{i}-3",
                    time_slot="Evening",
                    time_range="03:30 PM - 06:30 PM",
                    title=f"Scenic Neighborhood Exploration & Artisan Quarter",
                    category="leisure",
                    description=f"Wander picturesque avenues, boutique galleries, and scenic lookout points overlooking {prefs.destination}.",
                    location=f"Panorama Heights, {prefs.destination}",
                    estimated_cost=round(attr_budget * 0.4, 2),
                    duration_hours=3.0,
                    booking_tip="Golden hour provides spectacular photography vantage points.",
                    transit_info="Short tram ride or scenic stroll.",
                    coordinates={"lat": 48.8600, "lng": 2.3500}
                ),
                Activity(
                    id=f"act-{i}-4",
                    time_slot="Night",
                    time_range="07:30 PM - 10:00 PM",
                    title=f"Curated Evening Dinner & Atmospheric Nightcap",
                    category="dining",
                    description=f"Unwind with a refined dining experience reflecting local hospitality and evening ambiance.",
                    location=f"Riverfront Promenade, {prefs.destination}",
                    estimated_cost=round(dining_budget * 0.55, 2),
                    duration_hours=2.5,
                    booking_tip="Advance table reservations recommended for peak weekend evenings.",
                    transit_info="Taxi or safe central night transit.",
                    coordinates={"lat": 48.8580, "lng": 2.3480}
                )
            ]
            days_list.append(
                ItineraryDay(
                    day_number=i,
                    date=f"Day {i}",
                    theme=f"Discovering {prefs.destination}: Day {i} Highlights",
                    summary=f"A balanced day combining curated sightseeing, authentic gastronomy, and scenic moments.",
                    activities=activities,
                    day_estimated_cost=round(day_cost, 2)
                )
            )

        total_attr = round(attr_budget * prefs.duration_days, 2)
        total_dine = round(dining_budget * prefs.duration_days, 2)
        total_stay = round(hotel_budget * prefs.duration_days, 2)
        total_trans = round(transit_budget * prefs.duration_days, 2)
        total_calc = total_attr + total_dine + total_stay + total_trans

        budget_breakdown = BudgetBreakdown(
            currency="USD",
            attractions=total_attr,
            dining=total_dine,
            accommodation=total_stay,
            transportation=total_trans,
            miscellaneous=round(total_calc * 0.05, 2),
            total_estimated=round(total_calc * 1.05, 2),
            budget_limit=prefs.total_budget,
            remaining_balance=round(prefs.total_budget - (total_calc * 1.05), 2),
            is_within_budget=(total_calc * 1.05) <= prefs.total_budget
        )

        logistics = LogisticsRecommendation(
            best_transit_mode="Integrated public transit pass (subway/tram) & walking",
            airport_transfer_tip=f"Express rail or official airport bus connects directly to central {prefs.destination}.",
            local_transport_pass=f"Multi-day visitor transport card offers unlimited rides.",
            packing_tips=["Comfortable walking shoes", "Universal power adapter", "Weather-appropriate layers", "Reusable water bottle"],
            safety_notes=f"{prefs.destination} has high tourist safety; keep emergency numbers handy."
        )

        return TripItineraryResponse(
            id=f"trip-{uuid.uuid4().hex[:8]}",
            title=f"Custom {prefs.traveler_type.title()} Odyssey: {prefs.destination}",
            destination=prefs.destination,
            trip_summary=f"A meticulously crafted {prefs.duration_days}-day itinerary delivering peak cultural highlights, exceptional gastronomy, and effortless logistics for {prefs.traveler_type} travelers.",
            traveler_type=prefs.traveler_type,
            duration_days=prefs.duration_days,
            dates=f"{prefs.start_date} to {prefs.end_date}",
            pacing=prefs.pacing,
            budget_breakdown=budget_breakdown,
            logistics=logistics,
            days=days_list,
            created_at="2026-10-30",
            is_saved=False
        )

    async def regenerate_day(self, req: RegenerateDayRequest) -> ItineraryDay:
        """Regenerates a single day with custom user feedback (e.g. more nature, different food)."""
        new_activities = [
            Activity(
                id=f"act-regen-{req.day_number}-1",
                time_slot="Morning",
                time_range="09:00 AM - 12:00 PM",
                title=f"Customized Morning: {req.feedback_or_preference.title()} Experience",
                category="attraction",
                description=f"Freshly tuned morning itinerary tailored specifically to your prompt: '{req.feedback_or_preference}' in {req.destination}.",
                location=f"Central Scenic Area, {req.destination}",
                estimated_cost=35.0,
                duration_hours=3.0,
                booking_tip="Special reservation arranged according to updated preferences.",
                transit_info="Direct transit route via central station.",
                coordinates={"lat": 41.385, "lng": 2.173}
            ),
            Activity(
                id=f"act-regen-{req.day_number}-2",
                time_slot="Afternoon",
                time_range="12:30 PM - 03:00 PM",
                title=f"Curated Culinary Session: Local Specialties",
                category="dining",
                description=f"Handpicked dining venue accommodating your refreshed requirements and pace in {req.destination}.",
                location=f"Culinary Quarter, {req.destination}",
                estimated_cost=30.0,
                duration_hours=2.5,
                booking_tip="Outdoor seating with scenic perspective.",
                transit_info="10-minute leisure walk.",
                coordinates={"lat": 41.386, "lng": 2.175}
            ),
            Activity(
                id=f"act-regen-{req.day_number}-3",
                time_slot="Evening",
                time_range="04:00 PM - 07:00 PM",
                title=f"Sunset Leisure & Cultural Discovery",
                category="leisure",
                description=f"Relaxed, scenic pacing designed to minimize fatigue while discovering unique artisan corners.",
                location=f"Scenic Promenade, {req.destination}",
                estimated_cost=15.0,
                duration_hours=3.0,
                booking_tip="Prime vantage point for sunset photos.",
                transit_info="Short tram ride.",
                coordinates={"lat": 41.388, "lng": 2.179}
            ),
            Activity(
                id=f"act-regen-{req.day_number}-4",
                time_slot="Night",
                time_range="08:00 PM - 10:30 PM",
                title=f"Atmospheric Evening Feast & Night Vibe",
                category="dining",
                description=f"A memorable evening experience completing Day {req.day_number} with personalized ambiance.",
                location=f"Boutique Dining Lane, {req.destination}",
                estimated_cost=45.0,
                duration_hours=2.5,
                booking_tip="Table reserved with evening view.",
                transit_info="Safe evening pedestrian route.",
                coordinates={"lat": 41.384, "lng": 2.181}
            )
        ]
        return ItineraryDay(
            day_number=req.day_number,
            date=f"Day {req.day_number}",
            theme=f"Refined Day {req.day_number}: {req.feedback_or_preference}",
            summary=f"Regenerated based on your request: '{req.feedback_or_preference}' with optimized route and budget.",
            activities=new_activities,
            day_estimated_cost=125.0
        )

    async def swap_activity(self, req: SwapActivityRequest) -> Activity:
        """Suggests a drop-in replacement activity."""
        return Activity(
            id=f"act-swap-{uuid.uuid4().hex[:6]}",
            time_slot=req.time_slot,
            time_range="Flexible / Alternate Slot",
            title=f"Alternative: Hidden Gem {req.category.title()} in {req.destination}",
            category=req.category,
            description=f"Carefully selected alternative replacing '{req.current_activity_title}'. Reason: {req.reason}.",
            location=f"Artisan Quarter, {req.destination}",
            estimated_cost=25.0,
            duration_hours=2.0,
            booking_tip="Less crowded local favorite alternative; walk-ins welcome.",
            transit_info="5-minute transit or walk from original stop.",
            coordinates={"lat": 41.387, "lng": 2.178}
        )

ai_generator = TravelAIGenerator()
