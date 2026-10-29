-- ====================================================================
-- Personalized Travel Itinerary Planner
-- Supabase Database Seed Data (Epic 2)
-- Seeds initial profiles and the 3 official project scenarios
-- ====================================================================

-- 1. Insert Demo Profile
INSERT INTO public.profiles (email, full_name, traveler_persona, default_pacing)
VALUES 
('traveler@example.com', 'Alex Rivera', 'explorer', 'balanced')
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Seed Trips for the 3 Project Scenarios
INSERT INTO public.trips (
    id, user_id, title, destination, duration_days, traveler_type, group_size, budget_tier, total_budget, estimated_cost, pacing, itinerary_json
) VALUES 
(
    'scenario-1-solo-weekend',
    'guest-user',
    'Solo Explorer: Vibrant Barcelona in 48 Hours',
    'Barcelona, Spain',
    2,
    'solo',
    1,
    'balanced',
    650.00,
    520.00,
    'balanced',
    '{"id": "scenario-1-solo-weekend", "title": "Solo Explorer: Vibrant Barcelona in 48 Hours", "destination": "Barcelona, Spain", "duration_days": 2, "traveler_type": "solo"}'::jsonb
),
(
    'scenario-2-couple-romantic',
    'guest-user',
    'Romantic Escape: Clifftop Splendor & Amalfi Serenade',
    'Positano & Amalfi Coast, Italy',
    3,
    'couple',
    2,
    'luxury',
    2400.00,
    2280.00,
    'relaxed',
    '{"id": "scenario-2-couple-romantic", "title": "Romantic Escape: Clifftop Splendor & Amalfi Serenade", "destination": "Positano & Amalfi Coast, Italy", "duration_days": 3, "traveler_type": "couple"}'::jsonb
),
(
    'scenario-3-group-multiday',
    'guest-user',
    'Kyoto & Osaka Group Odyssey: Ancient Shrines to Neon Alleys',
    'Kyoto & Osaka, Japan',
    4,
    'group',
    4,
    'balanced',
    3600.00,
    3320.00,
    'balanced',
    '{"id": "scenario-3-group-multiday", "title": "Kyoto & Osaka Group Odyssey: Ancient Shrines to Neon Alleys", "destination": "Kyoto & Osaka, Japan", "duration_days": 4, "traveler_type": "group"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
