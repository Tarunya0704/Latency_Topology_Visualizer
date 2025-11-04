import { useState, useEffect } from 'react';
import { LatencyData, Exchange } from '../types';
import { generateLatencyData } from '../lib/latencySimulator';

export function useLatencyData(exchanges: Exchange[], updateInterval = 5000) {
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateData = () => {
      try {
        const data = generateLatencyData(exchanges);
        setLatencyData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error generating latency data:', error);
      }
    };

    updateData();
    const interval = setInterval(updateData, updateInterval);

    return () => clearInterval(interval);
  }, [exchanges, updateInterval]);

  return { latencyData, isLoading };
}