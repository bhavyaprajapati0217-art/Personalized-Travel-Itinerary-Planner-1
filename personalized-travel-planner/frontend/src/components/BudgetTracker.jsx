import React from 'react';
import { DollarSign, PieChart, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

export default function BudgetTracker({ budgetBreakdown }) {
  if (!budgetBreakdown) return null;

  const {
    currency = 'USD',
    attractions = 0,
    dining = 0,
    accommodation = 0,
    transportation = 0,
    miscellaneous = 0,
    total_estimated = 0,
    budget_limit = 0,
    remaining_balance = 0,
    is_within_budget = true,
  } = budgetBreakdown;

  const pctUsed = budget_limit > 0 ? Math.min(Math.round((total_estimated / budget_limit) * 100), 100) : 0;

  const categories = [
    { label: 'Attractions & Tours', amount: attractions, color: 'bg-indigo-500', barColor: 'bg-indigo-500', text: 'text-indigo-600' },
    { label: 'Dining & Food', amount: dining, color: 'bg-amber-500', barColor: 'bg-amber-500', text: 'text-amber-600' },
    { label: 'Accommodation', amount: accommodation, color: 'bg-emerald-500', barColor: 'bg-emerald-500', text: 'text-emerald-600' },
    { label: 'Transportation', amount: transportation, color: 'bg-blue-500', barColor: 'bg-blue-500', text: 'text-blue-600' },
    { label: 'Buffer / Misc', amount: miscellaneous, color: 'bg-slate-400', barColor: 'bg-slate-400', text: 'text-slate-600' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Estimated Budget & Cost Tracker</h3>
            <p className="text-xs text-slate-500">Live breakdown calculated across all days & activities</p>
          </div>
        </div>

        {/* Budget Status Badge */}
        <div>
          {is_within_budget ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Within Target Budget (${remaining_balance.toFixed(2)} left)
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Exceeds Target Budget
            </div>
          )}
        </div>
      </div>

      {/* Overview Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Estimated Total Cost</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            ${total_estimated.toFixed(2)} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Target Budget Cap</span>
          <div className="text-xl font-extrabold text-slate-900 mt-1">
            ${budget_limit.toFixed(2)} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs text-slate-500 font-medium">Remaining Buffer</span>
          <div className={`text-xl font-extrabold mt-1 ${remaining_balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ${remaining_balance.toFixed(2)} <span className="text-xs font-normal text-slate-500">{currency}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 mb-6">
        <div className="flex justify-between text-xs font-semibold text-slate-600">
          <span>Budget Utilization: {pctUsed}%</span>
          <span>${total_estimated.toFixed(0)} of ${budget_limit.toFixed(0)}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
          {categories.map((c, i) => {
            const widthPct = total_estimated > 0 ? (c.amount / total_estimated) * pctUsed : 0;
            return (
              <div
                key={i}
                style={{ width: `${widthPct}%` }}
                className={`${c.barColor} transition-all duration-500`}
                title={`${c.label}: $${c.amount}`}
              />
            );
          })}
        </div>
      </div>

      {/* Category Pills Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {categories.map((cat, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-100 bg-white">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${cat.color}`} />
              <span className="text-[11px] font-medium text-slate-500 truncate">{cat.label}</span>
            </div>
            <div className="text-sm font-bold text-slate-800">
              ${cat.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
