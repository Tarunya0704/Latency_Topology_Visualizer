'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Globe, Activity, Loader2, Info } from 'lucide-react';
import { useStore } from './store/useStore';
import { EXCHANGES } from './lib/exchanges';
import { CLOUD_REGIONS } from './lib/cloudRegions';
import { useLatencyData } from './hooks/useLatencyData';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import HistoricalChart from './components/HistoricalChart';

const Globe3D = dynamic(() => import('./components/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black rounded-lg">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
      <p className="text-gray-300 text-lg font-medium">Loading 3D Globe...</p>
      <p className="text-gray-500 text-sm mt-2">Rendering exchange network topology</p>
    </div>
  ),
});

export default function Home() {
  const { darkMode, showHistorical, selectedExchange, searchTerm } = useStore();
  const { latencyData, isLoading } = useLatencyData(EXCHANGES);

  return (
    <main className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Enhanced Header */}
      <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 shadow-lg`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Globe className="w-10 h-10 text-blue-500 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Latency Topology Visualizer
                </h1>
                <p className={`text-sm mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time cryptocurrency exchange network monitoring across AWS, GCP & Azure
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-500">Live</span>
              </div>
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`}>
                <div className="text-xs text-gray-400 mb-0.5">Active Exchanges</div>
                <div className="text-lg font-bold">{EXCHANGES.length}</div>
              </div>
              <div className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`}>
                <div className="text-xs text-gray-400 mb-0.5">Total Connections</div>
                <div className="text-lg font-bold">{latencyData.length}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Info Banner */}
      {!selectedExchange && !searchTerm && (
        <div className={`${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border-b`}>
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-500" />
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                <strong>Quick Start:</strong> Click on any colored marker on the globe to view latency connections. 
                Use filters on the left to narrow down exchanges. Rotate and zoom the globe with your mouse or touch gestures.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Control Panel - Left Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <ControlPanel />
          </div>

          {/* 3D Globe - Center */}
          <div className="col-span-12 lg:col-span-6">
            <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-lg shadow-xl border overflow-hidden`}>
              {/* Globe Header */}
              <div className={`p-4 border-b ${darkMode ? 'border-gray-800 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-lg flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-500" />
                      3D Network Topology
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedExchange 
                        ? `Showing connections for ${selectedExchange.name}`
                        : 'Click any exchange marker to view connections'}
                    </p>
                  </div>
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Globe Container */}
              <div className="h-[650px] relative">
                {isLoading && !latencyData.length ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-3" />
                      <p className="text-white font-medium">Loading network data...</p>
                    </div>
                  </div>
                ) : (
                  <Globe3D
                    exchanges={EXCHANGES}
                    latencyData={latencyData}
                    cloudRegions={CLOUD_REGIONS}
                  />
                )}
              </div>

              {/* Globe Controls Info */}
              <div className={`p-3 border-t ${darkMode ? 'border-gray-800 bg-gray-800/30' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      🖱️ <strong>Rotate:</strong> Left-click + Drag
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      🔍 <strong>Zoom:</strong> Scroll Wheel
                    </span>
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      ✋ <strong>Pan:</strong> Right-click + Drag
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Activity className="w-3 h-3" />
                    <span>Updates every 5s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Panel - Right Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <StatsPanel exchanges={EXCHANGES} latencyData={latencyData} />
          </div>
        </div>

        {/* Historical Chart - Full Width */}
        {showHistorical && (
          <div className="mt-6 animate-in slide-in-from-bottom duration-300">
            <HistoricalChart exchanges={EXCHANGES} latencyData={latencyData} />
          </div>
        )}

        {/* Legend Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Latency Legend */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-lg p-4 border shadow`}>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded" />
              Latency Ranges
            </h3>
            <div className="space-y-2">
              {[
                { color: '#22c55e', range: '< 50ms', label: 'Excellent', desc: 'Optimal trading performance' },
                { color: '#eab308', range: '50-100ms', label: 'Good', desc: 'Acceptable for most operations' },
                { color: '#f97316', range: '100-150ms', label: 'Fair', desc: 'May impact high-frequency trading' },
                { color: '#ef4444', range: '> 150ms', label: 'Poor', desc: 'Consider optimization' }
              ].map((item) => (
                <div key={item.range} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs">{item.label}</span>
                      <span className="text-xs text-gray-400">{item.range}</span>
                    </div>
                    <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud Provider Legend */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-lg p-4 border shadow`}>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 rounded" />
              Cloud Providers
            </h3>
            <div className="space-y-2">
              {[
                { color: '#FF9900', name: 'AWS', fullName: 'Amazon Web Services', count: 5 },
                { color: '#4285F4', name: 'GCP', fullName: 'Google Cloud Platform', count: 3 },
                { color: '#00FF00', name: 'Azure', fullName: 'Microsoft Azure', count: 2 }
              ].map((provider) => (
                <div key={provider.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: provider.color }} />
                    <div>
                      <span className="font-semibold text-xs">{provider.name}</span>
                      <p className="text-[10px] text-gray-500">{provider.fullName}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    {provider.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Info */}
          <div className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} rounded-lg p-4 border shadow`}>
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <Activity className="w-3 h-3 text-blue-500" />
              System Information
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Data Source:</span>
                <span className="font-medium">Real-time Simulation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Update Frequency:</span>
                <span className="font-medium">5 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Exchanges:</span>
                <span className="font-medium">{EXCHANGES.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cloud Regions:</span>
                <span className="font-medium">{CLOUD_REGIONS.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Render Engine:</span>
                <span className="font-medium">Three.js WebGL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t mt-12`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="font-semibold">© 2024 Latency Topology Visualizer</p>
              <p className="text-xs mt-1">Built with Next.js 14, Three.js, TypeScript & Tailwind CSS</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  System Operational
                </span>
              </div>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Latency data refreshes automatically
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}