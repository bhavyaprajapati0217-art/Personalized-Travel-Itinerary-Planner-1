import React from 'react';
import { Bus, Plane, Luggage, ShieldAlert, Ticket, MapPin } from 'lucide-react';

export default function MapLogisticsView({ logistics, days = [] }) {
  if (!logistics) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Bus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900">Logistics & Transit Intelligence</h3>
          <p className="text-xs text-slate-500">Automated transportation planning, arrival logistics, and packing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Airport & Transit pass */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <Plane className="w-4 h-4" /> Airport & Arrival Transfer
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {logistics.airport_transfer_tip}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
              <Ticket className="w-4 h-4" /> Recommended Local Transit Pass
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {logistics.local_transport_pass || logistics.best_transit_mode}
            </p>
          </div>
        </div>

        {/* Right Column: Packing Tips & Safety */}
        <div className="space-y-4">
          {logistics.packing_tips && logistics.packing_tips.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
                <Luggage className="w-4 h-4" /> Curated Packing Essentials
              </div>
              <ul className="space-y-1 text-xs text-slate-700">
                {logistics.packing_tips.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {logistics.safety_notes && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4" /> Traveler Safety & Advisories
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {logistics.safety_notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
