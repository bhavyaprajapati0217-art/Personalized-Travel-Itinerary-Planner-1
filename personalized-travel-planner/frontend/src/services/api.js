const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function fetchPresets() {
  try {
    const res = await fetch(`${API_BASE}/trips/scenarios/presets`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using client fallback presets', err);
  }
  return null;
}

export async function generateItinerary(preferences) {
  const res = await fetch(`${API_BASE}/trips/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Generation failed' }));
    throw new Error(err.detail || 'Failed to generate itinerary');
  }
  return await res.json();
}

export async function regenerateDay(reqData) {
  const res = await fetch(`${API_BASE}/trips/regenerate-day`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqData)
  });
  if (!res.ok) throw new Error('Failed to regenerate day');
  return await res.json();
}

export async function swapActivity(reqData) {
  const res = await fetch(`${API_BASE}/trips/swap-activity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reqData)
  });
  if (!res.ok) throw new Error('Failed to swap activity');
  return await res.json();
}

export async function saveTrip(trip) {
  const res = await fetch(`${API_BASE}/trips/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trip)
  });
  if (!res.ok) throw new Error('Failed to save trip');
  return await res.json();
}

export async function getSavedTrips() {
  const res = await fetch(`${API_BASE}/trips`);
  if (!res.ok) throw new Error('Failed to fetch saved trips');
  return await res.json();
}
