import React, { useEffect, useState } from 'react';
import LocationInput from './components/LocationInput';
import WeatherCard from './components/WeatherCard';
import ForecastGraph from './components/ForecastGraph';

const GEO_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

async function fetchCoordinates(city) {
  const url = new URL(GEO_API);
  url.searchParams.set('name', city);
  url.searchParams.set('count', 1);
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch location');
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('No location found for that name');
  }
  const loc = data.results[0];
  const parts = [loc.name, loc.admin2, loc.admin1, loc.country].filter(Boolean);
  return {
    lat: loc.latitude,
    lon: loc.longitude,
    displayName: parts.join(', '),
  };
}

async function fetchWeather(lat, lon) {
  const url = new URL(WEATHER_API);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('daily', 'weathercode,temperature_2m_max,temperature_2m_min');
  url.searchParams.set('timezone', 'auto');

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather');
  const data = await res.json();

  const todayMax = data.daily?.temperature_2m_max?.[0] ?? null;
  const todayMin = data.daily?.temperature_2m_min?.[0] ?? null;

  return {
    current: data.current_weather,
    todayMax,
    todayMin,
    daily: data.daily,
  };
}

export default function App() {
  const [city, setCity] = useState('');
  const [activeWeather, setActiveWeather] = useState(null);
  const [activeLocationName, setActiveLocationName] = useState('');
  const [isCurrentLocation, setIsCurrentLocation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');
  const [clock, setClock] = useState({
    time: '',
    date: '',
  });

  // Live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const date = now.toLocaleDateString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      setClock({ time, date });
    };

    updateClock();
    const id = setInterval(updateClock, 1000);
    return () => clearInterval(id);
  }, []);

  // Detect location on first load
  useEffect(() => {
    handleUseLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported in this browser.');
      return;
    }

    setIsLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const weather = await fetchWeather(latitude, longitude);
          setActiveWeather(weather);
          setIsCurrentLocation(true);

          // Reverse geocoding using the same geo API
          const url = new URL(GEO_API);
          url.searchParams.set('latitude', latitude);
          url.searchParams.set('longitude', longitude);
          url.searchParams.set('count', 1);
          url.searchParams.set('language', 'en');

          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              const loc = data.results[0];
              const parts = [loc.name, loc.admin2, loc.admin1, loc.country].filter(Boolean);
              setActiveLocationName(parts.join(', '));
            } else {
              setActiveLocationName('Your location');
            }
          } else {
            setActiveLocationName('Your location');
          }
        } catch (err) {
          console.error(err);
          setError(err.message || 'Failed to get current location weather.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error(err);
        if (err.code === 1) {
          setError('Location permission denied. You can still search by city name.');
        } else {
          setError('Unable to detect your location. Please search manually.');
        }
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  const handleSearchCity = async () => {
    if (!city.trim()) return;
    try {
      setLoading(true);
      setError('');
      const coords = await fetchCoordinates(city.trim());
      const weather = await fetchWeather(coords.lat, coords.lon);
      setActiveWeather(weather);
      setActiveLocationName(coords.displayName);
      setIsCurrentLocation(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch weather for that place.');
      setActiveWeather(null);
      setActiveLocationName('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-slate-50 to-slate-100 text-slate-900 flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-5xl flex flex-col items-center gap-5">
        {/* App header */}
        <header className="w-full max-w-xl text-center">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
            SkyPulse Weather
          </h1>
          <p className="text-[11px] md:text-xs text-slate-500 mt-1">
            {clock.date} • Local time: <span className="font-medium text-slate-900">{clock.time}</span>
          </p>
        </header>

        {/* Main weather card */}
        <WeatherCard
          locationName={activeLocationName || (activeWeather ? 'Your location' : 'Detecting...')}
          weather={activeWeather}
          isCurrentLocation={isCurrentLocation}
        />

        {/* 5-day forecast graph */}
        {activeWeather?.daily && (
          <ForecastGraph daily={activeWeather.daily} />
        )}

        {/* Controls */}
        <div className="w-full max-w-xl mt-1">
          <LocationInput
            city={city}
            setCity={setCity}
            onSearch={handleSearchCity}
            onUseLocation={handleUseLocation}
            isLocating={isLocating}
            loading={loading}
          />

          {error && (
            <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-[11px] md:text-xs text-rose-700">
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}