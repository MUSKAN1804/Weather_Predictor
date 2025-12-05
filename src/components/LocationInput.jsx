import React from 'react';

export default function LocationInput({
  city,
  setCity,
  onSearch,
  onUseLocation,
  isLocating,
  loading,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!city.trim()) return;
    onSearch();
  };

  return (
    <div className="mt-5 flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row gap-3 md:items-center"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city, town or village"
            className="w-full rounded-2xl bg-white border border-slate-300 px-4 py-3 pr-10 text-sm md:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 shadow-sm"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
            🔍
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 px-5 py-3 text-sm md:text-base font-semibold text-white shadow-md disabled:opacity-60 disabled:shadow-none transition"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 md:gap-3 items-center">
        <button
          type="button"
          onClick={onUseLocation}
          disabled={isLocating || loading}
          className="inline-flex items-center gap-2 rounded-2xl border border-sky-500 bg-sky-50 px-4 py-2.5 text-xs md:text-sm font-medium text-sky-700 hover:bg-sky-100 disabled:opacity-60 transition"
        >
          <span>{isLocating ? 'Detecting location...' : 'Use My Location'}</span>
          <span className="text-lg">📍</span>
        </button>

        <p className="text-[11px] md:text-xs text-slate-500">
          Allow location access for instant weather like your phone app.
        </p>
      </div>
    </div>
  );
}