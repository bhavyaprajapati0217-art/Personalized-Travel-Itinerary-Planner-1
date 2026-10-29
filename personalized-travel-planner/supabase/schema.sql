-- ====================================================================
-- Personalized Travel Itinerary Planner
-- Supabase PostgreSQL Relational Database Schema (Epic 2)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (User Accounts & Traveler Personas)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    preferred_currency TEXT DEFAULT 'USD',
    traveler_persona TEXT DEFAULT 'explorer', -- solo | couple | group | family
    default_pacing TEXT DEFAULT 'balanced',   -- relaxed | balanced | fast-paced
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Trips Table (Core Trip Container)
CREATE TABLE IF NOT EXISTS public.trips (
    id TEXT PRIMARY KEY,
    user_id TEXT DEFAULT 'guest-user',
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    duration_days INTEGER NOT NULL DEFAULT 1,
    traveler_type TEXT NOT NULL DEFAULT 'solo', -- solo | couple | group | family
    group_size INTEGER DEFAULT 1,
    budget_tier TEXT DEFAULT 'balanced',        -- budget | balanced | luxury
    total_budget NUMERIC(10, 2) DEFAULT 0.00,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    pacing TEXT DEFAULT 'balanced',
    itinerary_json JSONB NOT NULL,
    is_saved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Itinerary Days Table (Relational Day Breakdown)
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id TEXT REFERENCES public.trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date_label TEXT,
    theme TEXT NOT NULL,
    summary TEXT,
    day_estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Activities Table (Individual Day Itinerary Activities)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_id UUID REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
    time_slot TEXT NOT NULL, -- Morning | Afternoon | Evening | Night
    time_range TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,  -- attraction | dining | accommodation | logistics | leisure
    description TEXT,
    location TEXT,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    duration_hours NUMERIC(4, 2) DEFAULT 1.5,
    booking_tip TEXT,
    transit_info TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    is_regenerated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. User Preferences Table (Epic 3 Preference Matrix)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    interests TEXT[] DEFAULT ARRAY['sightseeing', 'food']::TEXT[],
    dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    accommodation_style TEXT DEFAULT 'hotel',
    mobility_notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip ON public.itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_day ON public.activities(day_id);

-- 8. Row Level Security (RLS) Policies
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for guest-mode and authenticated users
CREATE POLICY "Public full access to trips" ON public.trips
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public full access to itinerary_days" ON public.itinerary_days
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public full access to activities" ON public.activities
    FOR ALL USING (true) WITH CHECK (true);
