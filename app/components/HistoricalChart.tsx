'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useHistoricalData } from '../hooks/useHistoricalData';
import { format } from 'date-fns';

export default function HistoricalChart() {
  const { darkMode, timeRange, selectedExchange } = useStore();
  const historicalData = useHistoricalData(timeRange);

  const formattedData = historicalData.map((point) => ({
    time: format(new Date(point.timestamp), timeRange === '1h' ? 'HH:mm' : 'MMM dd HH:mm'),
    latency: point.latency,
    min: point.min,
    max: point.max,
    avg: point.avg,
  }));

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Latency', 'Min', 'Max', 'Average'],
      ...historicalData.map((point) => [
        new Date(point.timestamp).toISOString(),
        point.latency,
        point.min,
        point.max,
        point.avg,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `latency-data-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Historical Latency Trends
          {selectedExchange && <span className="text-sm font-normal text-gray-400">({selectedExchange.name})</span>}
        </h2>
        <button
          onClick={handleExport}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="time"
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke={darkMode ? '#9ca3af' : '#6b7280'}
            tick={{ fontSize: 12 }}
            label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? '#1f2937' : '#ffffff',
              border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              padding: '12px',
            }}
            labelStyle={{ color: darkMode ? '#fff' : '#000', fontWeight: 'bold' }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="latency"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#latencyGradient)"
            strokeWidth={2}
            name="Current Latency"
          />
          <Line
            type="monotone"
            dataKey="min"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
            name="Min Latency"
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="max"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            name="Max Latency"
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {[
          { label: 'Average', value: `${Math.round(formattedData.reduce((sum, d) => sum + d.avg, 0) / formattedData.length)}ms`, color: 'text-blue-500' },
          { label: 'Current', value: `${formattedData[formattedData.length - 1]?.latency || 0}ms`, color: 'text-purple-500' },
          { label: 'Minimum', value: `${Math.min(...formattedData.map(d => d.min))}ms`, color: 'text-green-500' },
          { label: 'Maximum', value: `${Math.max(...formattedData.map(d => d.max))}ms`, color: 'text-red-500' },
        ].map((stat) => (
          <div key={stat.label} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}