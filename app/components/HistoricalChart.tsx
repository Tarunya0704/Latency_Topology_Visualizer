'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { TrendingUp, Download, Activity, Clock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useHistoricalData } from '../hooks/useHistoricalData';
import { format } from 'date-fns';
import { Exchange, LatencyData } from '../types';
import { useMemo } from 'react';

interface HistoricalChartProps {
  exchanges: Exchange[];
  latencyData: LatencyData[];
}

export default function HistoricalChart({ exchanges, latencyData }: HistoricalChartProps) {
  const { darkMode, timeRange, selectedExchange } = useStore();
  const historicalData = useHistoricalData(timeRange);

  // Format data for chart display
  const formattedData = useMemo(() => {
    return historicalData.map((point) => ({
      time: format(new Date(point.timestamp), timeRange === '1h' ? 'HH:mm' : 'MMM dd HH:mm'),
      latency: point.latency,
      min: point.min,
      max: point.max,
      avg: point.avg,
    }));
  }, [historicalData, timeRange]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (formattedData.length === 0) {
      return { current: 0, average: 0, minimum: 999, maximum: 0, trend: 0 };
    }

    const latencies = formattedData.map(d => d.latency);
    const current = latencies[latencies.length - 1];
    const average = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
    const minimum = Math.min(...latencies);
    const maximum = Math.max(...latencies);
    
    // Calculate trend (last 5 data points vs previous 5)
    const recentAvg = latencies.slice(-5).reduce((a, b) => a + b, 0) / 5;
    const previousAvg = latencies.slice(-10, -5).reduce((a, b) => a + b, 0) / 5;
    const trend = recentAvg - previousAvg;

    return { current, average, minimum, maximum, trend };
  }, [formattedData]);

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
    a.download = `latency-data-${selectedExchange?.name || 'all'}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} border-2 rounded-lg p-3 shadow-xl`}>
        <p className="font-bold text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-medium">{entry.name}:</span>
            <span className="font-bold">{entry.value}ms</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-lg p-6 shadow-xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Historical Latency Trends
            {selectedExchange && (
              <span className="text-sm font-normal text-gray-400 ml-2">
                ({selectedExchange.name})
              </span>
            )}
          </h2>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Real-time latency monitoring across exchange network
          </p>
        </div>
        <button
          onClick={handleExport}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            darkMode 
              ? 'bg-gray-800 hover:bg-gray-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
          } border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export CSV</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'} border-2`}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-400 uppercase font-semibold">Current</span>
          </div>
          <p className="text-3xl font-bold text-blue-500">{statistics.current}<span className="text-sm">ms</span></p>
          <div className={`text-xs mt-1 flex items-center gap-1 ${
            statistics.trend < 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {statistics.trend < 0 ? '↓' : '↑'} {Math.abs(Math.round(statistics.trend))}ms
          </div>
        </div>

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-purple-50 border-purple-200'} border-2`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <span className="text-xs text-gray-400 uppercase font-semibold">Average</span>
          </div>
          <p className="text-3xl font-bold text-purple-500">{statistics.average}<span className="text-sm">ms</span></p>
          <div className="text-xs text-gray-400 mt-1">Over {timeRange}</div>
        </div>

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-green-50 border-green-200'} border-2`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <span className="text-xs text-gray-400 uppercase font-semibold">Minimum</span>
          </div>
          <p className="text-3xl font-bold text-green-500">{statistics.minimum}<span className="text-sm">ms</span></p>
          <div className="text-xs text-gray-400 mt-1">Best performance</div>
        </div>

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-red-50 border-red-200'} border-2`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-red-500 rounded-full" />
            <span className="text-xs text-gray-400 uppercase font-semibold">Maximum</span>
          </div>
          <p className="text-3xl font-bold text-red-500">{statistics.maximum}<span className="text-sm">ms</span></p>
          <div className="text-xs text-gray-400 mt-1">Peak latency</div>
        </div>

        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50 border-orange-200'} border-2`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-gray-400 uppercase font-semibold">Range</span>
          </div>
          <p className="text-3xl font-bold text-orange-500">{statistics.maximum - statistics.minimum}<span className="text-sm">ms</span></p>
          <div className="text-xs text-gray-400 mt-1">Variance</div>
        </div>
      </div>

      {/* Main Chart */}
      <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="minGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="maxGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={darkMode ? '#374151' : '#e5e7eb'} 
              opacity={0.5}
            />
            
            <XAxis
              dataKey="time"
              stroke={darkMode ? '#9ca3af' : '#6b7280'}
              tick={{ fontSize: 11 }}
              tickMargin={10}
            />
            
            <YAxis
              stroke={darkMode ? '#9ca3af' : '#6b7280'}
              tick={{ fontSize: 11 }}
              tickMargin={10}
              label={{ 
                value: 'Latency (ms)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: darkMode ? '#9ca3af' : '#6b7280' }
              }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />

            {/* Reference lines for latency thresholds */}
            <ReferenceLine y={50} stroke="#22c55e" strokeDasharray="3 3" label="Good" />
            <ReferenceLine y={100} stroke="#eab308" strokeDasharray="3 3" label="Medium" />
            <ReferenceLine y={150} stroke="#ef4444" strokeDasharray="3 3" label="Poor" />
            
            {/* Max latency area */}
            <Area
              type="monotone"
              dataKey="max"
              stroke="#ef4444"
              fill="url(#maxGradient)"
              strokeWidth={1.5}
              name="Max Latency"
              dot={false}
            />
            
            {/* Current latency - main line */}
            <Area
              type="monotone"
              dataKey="latency"
              stroke="#3b82f6"
              fill="url(#latencyGradient)"
              strokeWidth={3}
              name="Current Latency"
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 6 }}
            />
            
            {/* Min latency area */}
            <Area
              type="monotone"
              dataKey="min"
              stroke="#22c55e"
              fill="url(#minGradient)"
              strokeWidth={1.5}
              name="Min Latency"
              dot={false}
            />
            
            {/* Average line */}
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#a855f7"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Average"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Data Quality Indicator */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className={`flex items-center gap-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Live data • Updated every 5 seconds</span>
        </div>
        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {formattedData.length} data points displayed
        </div>
      </div>
    </div>
  );
}