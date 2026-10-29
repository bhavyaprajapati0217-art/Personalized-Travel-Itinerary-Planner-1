import React from 'react';
import { User, Heart, Users, ArrowRight, Sparkles, MapPin, Calendar, DollarSign, Clock } from 'lucide-react';

const SCENARIOS = [
  {
    key: 'scenario_1',
    badge: 'Scenario 1',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: User,
    iconBg: 'bg-emerald-500',
    title: 'Solo Traveler Weekend Getaway',
    destination: 'Barcelona, Spain',
    duration: '2 Days / Weekend',
    budget: '$650 Total',
    persona: 'Solo Explorer • High Sightseeing Density',
    description: 'Optimized 48-hour plan connecting Gaudí’s Sagrada Família & Park Güell, Boqueria tapas market, and Gothic Quarter walks with low transit friction.',
    highlights: ['Zero transit friction', 'Solo-friendly counter dining', 'Skip-the-line timed tickets']
  },
  {
    key: 'scenario_2',
    badge: 'Scenario 2',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: Heart,
    iconBg: 'bg-rose-500',
    title: 'Couple Romantic Vacation',
    destination: 'Amalfi Coast & Positano, Italy',
    duration: '3 Days / 2 Nights',
    budget: '$2,400 Luxury',
    persona: 'Romantic Couple • Relaxed Pacing',
    description: 'Curated cliffside vacation featuring private Gozzo boat charters to Capri, Ravello Villa Cimbrone infinity terrace, and candlelit seafood dinners.',
    highlights: ['Private Capri boat charter', 'Villa Cimbrone terrace', 'Boutique cliffside dining']
  },
  {
    key: 'scenario_3',
    badge: 'Scenario 3',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: Users,
    iconBg: 'bg-indigo-500',
    title: 'Small Group Multi-Day Trip',
    destination: 'Kyoto & Osaka, Japan',
    duration: '4 Days / 3 Nights',
    budget: '$3,600 (Group of 4)',
    persona: 'Group of 4 • Adventure & Culture',
    description: 'Coordinated group itinerary balancing Arashiyama bamboo hikes, Fushimi Inari torii gates, Dotonbori food alleys, with budget splitting & dietary care.',
    highlights: ['Group transport passes (ICOCA)', 'Vegetarian-friendly options', 'Bullet train coordination']
  }
];

export default function ScenarioPresets({ onLoadScenario, loadingKey }) {
  return (
    <div className="mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Curriculum Core Evaluation Scenarios
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Explore Built-in Project Scenarios
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Test and evaluate the 3 core personas defined in the project syllabus with one click.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SCENARIOS.map((item) => {
          const Icon = item.icon;
          const isLoading = loadingKey === item.key;

          return (
            <div
              key={item.key}
              className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <div className={`w-9 h-9 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1 font-medium text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    {item.destination}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {item.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    {item.budget}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Highlights tags */}
                <div className="space-y-1.5 mb-6">
                  {item.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onLoadScenario(item.key)}
                disabled={Boolean(loadingKey)}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-transparent rounded-xl text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-2 group-hover:shadow-sm disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Generating Plan...
                  </span>
                ) : (
                  <>
                    <span>Load {item.badge}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
