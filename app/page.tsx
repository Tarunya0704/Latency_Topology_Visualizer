'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Globe, Activity } from 'lucide-react';
import { useStore } from './store/useStore';
import { EXCHANGES } from './lib/exchanges';
import { CLOUD_REGIONS } from './lib/cloudRegions';
import { useLatencyData } from './hooks/useLatencyData';
import ControlPanel from './components/ControlPanel';
import StatsPanel from './components/StatsPanel';
import HistoricalChart from './components/HistoricalChart';

// Dynamically import Globe3D to avoid SSR issues with Three.js
const Globe3D = dynamic(() => import('./components/Globe3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-black rounded-lg">
      <div className="text-center">
        <Activity className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading 3D Globe...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const { darkMode, showHistorical } = useStore();
  const { latencyData, isLoading } = useLatencyData(EXCHANGES);

  return (
    <main className={`min-h-screen ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 backdrop-blur-sm bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Latency Topology Visualizer
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time cryptocurrency exchange network monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">Live</span>
              </div>
              <div className={`px-3 py-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <span className="text-sm font-mono">{EXCHANGES.length} Exchanges</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Control Panel - Left Sidebar */}
          <div className="col-span-12 lg:col-span-3">
            <ControlPanel />
          </div>

          {/* 3D Globe - Center */}
          <div className="col-span-12 lg:col-span-6">
            <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'} overflow-hidden`}>
              <div className="p-4 border-b border-gray-800">
                <h2 className="font-bold flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  3D Network Topology
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Rotate, zoom, and click to interact
                </p>
              </div>
              <div className="h-[600px]">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-black">
                    <Activity className="w-12 h-12 text-blue-500 animate-spin" />
                  </div>
                ) : (
                  <Globe3D
                    exchanges={EXCHANGES}
                    latencyData={latencyData}
                    cloudRegions={CLOUD_REGIONS}
                  />
                )}
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
          <div className="mt-6">
            <HistoricalChart />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-t mt-12`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2024 Latency Topology Visualizer. Built with Next.js & Three.js
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Data updates every 5 seconds
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}