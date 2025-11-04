'use client';

import { Activity, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Exchange, LatencyData } from '../types';
import { PROVIDER_COLORS } from '../lib/exchanges';

interface StatsPanelProps {
  exchanges: Exchange[];
  latencyData: LatencyData[];
}

export default function StatsPanel({ exchanges, latencyData }: StatsPanelProps) {
  const { selectedExchange, setSelectedExchange, darkMode, searchTerm, selectedCloudProvider } = useStore();

  const filteredExchanges = exchanges.filter((ex) => {
    if (selectedCloudProvider !== 'all' && ex.provider !== selectedCloudProvider) {
      return false;
    }
    if (searchTerm && !ex.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const avgLatency = selectedExchange
    ? Math.round(
        latencyData
          .filter((d) => d.from === selectedExchange.id || d.to === selectedExchange.id)
          .reduce((sum, d) => sum + d.latency, 0) /
          latencyData.filter((d) => d.from === selectedExchange.id || d.to === selectedExchange.id).length || 0
      )
    : 0;

  const minLatency = selectedExchange
    ? Math.min(
        ...latencyData
          .filter((d) => d.from === selectedExchange.id || d.to === selectedExchange.id)
          .map((d) => d.latency)
      )
    : 0;

  const maxLatency = selectedExchange
    ? Math.max(
        ...latencyData
          .filter((d) => d.from === selectedExchange.id || d.to === selectedExchange.id)
          .map((d) => d.latency)
      )
    : 0;

  return (
    <div className="space-y-4">
      {/* Selected Exchange Info */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Exchange Details
        </h3>
        {selectedExchange ? (
          <div className="space-y-4">
            <div>
              <span className="text-sm text-gray-400">Name</span>
              <p className="text-xl font-bold">{selectedExchange.name}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Location</span>
              <p className="font-medium">{selectedExchange.location}</p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Cloud Provider</span>
              <p className="font-medium" style={{ color: PROVIDER_COLORS[selectedExchange.provider] }}>
                {selectedExchange.provider}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-400">Region</span>
              <p className="font-mono text-sm">{selectedExchange.region}</p>
            </div>
            
            <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">AVG</span>
                  <p className="text-2xl font-bold">{avgLatency}ms</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">MIN</span>
                  <p className="text-2xl font-bold text-green-500">{minLatency}ms</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">MAX</span>
                  <p className="text-2xl font-bold text-red-500">{maxLatency}ms</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Click on an exchange marker to view detailed information
          </p>
        )}
      </div>

      {/* Exchange List */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className="text-lg font-bold mb-4">
          Active Exchanges ({filteredExchanges.length})
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {filteredExchanges.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExchange(ex)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                selectedExchange?.id === ex.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold">{ex.name}</span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: PROVIDER_COLORS[ex.provider] }}
                />
              </div>
              <div className={`text-xs ${selectedExchange?.id === ex.id ? 'text-blue-100' : 'text-gray-400'}`}>
                {ex.location} • {ex.provider}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Network Statistics */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Network Status
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Active Connections</span>
              <span className="font-bold">{latencyData.length}</span>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2`}>
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '87%' }} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">System Health</span>
              <span className="font-bold text-green-500">Optimal</span>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2`}>
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Data Throughput</span>
              <span className="font-bold">1.2 GB/s</span>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2`}>
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '76%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}