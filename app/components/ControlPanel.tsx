'use client';

import { Search, Filter, Sun, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CloudProvider } from '../types';

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
              placeholder="Search exchanges..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
            />
          </div>
        </div>

        {/* Cloud Provider Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Cloud Provider</label>
          <div className="grid grid-cols-2 gap-2">
            {(['all', 'AWS', 'GCP', 'Azure'] as const).map((provider) => (
              <button
                key={provider}
                onClick={() => setSelectedCloudProvider(provider)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCloudProvider === provider
                    ? 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {provider === 'all' ? 'All' : provider}
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
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-gray-50 border-gray-300 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
          >
            <option value="1h">Last 1 Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Visualization Layers */}
        <div>
          <label className="block text-sm font-medium mb-3">Visualization Layers</label>
          <div className="space-y-2">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm">Real-time Latency</span>
              <div
                onClick={toggleRealtime}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showRealtime ? 'bg-blue-600' : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    showRealtime ? 'transform translate-x-6' : ''
                  }`}
                />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm">Historical Data</span>
              <div
                onClick={toggleHistorical}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showHistorical ? 'bg-blue-600' : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    showHistorical ? 'transform translate-x-6' : ''
                  }`}
                />
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm">Cloud Regions</span>
              <div
                onClick={toggleRegions}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showRegions ? 'bg-blue-600' : darkMode ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    showRegions ? 'transform translate-x-6' : ''
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Latency Range Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Latency Range (ms)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              className={`flex-1 px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <input
              type="number"
              placeholder="Max"
              className={`flex-1 px-3 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Legend */}
        <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <label className="block text-sm font-medium mb-3">Latency Legend</label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Low (&lt; 50ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm">Medium (50-100ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm">High (100-150ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">Critical (&gt; 150ms)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}