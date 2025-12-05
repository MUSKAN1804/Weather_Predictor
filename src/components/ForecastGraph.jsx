import React from 'react';
import { getWeatherDescription } from '../utils/weatherCodes';

export default function ForecastGraph({ daily }) {
  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Take next 5 days
  const days = daily.time.slice(0, 5);
  const maxArr = daily.temperature_2m_max.slice(0, 5);
  const minArr = daily.temperature_2m_min.slice(0, 5);
  const codeArr = daily.weathercode ? daily.weathercode.slice(0, 5) : [];

  const globalMin = Math.min(...minArr);
  const globalMax = Math.max(...maxArr);
  const range = globalMax - globalMin || 1;

  const getDayLabel = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const scale = (value) => ((value - globalMin) / range) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mt-6 rounded-3xl bg-white/90 border border-slate-200 shadow-[0_12px_30px_rgba(15,23,42,0.12)] p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-900">
          5-Day Outlook
        </h3>
        <p className="text-[11px] text-slate-500">
          Daily high / low forecast
        </p>
      </div>

      <div className="space-y-3">
        {days.map((day, index) => {
          const hi = maxArr[index];
          const lo = minArr[index];
          const code = codeArr[index];
          const desc = getWeatherDescription(code || 0);

          const left = scale(lo);
          const right = scale(hi);
          const width = Math.max(right - left, 4);

          return (
            <div key={day} className="flex items-center gap-3 text-[11px] md:text-xs">
              <div className="w-12 text-slate-600">
                {getDayLabel(day)}
              </div>
              <div className="w-7 text-right text-slate-500">
                {Math.round(lo)}°
              </div>
              <div className="flex-1 relative h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="absolute inset-y-0 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                  }}
                />
              </div>
              <div className="w-10 text-left text-slate-700">
                {Math.round(hi)}°
              </div>
              <div className="hidden md:flex items-center gap-1 w-28 text-slate-500">
                <span className="text-sm">
                  {desc.icon}
                </span>
                <span className="truncate">
                  {desc.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}