import { useState, useEffect } from 'react';
import { LatencyData, Exchange } from '../types';
import { latencyAPI } from '../lib/apiIntegration';
import { getLatencyColor } from '../lib/latencySimulator';

export function useLatencyData(exchanges: Exchange[], updateInterval = 5000) {
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useRealAPI, setUseRealAPI] = useState(false); // Toggle this to enable real API

  useEffect(() => {
    const updateData = async () => {
      try {
        setIsLoading(true);

        // Configure API service
        latencyAPI.setUseSimulation(!useRealAPI);

        const data: LatencyData[] = [];
        const timestamp = Date.now();

        // Generate all exchange pairs
        for (let i = 0; i < exchanges.length; i++) {
          for (let j = i + 1; j < exchanges.length; j++) {
            const from = exchanges[i];
            const to = exchanges[j];

            // Get latency using API service (with simulation fallback)
            const latency = await latencyAPI.getLatencyBetweenExchanges(from, to);

            data.push({
              from: from.id,
              to: to.id,
              latency,
              timestamp,
              color: getLatencyColor(latency)
            });

            // Also add reverse direction
            data.push({
              from: to.id,
              to: from.id,
              latency,
              timestamp,
              color: getLatencyColor(latency)
            });
          }
        }

        setLatencyData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching latency data:', error);
        setIsLoading(false);
      }
    };

    updateData();
    const interval = setInterval(updateData, updateInterval);

    return () => clearInterval(interval);
  }, [exchanges, updateInterval, useRealAPI]);

  // Function to toggle between real API and simulation
  const toggleAPIMode = () => {
    setUseRealAPI(prev => !prev);
  };

  return { 
    latencyData, 
    isLoading, 
    useRealAPI, 
    toggleAPIMode 
  };
}