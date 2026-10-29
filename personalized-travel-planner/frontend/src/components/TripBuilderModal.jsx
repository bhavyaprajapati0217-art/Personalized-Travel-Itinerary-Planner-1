import React, { useState } from 'react';
import { X, Sparkles, MapPin, Calendar, Users, DollarSign, Activity, Utensils, Compass, Check } from 'lucide-react';

const INTERESTS_OPTIONS = [
  { id: 'sightseeing', label: 'Sightseeing & Landmarks', icon: '🏛️' },
  { id: 'food', label: 'Local Food & Street Markets', icon: '🍜' },
  { id: 'culture', label: 'Art, History & Museums', icon: '🎨' },
  { id: 'romantic', label: 'Romantic & Scenic Views', icon: '🌅' },
  { id: 'adventure', label: 'Outdoor Adventure & Hikes', icon: '🧗' },
  { id: 'nightlife', label: 'Nightlife, Pubs & Live Music', icon: '🍸' },
  { id: 'relaxation', label: 'Relaxation & Spa', icon: '🧖' },
  { id: 'shopping', label: 'Artisan & Shopping', icon: '🛍️' },
];

export default function TripBuilderModal({ isOpen, onClose, onGenerate, isGenerating }) {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('2026-11-15');
  const [endDate, setEndDate] = useState('2026-11-18');
  const [durationDays, setDurationDays] = useState(3);
  const [travelerType, setTravelerType] = useState('solo');
  const [groupSize, setGroupSize] = useState(1);
  const [budgetTier, setBudgetTier] = useState('balanced');
  const [totalBudget, setTotalBudget] = useState(1200);
  const [pacing, setPacing] = useState('balanced');
  const [selectedInterests, setSelectedInterests] = useState(['sightseeing', 'food']);
  const [accommodation, setAccommodation] = useState('hotel');
  const [dietary, setDietary] = useState('');
  const [specialReq, setSpecialReq] = useState('');

  if (!isOpen) return null;

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleDatesChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (start && end) {
      const d1 = new Date(start);
      const d2 = new Date(end);
      const diffTime = Math.abs(d2 - d1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDurationDays(Math.min(Math.max(diffDays, 1), 14));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination.trim()) {
      alert('Please enter a destination.');
      return;
    }
    const payload = {
      destination: destination.trim(),
      start_date: startDate,
      end_date: endDate,
      duration_days: Number(durationDays),
      traveler_type: travelerType,
      group_size: travelerType === 'solo' ? 1 : Number(groupSize),
      budget_tier: budgetTier,
      total_budget: Number(totalBudget),
      pacing: pacing,
      interests: selectedInterests.length > 0 ? selectedInterests : ['sightseeing'],
      accommodation_preference: accommodation,
      dietary_restrictions: dietary ? dietary.split(',').map(s => s.trim()) : [],
      special_requirements: specialReq.trim() || null,
    };
    onGenerate(payload);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Smart Trip Builder</h2>
              <p className="text-xs text-slate-500">Curate a personalized AI travel itinerary in seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" /> Destination City or Region
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tokyo, Paris, Rome, Bali, New York..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => handleDatesChange(e.target.value, endDate)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => handleDatesChange(startDate, e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Total Days
              </label>
              <div className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-blue-600 flex items-center justify-center">
                {durationDays} Day{durationDays > 1 ? 's' : ''} Plan
              </div>
            </div>
          </div>

          {/* Traveler Persona & Group Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Traveler Persona
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'solo', label: 'Solo Traveler' },
                  { id: 'couple', label: 'Couple' },
                  { id: 'group', label: 'Small Group' },
                  { id: 'family', label: 'Family' },
                ].map((type) => (
                  <button
                    type="button"
                    key={type.id}
                    onClick={() => {
                      setTravelerType(type.id);
                      if (type.id === 'solo') setGroupSize(1);
                      else if (type.id === 'couple') setGroupSize(2);
                      else if (type.id === 'group' && groupSize < 3) setGroupSize(4);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      travelerType === type.id
                        ? 'bg-blue-50 text-blue-600 border-blue-500 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {travelerType !== 'solo' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Number of Travelers
                </label>
                <input
                  type="number"
                  min="2"
                  max="20"
                  value={groupSize}
                  onChange={(e) => setGroupSize(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Budget & Pacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Total Budget (USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">$</span>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 mt-2">
                {['budget', 'balanced', 'luxury'].map((tier) => (
                  <button
                    type="button"
                    key={tier}
                    onClick={() => setBudgetTier(tier)}
                    className={`flex-1 py-1 text-[11px] font-semibold rounded-lg capitalize border ${
                      budgetTier === tier
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-400'
                        : 'border-slate-200 text-slate-500'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-blue-600" /> Trip Pacing
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'relaxed', label: 'Relaxed', desc: '2-3 spots' },
                  { id: 'balanced', label: 'Balanced', desc: '3-4 spots' },
                  { id: 'fast-paced', label: 'Fast-paced', desc: '4-5 spots' },
                ].map((p) => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPacing(p.id)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      pacing === p.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-[10px] text-slate-400">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interests Chips */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-blue-600" /> Interests & Focus Areas
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {INTERESTS_OPTIONS.map((item) => {
                const isSelected = selectedInterests.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleInterest(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dietary Restrictions & Special Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-blue-600" /> Dietary Preferences (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Vegetarian, Halal, Gluten-free..."
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Special Requests or Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Accessible entrances, early risers..."
                value={specialReq}
                onChange={(e) => setSpecialReq(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 disabled:opacity-60 transition-all transform active:scale-95"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Itinerary...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Build My Itinerary
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
