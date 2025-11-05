'use client';

import { Search, Filter, Sun, Moon, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ControlPanel() {
  const {
    searchTerm,
    setSearchTerm,
    selectedCloudProvider,
    setSelectedCloudProvider,
    timeRange,
    setTimeRange,
    showRealtime,
    toggleRealtime,
    showHistorical,
    toggleHistorical,
    showRegions,
    toggleRegions,
    darkMode,
    toggleDarkMode,
    latencyRange,
    setLatencyRange,
  } = useStore();

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Control Panel
        </h2>
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium mb-2">Search Exchange</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search exchanges..."
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-xs text-gray-400 mt-1">Filtering by "{searchTerm}"</p>
          )}
        </div>

        {/* Cloud Provider */}
        <div>
          <label className="block text-sm font-medium mb-3">Cloud Provider</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'all', label: 'All', color: '#ffffff' },
              { value: 'AWS', label: 'AWS', color: '#FF9900' },
              { value: 'GCP', label: 'GCP', color: '#4285F4' },
              { value: 'Azure', label: 'Azure', color: '#00FF00' }
            ].map((provider) => (
              <button
                key={provider.value}
                onClick={() => setSelectedCloudProvider(provider.value as any)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedCloudProvider === provider.value
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {provider.value !== 'all' && (
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: provider.color }} />
                )}
                {provider.label}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Time Range</label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className={`w-full px-4 py-2.5 rounded-lg border ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
          >
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Latency Range */}
        <div>
          <label className="block text-sm font-medium mb-2">Latency Range (ms)</label>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Min</label>
              <input
                type="number"
                value={latencyRange[0]}
                onChange={(e) => setLatencyRange([Number(e.target.value), latencyRange[1]])}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-400 mb-1 block">Max</label>
              <input
                type="number"
                value={latencyRange[1]}
                onChange={(e) => setLatencyRange([latencyRange[0], Number(e.target.value)])}
                className={`w-full px-3 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700 text-white'
                    : 'bg-gray-50 border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div>
          <label className="block text-sm font-medium mb-3">Visualization Layers</label>
          <div className="space-y-3">
            {[
              { label: 'Real-time Latency', checked: showRealtime, toggle: toggleRealtime },
              { label: 'Historical Data', checked: showHistorical, toggle: toggleHistorical },
              { label: 'Cloud Regions', checked: showRegions, toggle: toggleRegions }
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-medium">{item.label}</span>
                <button
                  onClick={item.toggle}
                  className={`relative w-12 h-6 rounded-full ${
                    item.checked ? 'bg-blue-600' : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    item.checked ? 'translate-x-6' : ''
                  }`} />
                </button>
              </label>
            ))}
          </div>
        </div>

        {/* Legends */}
        <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <label className="block text-sm font-medium mb-3">Latency Colors</label>
          <div className="space-y-2">
            {[
              { color: '#22c55e', label: 'Low (<50ms)' },
              { color: '#eab308', label: 'Medium (50-100ms)' },
              { color: '#f97316', label: 'High (100-150ms)' },
              { color: '#ef4444', label: 'Critical (>150ms)' }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <label className="block text-sm font-medium mb-3">Provider Colors</label>
          <div className="space-y-2">
            {[
              { color: '#FF9900', label: 'AWS' },
              { color: '#4285F4', label: 'GCP' },
              { color: '#00FF00', label: 'Azure' }
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}