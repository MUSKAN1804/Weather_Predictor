import React, { useState } from 'react';
import { getWeatherDescription } from '../utils/weatherCodes';

export default function WeatherCard({ locationName, weather, isCurrentLocation }) {
  if (!weather || !weather.current) return null;

  const { current, todayMin, todayMax } = weather;
  const { temperature, windspeed, winddirection, weathercode, time } = current;
  const desc = getWeatherDescription(weathercode);

  const dateObj = new Date(time);
  const formattedTime = dateObj.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  // sun | moon | cloud | wind
  const [activeInfo, setActiveInfo] = useState('sun');

  const infoConfig = {
    sun: {
      title: 'Day Temperature',
      line1:
        todayMax != null
          ? `Today’s maximum temperature is around ${Math.round(todayMax)}°C.`
          : 'Day temperature data is not available.',
      line2: 'Use this to check daytime heat and plan outdoor activities.',
    },
    moon: {
      title: 'Night Temperature',
      line1:
        todayMin != null
          ? `Tonight’s minimum temperature may drop to around ${Math.round(
              todayMin,
            )}°C.`
          : 'Night temperature data is not available.',
      line2: 'Helps you decide how cold or warm the night will feel.',
    },
    cloud: {
      title: 'Cloud & Rain',
      line1: `Current sky condition: ${desc.label}.`,
      line2: 'Shows if it is clear, cloudy or raining, based on live weather code.',
    },
    wind: {
      title: 'Wind Details',
      line1: `Wind speed is around ${Math.round(windspeed)} km/h.`,
      line2: `Wind direction is approximately ${Math.round(
        winddirection,
      )}°, showing where the wind is blowing from.`,
    },
  };

  const active = infoConfig[activeInfo];

  const emojiItems = [
    { key: 'sun', icon: '☀️', label: 'Sun' },
    { key: 'moon', icon: '🌙', label: 'Moon' },
    { key: 'cloud', icon: '☁️', label: 'Cloud' },
    { key: 'wind', icon: '🌬️', label: 'Wind' },
  ];

  // Big icon + card theme based on active emoji
  let bigIcon = '☀️';
  let bigIconExtra = '';
  let cardThemeClasses =
    'bg-white text-slate-900 border-slate-200';
  let bgGradient = 'from-sky-100 via-slate-50 to-slate-100';

  if (activeInfo === 'sun') {
    bigIcon = '☀️';
    bigIconExtra = 'animate-pulse';
    cardThemeClasses = 'bg-white text-slate-900 border-slate-200';
    bgGradient = 'from-sky-100 via-slate-50 to-slate-100';
  } else if (activeInfo === 'moon') {
    bigIcon = '🌙';
    bigIconExtra = 'animate-pulse';
    cardThemeClasses = 'bg-slate-900 text-sky-50 border-slate-800';
    bgGradient = 'from-slate-900 via-slate-950 to-slate-900';
  } else if (activeInfo === 'cloud') {
    bigIcon = '🌧️';
    bigIconExtra = 'animate-bounce';
    cardThemeClasses = 'bg-sky-50 text-slate-900 border-sky-100';
    bgGradient = 'from-sky-100 via-sky-50 to-slate-100';
  } else if (activeInfo === 'wind') {
    bigIcon = '💨';
    bigIconExtra = 'animate-pulse';
    cardThemeClasses = 'bg-white text-slate-900 border-slate-200';
    bgGradient = 'from-sky-50 via-slate-50 to-slate-100';
  }

  return (
    <div className={`w-full max-w-xl mx-auto rounded-3xl shadow-[0_18px_40px_rgba(15,23,42,0.18)] p-6 md:p-7 mt-4 border bg-gradient-to-b ${bgGradient}`}>
      <div className={`rounded-2xl p-5 md:p-6 transition-colors duration-300 ${cardThemeClasses}`}>
        {/* Top: location + date/time */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-sky-600 mb-1">
              {isCurrentLocation ? 'Current Location' : 'Selected Location'}
            </p>
            <div className="flex items-center gap-1 text-sm font-medium">
              <span className="text-base">📍</span>
              <span className="line-clamp-1">{locationName || 'Unknown location'}</span>
            </div>
            <p className="text-xs mt-1 text-slate-500 dark:text-slate-300">
              {formattedDate} • Updated {formattedTime}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 dark:text-slate-300">
            <p>{isCurrentLocation ? 'Using GPS' : 'Manual search'}</p>
            <p>Code {weathercode}</p>
          </div>
        </div>

        {/* Middle: main temperature + big animated icon */}
        <div className="mt-5 flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <div className="flex items-start gap-2 leading-none">
              <span className="text-6xl md:text-7xl font-semibold">
                {Math.round(temperature)}
              </span>
              <span className="text-3xl mt-1">°C</span>
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm md:text-base text-slate-600 dark:text-slate-100">
              <span className="text-xl">{desc.icon}</span>
              <span>{desc.label}</span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div
              className={
                'w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-inner transition-transform duration-300 ' +
                (activeInfo === 'moon'
                  ? 'bg-slate-800 text-sky-100'
                  : activeInfo === 'cloud'
                  ? 'bg-sky-100 text-slate-800'
                  : activeInfo === 'wind'
                  ? 'bg-slate-100 text-slate-900'
                  : 'bg-sky-50 text-amber-400') +
                ' ' +
                bigIconExtra
              }
            >
              {bigIcon}
            </div>

            {/* Emoji row with hover + click info */}
            <div className="flex gap-3 text-[11px] text-slate-600 dark:text-slate-100">
              {emojiItems.map((item) => {
                const isActive = activeInfo === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveInfo(item.key)}
                    className={
                      'flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition transform cursor-pointer focus:outline-none ' +
                      (isActive
                        ? 'bg-sky-100 text-sky-700 shadow-sm scale-110 -translate-y-0.5'
                        : 'hover:bg-sky-50 hover:shadow-sm hover:-translate-y-0.5 hover:scale-105')
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom: now / high / low */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-[11px] md:text-xs">
          <div className="rounded-2xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 flex flex-col gap-0.5">
            <span className="uppercase tracking-wide text-[10px] text-slate-500 dark:text-slate-300">
              Now
            </span>
            <span className="text-sm md:text-base font-semibold">
              {Math.round(temperature)}°C
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-300">
              Current temperature
            </span>
          </div>

          <div className="rounded-2xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 flex flex-col gap-0.5">
            <span className="uppercase tracking-wide text-[10px] text-slate-500 dark:text-slate-300">
              Today High
            </span>
            <span className="text-sm md:text-base font-semibold">
              {todayMax != null ? Math.round(todayMax) : '--'}°C
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-300">
              Daytime max
            </span>
          </div>

          <div className="rounded-2xl bg-white/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2.5 flex flex-col gap-0.5">
            <span className="uppercase tracking-wide text-[10px] text-slate-500 dark:text-slate-300">
              Tonight Low
            </span>
            <span className="text-sm md:text-base font-semibold">
              {todayMin != null ? Math.round(todayMin) : '--'}°C
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-300">
              Expected low
            </span>
          </div>
        </div>

        {/* Click-based detail section */}
        <div className="mt-5 rounded-2xl bg-white/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-3 text-[11px] md:text-xs">
          <p className="font-semibold mb-0.5">
            {active.title}
          </p>
          <p className="">
            {active.line1}
          </p>
          <p className="mt-0.5 text-slate-600 dark:text-slate-300">
            {active.line2}
          </p>
        </div>
      </div>
    </div>
  );
}