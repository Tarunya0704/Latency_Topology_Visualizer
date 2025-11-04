import { useState, useEffect } from 'react';
import { HistoricalDataPoint } from '../types';

export function useHistoricalData(timeRange: string) {
  const [data, setData] = useState<HistoricalDataPoint[]>([]);

  useEffect(() => {
    const generateData = () => {
      const points = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
      const interval = timeRange === '1h' ? 300000 : 3600000; // 5 min or 1 hour
      
      const now = Date.now();
      const newData: HistoricalDataPoint[] = [];

      for (let i = points; i >= 0; i--) {
        const timestamp = now - (i * interval);
        const baseLatency = 50 + Math.random() * 50;
        const variation = Math.random() * 30;
        
        newData.push({
          timestamp,
          latency: Math.round(baseLatency + variation),
          min: Math.round(baseLatency - 10),
          max: Math.round(baseLatency + variation + 20),
          avg: Math.round(baseLatency)
        });
      }

      setData(newData);
    };

    generateData();
    const interval = setInterval(generateData, 10000);

    return () => clearInterval(interval);
  }, [timeRange]);

  return data;
}