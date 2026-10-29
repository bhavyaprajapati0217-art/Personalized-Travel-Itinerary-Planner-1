import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, Activity, Bookmark, Printer, Sparkles, 
  RotateCcw, DollarSign, ArrowRight, Share2, Check, MessageSquare
} from 'lucide-react';
import ActivityCard from './ActivityCard';
import BudgetTracker from './BudgetTracker';
import MapLogisticsView from './MapLogisticsView';

export default function ItineraryView({ 
  itinerary, 
  onSaveTrip, 
  onRegenerateDay, 
  onSwapActivity,
  isSaving 
}) {
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false);
  const [regenFeedback, setRegenFeedback] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!itinerary) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm my-12">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Itinerary Loaded</h3>
        <p className="text-xs text-slate-500 mb-6">
          Generate a custom trip with the Smart Trip Builder or select one of the built-in curriculum scenarios from the dashboard.
        </p>
      </div>
    );
  }

  const days = itinerary.days || [];
  const currentDay = days.find((d) => d.day_number === selectedDayNumber) || days[0];

  const handleSave = async () => {
    await onSaveTrip(itinerary);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRegenerateDaySubmit = async (e) => {
    e.preventDefault();
    if (!regenFeedback.trim()) return;
    setIsRegenerating(true);
    try {
      await onRegenerateDay({
        destination: itinerary.destination,
        day_number: selectedDayNumber,
        current_theme: currentDay?.theme,
        feedback_or_preference: regenFeedback.trim(),
        traveler_type: itinerary.traveler_type,
        budget_tier: itinerary.budget_breakdown?.budget_limit ? 'balanced' : 'balanced',
      });
      setIsRegenModalOpen(false);
      setRegenFeedback('');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {itinerary.destination}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
                {itinerary.duration_days} Days / {itinerary.duration_days - 1 > 0 ? `${itinerary.duration_days - 1} Nights` : 'Day Trip'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full capitalize">
                {itinerary.traveler_type} Persona
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full capitalize">
                {itinerary.pacing} Pacing
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {itinerary.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
              {itinerary.trip_summary}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:self-start lg:self-center">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved to Supabase!
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Trip'}
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Itinerary Day
            </span>
            <button
              onClick={() => setIsRegenModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Regenerate Day {selectedDayNumber}</span>
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((day) => (
              <button
                key={day.day_number}
                onClick={() => setSelectedDayNumber(day.day_number)}
                className={`flex-shrink-0 px-5 py-3 rounded-2xl border text-left transition-all ${
                  selectedDayNumber === day.day_number
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-[11px] font-medium opacity-80">Day {day.day_number}</div>
                <div className="text-xs font-bold truncate max-w-[140px]">{day.theme || `Day ${day.day_number}`}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Day Detail Banner */}
      {currentDay && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white rounded-2xl border border-blue-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Day {currentDay.day_number} Focus
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {currentDay.theme}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
              {currentDay.summary}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-blue-200/80 shadow-sm text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                Day Cost Est.
              </span>
              <span className="text-sm font-extrabold text-emerald-600">
                ${currentDay.day_estimated_cost ? currentDay.day_estimated_cost.toFixed(2) : '0.00'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span>Scheduled Activities & Transit Flow</span>
          <span className="text-xs font-normal text-slate-500">
            ({currentDay?.activities?.length || 0} items)
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentDay?.activities?.map((activity, idx) => (
            <ActivityCard
              key={activity.id || idx}
              activity={activity}
              destination={itinerary.destination}
              onSwapActivity={(act) => onSwapActivity(selectedDayNumber, act)}
            />
          ))}
        </div>
      </div>

      {/* Budget Breakdown Component */}
      <BudgetTracker budgetBreakdown={itinerary.budget_breakdown} />

      {/* Logistics & Transit View */}
      <MapLogisticsView logistics={itinerary.logistics} days={itinerary.days} />

      {/* Regenerate Day Modal */}
      {isRegenModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Regenerate Day {selectedDayNumber}</h3>
              </div>
              <button
                onClick={() => setIsRegenModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Tell the AI travel planner what to modify for Day {selectedDayNumber} (e.g. "I want more outdoor nature activities instead of museums" or "Focus on street food and budget dining").
            </p>

            <form onSubmit={handleRegenerateDaySubmit} className="space-y-4">
              <textarea
                required
                rows={3}
                placeholder="What changes or preferences would you like for this day?"
                value={regenFeedback}
                onChange={(e) => setRegenFeedback(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegenModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegenerating}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-60"
                >
                  {isRegenerating ? 'Regenerating...' : 'Apply Regeneration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
