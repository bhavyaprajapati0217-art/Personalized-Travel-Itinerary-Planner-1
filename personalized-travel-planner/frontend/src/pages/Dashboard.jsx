import React from 'react';
import { Sparkles, MapPin, Calendar, Users, ArrowRight, ShieldCheck, Database, Cpu, Compass, Layers } from 'lucide-react';
import ScenarioPresets from '../components/ScenarioPresets';

export default function Dashboard({ 
  onOpenNewTrip, 
  onLoadScenario, 
  loadingKey, 
  onViewItinerary, 
  savedTrips = [] 
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero SaaS Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-blue-200 border border-white/15 mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Generative AI with Google Cloud & Supabase</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Personalized Travel <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Itinerary Planner
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed max-w-2xl">
            Intelligent automation and personalized recommendations for travelers. Generate day-by-day itineraries with attractions, dining, stays, and transit logistics optimized by generative AI.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={onOpenNewTrip}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2.5 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Smart Trip Builder</span>
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('scenarios-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/20 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <span>Explore 3 Project Scenarios</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Spec Metrics */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-white/10 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Framework</div>
            <div className="text-sm font-bold text-white mt-0.5">React + FastAPI</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Database</div>
            <div className="text-sm font-bold text-white mt-0.5">Supabase PostgreSQL</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">AI Foundation</div>
            <div className="text-sm font-bold text-white mt-0.5">Gemini 1.5 Flash</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Curriculum Epics</div>
            <div className="text-sm font-bold text-white mt-0.5">7 Epics / 24 Tasks</div>
          </div>
        </div>
      </div>

      {/* Curriculum Scenarios Section */}
      <div id="scenarios-section">
        <ScenarioPresets onLoadScenario={onLoadScenario} loadingKey={loadingKey} />
      </div>

      {/* Saved Trips Section if any */}
      {savedTrips.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Your Saved Itineraries</h3>
              <p className="text-xs text-slate-500">Stored in Supabase database</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onViewItinerary(trip)}
                className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all bg-slate-50/50"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {trip.destination}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-2 truncate">
                  {trip.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-200">
                  <span>{trip.duration_days} Days</span>
                  <span className="font-bold text-emerald-600">
                    ${trip.budget_breakdown?.total_estimated || trip.estimated_cost || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Architecture Overview (For Mentors & Evaluators) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">System Architecture & Technical Stack</h3>
            <p className="text-xs text-slate-500">Implemented per MySkillWallet Technical Specifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" /> Frontend (React + Vite + Tailwind)
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li>• SaaS Dashboard with 3 Curriculum Scenarios</li>
              <li>• Multi-step Smart Trip Builder with preference vectors</li>
              <li>• Interactive day timeline, budget tracker & transit view</li>
              <li>• In-place Day Regeneration & Activity Swapper</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> Backend (FastAPI + GenAI)
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li>• Asynchronous FastAPI RESTful API with Pydantic v2 schemas</li>
              <li>• Google Cloud Gemini prompt engineering service</li>
              <li>• Intelligent fallback engine with zero downtime</li>
              <li>• Day regeneration & activity replacement endpoints</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" /> Database (Supabase PostgreSQL)
            </div>
            <ul className="space-y-1.5 text-slate-600">
              <li>• PostgreSQL tables: profiles, trips, itinerary_days, activities</li>
              <li>• Row Level Security (RLS) policies</li>
              <li>• Optimized B-tree indexes for fast queries</li>
              <li>• Seed scripts for Scenarios 1, 2, and 3</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
