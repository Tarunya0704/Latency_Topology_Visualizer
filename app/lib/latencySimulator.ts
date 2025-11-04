import { LatencyData, Exchange } from '../types';

export function calculateLatency(from: Exchange, to: Exchange): number {
  // Calculate great circle distance
  const R = 6371; // Earth's radius in km
  const dLat = ((to.lat - from.lat) * Math.PI) / 180;
  const dLon = ((to.lon - from.lon) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from.lat * Math.PI) / 180) *
    Math.cos((to.lat * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  // Base latency: ~1ms per 100km + random jitter
  const baseLatency = (distance / 100) * 1;
  const jitter = Math.random() * 20 - 10;
  const providerPenalty = from.provider !== to.provider ? 15 : 0;
  
  return Math.max(5, Math.round(baseLatency + jitter + providerPenalty));
}

export function getLatencyColor(latency: number): string {
  if (latency < 50) return '#22c55e'; // green
  if (latency < 100) return '#eab308'; // yellow
  if (latency < 150) return '#f97316'; // orange
  return '#ef4444'; // red
}

export function generateLatencyData(exchanges: Exchange[]): LatencyData[] {
  const data: LatencyData[] = [];
  
  for (let i = 0; i < exchanges.length; i++) {
    for (let j = i + 1; j < exchanges.length; j++) {
      const latency = calculateLatency(exchanges[i], exchanges[j]);
      data.push({
        from: exchanges[i].id,
        to: exchanges[j].id,
        latency,
        timestamp: Date.now(),
        color: getLatencyColor(latency)
      });
    }
  }
  
  return data;
}