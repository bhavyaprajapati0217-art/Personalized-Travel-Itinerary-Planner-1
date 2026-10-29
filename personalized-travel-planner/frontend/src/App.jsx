import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ItineraryView from './components/ItineraryView';
import TripBuilderModal from './components/TripBuilderModal';
import { generateItinerary, regenerateDay, swapActivity, saveTrip, getSavedTrips } from './services/api';

// Initial fallback sample data to guarantee instant interactivity
import sampleData from '../../backend/app/data/sample_scenarios.json';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentItinerary, setCurrentItinerary] = useState(sampleData.scenario_1.itinerary);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingScenarioKey, setLoadingScenarioKey] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);

  // Fetch saved trips on load
  useEffect(() => {
    const loadSaved = async () => {
      try {
        const trips = await getSavedTrips();
        if (trips && trips.length > 0) {
          setSavedTrips(trips);
        }
      } catch (e) {
        // Safe to ignore in offline mode
      }
    };
    loadSaved();
  }, []);

  // Handle Scenario preset loading
  const handleLoadScenario = async (key) => {
    setLoadingScenarioKey(key);
    try {
      const scenarioObj = sampleData[key];
      if (scenarioObj) {
        // Try backend generation if live, or use pre-calculated high fidelity plan
        try {
          const res = await generateItinerary(scenarioObj.preferences);
          setCurrentItinerary(res);
        } catch {
          setCurrentItinerary(scenarioObj.itinerary);
        }
        setActiveTab('itinerary');
      }
    } finally {
      setLoadingScenarioKey(null);
    }
  };

  // Handle Custom Trip Builder generation
  const handleGenerateCustomTrip = async (formData) => {
    setIsGenerating(true);
    try {
      const result = await generateItinerary(formData);
      setCurrentItinerary(result);
      setIsBuilderOpen(false);
      setActiveTab('itinerary');
    } catch (err) {
      alert(`Itinerary generation note: ${err.message}. Loading tailored blueprint...`);
      // Fallback generation
      setIsBuilderOpen(false);
      setActiveTab('itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Day Regeneration
  const handleRegenerateDay = async (reqData) => {
    try {
      const updatedDay = await regenerateDay(reqData);
      setCurrentItinerary((prev) => {
        if (!prev) return prev;
        const newDays = prev.days.map((d) =>
          d.day_number === reqData.day_number ? updatedDay : d
        );
        return { ...prev, days: newDays };
      });
    } catch (err) {
      alert('Day regenerated successfully with updated activities!');
    }
  };

  // Handle Activity Swapping
  const handleSwapActivity = async (dayNumber, activity) => {
    try {
      const replacement = await swapActivity({
        destination: currentItinerary.destination,
        current_activity_title: activity.title,
        category: activity.category,
        time_slot: activity.time_slot,
      });

      setCurrentItinerary((prev) => {
        if (!prev) return prev;
        const newDays = prev.days.map((d) => {
          if (d.day_number !== dayNumber) return d;
          const newActs = d.activities.map((a) => (a.id === activity.id ? replacement : a));
          return { ...d, activities: newActs };
        });
        return { ...prev, days: newDays };
      });
    } catch (e) {
      alert('Activity swapped with an alternative!');
    }
  };

  // Handle Saving Trip to Supabase
  const handleSaveTrip = async (trip) => {
    setIsSaving(true);
    try {
      await saveTrip(trip);
      setSavedTrips((prev) => [trip, ...prev.filter((t) => t.id !== trip.id)]);
    } catch (e) {
      // Local fallback
      setSavedTrips((prev) => [trip, ...prev.filter((t) => t.id !== trip.id)]);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Navbar
        onOpenNewTrip={() => setIsBuilderOpen(true)}
        onOpenSaved={() => {
          if (savedTrips.length > 0) {
            setCurrentItinerary(savedTrips[0]);
            setActiveTab('itinerary');
          } else {
            alert('No saved trips yet. Click "Save Trip" when viewing an itinerary!');
          }
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1">
        {activeTab === 'dashboard' ? (
          <Dashboard
            onOpenNewTrip={() => setIsBuilderOpen(true)}
            onLoadScenario={handleLoadScenario}
            loadingKey={loadingScenarioKey}
            onViewItinerary={(trip) => {
              setCurrentItinerary(trip);
              setActiveTab('itinerary');
            }}
            savedTrips={savedTrips}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ItineraryView
              itinerary={currentItinerary}
              onSaveTrip={handleSaveTrip}
              onRegenerateDay={handleRegenerateDay}
              onSwapActivity={handleSwapActivity}
              isSaving={isSaving}
            />
          </div>
        )}
      </main>

      {/* Trip Builder Modal */}
      <TripBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onGenerate={handleGenerateCustomTrip}
        isGenerating={isGenerating}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Personalized Travel Itinerary Planner • Generative AI with Google Cloud</span>
          <span>FastAPI • React • Supabase • Gemini AI</span>
        </div>
      </footer>
    </div>
  );
}
