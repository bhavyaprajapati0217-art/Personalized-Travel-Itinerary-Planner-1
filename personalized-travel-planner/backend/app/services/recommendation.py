from typing import List, Dict, Any
from app.models.trip import TripPreferences

class PreferenceRecommendationEngine:
    """Epic 3: Preference Collection & Recommendation Engine.
    Analyzes traveler input, scores interest vectors, and provides budget/logistics recommendations.
    """

    ARCHETYPE_RULES = {
        "solo": {
            "lodging_weight": 0.25,
            "dining_weight": 0.35,
            "activities_weight": 0.30,
            "transit_weight": 0.10,
            "suggested_pace": "balanced",
            "top_tags": ["walkability", "co-working cafes", "counter dining", "hostel/boutique stays"]
        },
        "couple": {
            "lodging_weight": 0.38,
            "dining_weight": 0.35,
            "activities_weight": 0.20,
            "transit_weight": 0.07,
            "suggested_pace": "relaxed",
            "top_tags": ["scenic sunsets", "candlelit dining", "boutique villas", "quiet mornings"]
        },
        "group": {
            "lodging_weight": 0.30,
            "dining_weight": 0.30,
            "activities_weight": 0.25,
            "transit_weight": 0.15,
            "suggested_pace": "balanced",
            "top_tags": ["shared apartments/suites", "split-bill izakayas", "group passes", "buffer time"]
        },
        "family": {
            "lodging_weight": 0.35,
            "dining_weight": 0.25,
            "activities_weight": 0.25,
            "transit_weight": 0.15,
            "suggested_pace": "relaxed",
            "top_tags": ["child-friendly parks", "spacious suites", "early dining", "low-step walking routes"]
        }
    }

    def analyze_preferences(self, prefs: TripPreferences) -> Dict[str, Any]:
        """Provides AI-driven recommendations based on preferences matrix."""
        archetype = self.ARCHETYPE_RULES.get(prefs.traveler_type.lower(), self.ARCHETYPE_RULES["solo"])
        
        # Calculate recommended budget split
        lodging_recom = round(prefs.total_budget * archetype["lodging_weight"], 2)
        dining_recom = round(prefs.total_budget * archetype["dining_weight"], 2)
        activities_recom = round(prefs.total_budget * archetype["activities_weight"], 2)
        transit_recom = round(prefs.total_budget * archetype["transit_weight"], 2)

        # Compatibility flags and suggestions
        warnings = []
        suggestions = []

        daily_budget = prefs.total_budget / max(prefs.duration_days, 1)
        if prefs.traveler_type == "group" and prefs.group_size < 2:
            warnings.append("Traveler type is 'group' but group size is 1. Adjusting to solo profiling.")
        
        if prefs.budget_tier == "budget" and daily_budget > 300:
            suggestions.append("Your allocated budget is generous for a 'budget' tier; consider upgrading to 'balanced' or 'boutique' accommodations.")
        elif prefs.budget_tier == "luxury" and daily_budget < 200:
            warnings.append(f"Luxury tier typically requires $300+/day per person. Your current daily allowance is ${daily_budget:.2f}. We will prioritize value-luxury options.")

        if prefs.pacing == "fast-paced" and "relaxation" in [i.lower() for i in prefs.interests]:
            suggestions.append("You selected 'fast-paced' along with 'relaxation'. We scheduled dedicated downtime intervals between intensive sightseeing.")

        return {
            "traveler_archetype": prefs.traveler_type,
            "recommended_budget_split": {
                "lodging": lodging_recom,
                "dining": dining_recom,
                "activities": activities_recom,
                "transit": transit_recom,
            },
            "pacing_suitability": f"Optimal for {prefs.traveler_type} travelers taking a {prefs.duration_days}-day journey.",
            "persona_highlights": archetype["top_tags"],
            "advisory_warnings": warnings,
            "smart_suggestions": suggestions
        }

recommendation_engine = PreferenceRecommendationEngine()
