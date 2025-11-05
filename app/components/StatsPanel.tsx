'use client';

import { Activity, TrendingUp, TrendingDown, Zap, Server, Wifi } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Exchange, LatencyData } from '../types';
import { PROVIDER_COLORS } from '../lib/exchanges';
import { useMemo } from 'react';

interface StatsPanelProps {
  exchanges: Exchange[];
  latencyData: LatencyData[];
}

export default function StatsPanel({ exchanges, latencyData }: StatsPanelProps) {
  const { selectedExchange, setSelectedExchange, darkMode, searchTerm, selectedCloudProvider } = useStore();

  const filteredExchanges = useMemo(() => {
    return exchanges.filter((ex) => {
      if (selectedCloudProvider !== 'all' && ex.provider !== selectedCloudProvider) return false;
      if (searchTerm && !ex.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
  }, [exchanges, selectedCloudProvider, searchTerm]);

  const stats = useMemo(() => {
    if (!selectedExchange) return { avgLatency: 0, minLatency: 0, maxLatency: 0, connectionCount: 0 };

    const relevantData = latencyData.filter(
      (d) => d.from === selectedExchange.id || d.to === selectedExchange.id
    );

    if (relevantData.length === 0) return { avgLatency: 0, minLatency: 0, maxLatency: 0, connectionCount: 0 };

    const latencies = relevantData.map((d) => d.latency);
    return {
      avgLatency: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
      minLatency: Math.min(...latencies),
      maxLatency: Math.max(...latencies),
      connectionCount: relevantData.length
    };
  }, [selectedExchange, latencyData]);

  const networkStats = useMemo(() => {
    if (latencyData.length === 0) return { avgLatency: 0, totalConnections: 0, healthScore: 0 };
    const allLatencies = latencyData.map(d => d.latency);
    const avg = allLatencies.reduce((a, b) => a + b, 0) / allLatencies.length;
    const healthScore = Math.max(0, 100 - (avg / 2));
    return { avgLatency: Math.round(avg), totalConnections: latencyData.length, healthScore: Math.round(healthScore) };
  }, [latencyData]);

  const getHealthColor = (score: number) => score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  const getHealthBg = (score: number) => score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="space-y-4">
      {/* Exchange Details */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Server className="w-5 h-5 text-blue-500" />
          Exchange Details
        </h3>
        {selectedExchange ? (
          <div className="space-y-4">
            <div>
              <span className="text-xs text-gray-400 uppercase">Name</span>
              <p className="text-2xl font-bold mt-1">{selectedExchange.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 uppercase">Location</span>
                <p className="font-medium mt-1">{selectedExchange.location}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase">Region</span>
                <p className="font-mono text-sm mt-1">{selectedExchange.region}</p>
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-400 uppercase">Provider</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PROVIDER_COLORS[selectedExchange.provider] }} />
                <p className="font-bold text-lg" style={{ color: PROVIDER_COLORS[selectedExchange.provider] }}>
                  {selectedExchange.provider}
                </p>
              </div>
            </div>
            <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <div className="grid grid-cols-3 gap-4">
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <Activity className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-gray-400">AVG</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-500">{stats.avgLatency}<span className="text-xs">ms</span></p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingDown className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-gray-400">MIN</span>
                  </div>
                  <p className="text-2xl font-bold text-green-500">{stats.minLatency}<span className="text-xs">ms</span></p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-gray-400">MAX</span>
                  </div>
                  <p className="text-2xl font-bold text-red-500">{stats.maxLatency}<span className="text-xs">ms</span></p>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-xs text-gray-400">{stats.connectionCount} Connections</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Server className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Click on an exchange marker</p>
          </div>
        )}
      </div>

      {/* Exchange List */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-blue-500" />
            Exchanges
          </span>
          <span className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {filteredExchanges.length} / {exchanges.length}
          </span>
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredExchanges.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExchange(ex)}
              className={`w-full text-left p-3 rounded-lg transition-all border ${
                selectedExchange?.id === ex.id
                  ? 'bg-blue-600 text-white border-blue-400'
                  : darkMode
                  ? 'bg-gray-800 hover:bg-gray-700 border-gray-700'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold">{ex.name}</span>
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: PROVIDER_COLORS[ex.provider] }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={selectedExchange?.id === ex.id ? 'text-blue-100' : 'text-gray-400'}>
                  📍 {ex.location}
                </span>
                <span className={`font-mono px-2 py-0.5 rounded ${
                  selectedExchange?.id === ex.id ? 'bg-blue-700' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {ex.provider}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Network Status */}
      <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Network Status
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Total Connections</span>
              <span className="font-bold">{networkStats.totalConnections}</span>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2.5`}>
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (networkStats.totalConnections / 45) * 100)}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">System Health</span>
              <span className={`font-bold ${getHealthColor(networkStats.healthScore)}`}>{networkStats.healthScore}%</span>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2.5`}>
              <div className={`${getHealthBg(networkStats.healthScore)} h-2.5 rounded-full`} style={{ width: `${networkStats.healthScore}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Avg Latency</span>
              <span className="font-bold">{networkStats.avgLatency}ms</span>
            </div>
            <div className={`w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full h-2.5`}>
              <div className={`h-2.5 rounded-full ${networkStats.avgLatency < 50 ? 'bg-green-500' : networkStats.avgLatency < 100 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                style={{ width: `${Math.min(100, (networkStats.avgLatency / 150) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}