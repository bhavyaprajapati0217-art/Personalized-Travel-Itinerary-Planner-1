import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Lightbulb, Navigation, RefreshCw, CheckCircle, Tag } from 'lucide-react';

const CATEGORY_STYLES = {
  attraction: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: '🏛️',
    label: 'Attraction'
  },
  dining: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: '🍽️',
    label: 'Dining & Food'
  },
  accommodation: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: '🏨',
    label: 'Stay & Rest'
  },
  logistics: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: '🚆',
    label: 'Logistics / Transit'
  },
  leisure: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: '🌅',
    label: 'Scenic Leisure'
  },
  adventure: {
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    icon: '🧗',
    label: 'Adventure'
  },
  nightlife: {
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: '🍸',
    label: 'Nightlife'
  }
};

export default function ActivityCard({ activity, destination, onSwapActivity }) {
  const [isSwapping, setIsSwapping] = useState(false);
  const catStyle = CATEGORY_STYLES[activity.category?.toLowerCase()] || CATEGORY_STYLES.attraction;

  const handleSwap = async () => {
    setIsSwapping(true);
    try {
      await onSwapActivity(activity);
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
      {/* Category Accent top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            {activity.time_range || activity.time_slot}
          </span>
          <span className="text-slate-300">•</span>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catStyle.badge} flex items-center gap-1`}>
            <span>{catStyle.icon}</span>
            <span>{catStyle.label}</span>
          </span>
        </div>

        {/* Cost Badge */}
        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          <DollarSign className="w-3.5 h-3.5" />
          <span>{activity.estimated_cost === 0 ? 'Free' : `$${activity.estimated_cost} / person`}</span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1.5">
        {activity.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed mb-3">
        {activity.description}
      </p>

      {/* Location & Transit */}
      <div className="space-y-1.5 mb-3 text-xs text-slate-500">
        {activity.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
        )}

        {activity.transit_info && (
          <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50/60 p-2 rounded-lg text-[11px]">
            <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{activity.transit_info}</span>
          </div>
        )}
      </div>

      {/* Booking Tip Box */}
      {activity.booking_tip && (
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-2.5 flex items-start gap-2 text-xs text-amber-900 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950">Insider Tip: </span>
            <span>{activity.booking_tip}</span>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
        <span className="text-slate-400">
          Est. duration: <strong className="text-slate-700">{activity.duration_hours || 1.5} hrs</strong>
        </span>

        <button
          onClick={handleSwap}
          disabled={isSwapping}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSwapping ? 'animate-spin' : ''}`} />
          <span>{isSwapping ? 'Finding alternative...' : 'Swap Activity'}</span>
        </button>
      </div>
    </div>
  );
}
