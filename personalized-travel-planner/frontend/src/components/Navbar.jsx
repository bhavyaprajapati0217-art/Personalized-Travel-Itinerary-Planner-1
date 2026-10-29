import React from 'react';
import { Compass, Sparkles, Coins, Github, ExternalLink, Calendar, Bookmark } from 'lucide-react';

export default function Navbar({ onOpenNewTrip, onOpenSaved, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Mentor / Submission Banner from MySkillWallet */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl mx-auto w-full justify-between">
          <span className="flex items-center gap-1.5">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider">Project Notice</span>
            Add Demo and GitHub links so that your mentor can review and evaluate your project!
          </span>
          <div className="flex items-center gap-3">
            <a 
              href="#submission-guide" 
              onClick={(e) => { e.preventDefault(); alert("Open 'PROJECT_SUBMISSION_GUIDE.md' in your workspace root for full steps to deploy your live demo and push to GitHub!"); }}
              className="underline hover:text-amber-100 flex items-center gap-1 cursor-pointer font-semibold"
            >
              How to submit <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                Personalized Travel Planner
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                  AI SaaS
                </span>
              </div>
              <p className="text-xs text-slate-500">FastAPI • React • Gemini AI • Supabase</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'itinerary'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Current Itinerary
            </button>
            <button
              onClick={onOpenSaved}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Bookmark className="w-4 h-4 text-slate-400" />
              Saved Trips
            </button>
          </nav>

          {/* Credits & Action Button */}
          <div className="flex items-center gap-4">
            {/* Skillwallet Balance indicators */}
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <div className="flex items-center gap-1 text-slate-600 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>0 AI Token</span>
              </div>
              <div className="w-px h-3 bg-slate-300" />
              <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                <span>400 Credits</span>
              </div>
            </div>

            <button
              onClick={onOpenNewTrip}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-500/25 transition-all transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create New Trip</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
