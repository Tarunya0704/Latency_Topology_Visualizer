export interface Exchange {
  id: string;
  name: string;
  lat: number;
  lon: number;
  location: string;
  provider: CloudProvider;
  region: string;
  color: string;
}

export type CloudProvider = 'AWS' | 'GCP' | 'Azure';

export interface CloudRegion {
  id: string;
  provider: CloudProvider;
  region: string;
  lat: number;
  lon: number;
  name: string;
  serverCount: number;
}

export interface LatencyData {
  from: string;
  to: string;
  latency: number;
  timestamp: number;
  color: string;
}

export interface HistoricalDataPoint {
  timestamp: number;
  latency: number;
  min: number;
  max: number;
  avg: number;
}

export interface AppState {
  selectedExchange: Exchange | null;
  selectedCloudProvider: CloudProvider | 'all';
  searchTerm: string;
  showRealtime: boolean;
  showHistorical: boolean;
  showRegions: boolean;
  darkMode: boolean;
  timeRange: '1h' | '24h' | '7d' | '30d';
  latencyRange: [number, number];
}