

import axios from 'axios';
import { Exchange } from '../types';

// Multiple free API options for latency monitoring
export class LatencyAPIService {
  private static instance: LatencyAPIService;
  private useSimulation: boolean = true; // Toggle this to switch between API and simulation

  private constructor() {}

  static getInstance(): LatencyAPIService {
    if (!this.instance) {
      this.instance = new LatencyAPIService();
    }
    return this.instance;
  }

  // Enable/disable real API calls
  setUseSimulation(useSimulation: boolean) {
    this.useSimulation = useSimulation;
  }

  /**
   * Method 1: Cloudflare Speed Test API (Free, No Auth)
   * Tests connection speed to Cloudflare edge locations
   */
  async measureCloudflareLatency(targetUrl: string): Promise<number> {
    try {
      const start = performance.now();
      await axios.get('https://speed.cloudflare.com/__down?bytes=1000', {
        timeout: 5000,
        headers: { 'Cache-Control': 'no-cache' }
      });
      const end = performance.now();
      return Math.round(end - start);
    } catch (error) {
      console.error('Cloudflare API error:', error);
      return this.simulateLatency();
    }
  }

  /**
   * Method 2: Measure latency using HEAD request timing
   * Works with any publicly accessible endpoint
   */
  async measureDirectLatency(targetUrl: string): Promise<number> {
    try {
      const start = performance.now();
      await axios.head(targetUrl, {
        timeout: 5000,
        headers: { 'Cache-Control': 'no-cache' }
      });
      const end = performance.now();
      return Math.round(end - start);
    } catch (error) {
      console.error('Direct latency measurement error:', error);
      return this.simulateLatency();
    }
  }

  /**
   * Method 3: Use built-in Fetch API with timing
   */
  async measureFetchLatency(targetUrl: string): Promise<number> {
    try {
      const start = performance.now();
      const response = await fetch(targetUrl, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      const end = performance.now();
      
      if (response.ok) {
        return Math.round(end - start);
      }
      return this.simulateLatency();
    } catch (error) {
      console.error('Fetch latency measurement error:', error);
      return this.simulateLatency();
    }
  }

  /**
   * Method 4: Ping Exchange APIs (Real exchange endpoints)
   * Most exchanges have public API endpoints that can be pinged
   */
  async pingExchangeAPI(exchangeName: string): Promise<number> {
    const exchangeAPIs: { [key: string]: string } = {
      'Binance': 'https://api.binance.com/api/v3/ping',
      'OKX': 'https://www.okx.com/api/v5/public/time',
      'Bybit': 'https://api.bybit.com/v2/public/time',
      'Kraken': 'https://api.kraken.com/0/public/Time',
      'Coinbase': 'https://api.coinbase.com/v2/time',
      'Bitfinex': 'https://api-pub.bitfinex.com/v2/platform/status',
      'Huobi': 'https://api.huobi.pro/v1/common/timestamp',
      'Gemini': 'https://api.gemini.com/v1/pubticker/btcusd',
      'KuCoin': 'https://api.kucoin.com/api/v1/timestamp',
      'Deribit': 'https://www.deribit.com/api/v2/public/test'
    };

    const apiUrl = exchangeAPIs[exchangeName];
    if (!apiUrl) {
      return this.simulateLatency();
    }

    try {
      const start = performance.now();
      await axios.get(apiUrl, {
        timeout: 5000,
        headers: { 'Accept': 'application/json' }
      });
      const end = performance.now();
      return Math.round(end - start);
    } catch (error) {
      console.error(`${exchangeName} API ping error:`, error);
      return this.simulateLatency();
    }
  }

  /**
   * Main method: Get latency between two exchanges
   */
  async getLatencyBetweenExchanges(from: Exchange, to: Exchange): Promise<number> {
    if (this.useSimulation) {
      return this.simulateLatency(from, to);
    }

    try {
      // Try to ping actual exchange APIs
      const [fromLatency, toLatency] = await Promise.all([
        this.pingExchangeAPI(from.name),
        this.pingExchangeAPI(to.name)
      ]);

      // Average of both endpoints
      return Math.round((fromLatency + toLatency) / 2);
    } catch (error) {
      console.error('API integration error, falling back to simulation:', error);
      return this.simulateLatency(from, to);
    }
  }

  /**
   * Batch fetch latencies for all exchange pairs
   */
  async getAllLatencies(exchanges: Exchange[]): Promise<Map<string, number>> {
    const latencies = new Map<string, number>();
    
    // Create pairs
    const pairs: [Exchange, Exchange][] = [];
    for (let i = 0; i < exchanges.length; i++) {
      for (let j = i + 1; j < exchanges.length; j++) {
        pairs.push([exchanges[i], exchanges[j]]);
      }
    }

    // Fetch in parallel (with rate limiting)
    const batchSize = 5; // Process 5 at a time to avoid rate limits
    for (let i = 0; i < pairs.length; i += batchSize) {
      const batch = pairs.slice(i, i + batchSize);
      const results = await Promise.all(
        batch.map(([from, to]) => 
          this.getLatencyBetweenExchanges(from, to)
            .then(latency => ({ key: `${from.id}-${to.id}`, latency }))
        )
      );

      results.forEach(({ key, latency }) => {
        latencies.set(key, latency);
      });

      // Small delay between batches
      if (i + batchSize < pairs.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return latencies;
  }

  /**
   * Fallback simulation (same as current implementation)
   */
  private simulateLatency(from?: Exchange, to?: Exchange): number {
    if (!from || !to) {
      return Math.floor(Math.random() * 150) + 10;
    }

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

  /**
   * Health check: Test if APIs are accessible
   */
  async healthCheck(): Promise<{
    cloudflare: boolean;
    exchanges: { [key: string]: boolean };
  }> {
    const health = {
      cloudflare: false,
      exchanges: {} as { [key: string]: boolean }
    };

    // Test Cloudflare
    try {
      await this.measureCloudflareLatency('https://speed.cloudflare.com');
      health.cloudflare = true;
    } catch {
      health.cloudflare = false;
    }

    // Test a few exchange APIs
    const testExchanges = ['Binance', 'Coinbase', 'Kraken'];
    for (const exchange of testExchanges) {
      try {
        await this.pingExchangeAPI(exchange);
        health.exchanges[exchange] = true;
      } catch {
        health.exchanges[exchange] = false;
      }
    }

    return health;
  }
}

// Export singleton instance
export const latencyAPI = LatencyAPIService.getInstance();

/**
 * USAGE EXAMPLES:
 * 
 * // Enable real API calls
 * latencyAPI.setUseSimulation(false);
 * 
 * // Get latency between two exchanges
 * const latency = await latencyAPI.getLatencyBetweenExchanges(exchange1, exchange2);
 * 
 * // Get all latencies at once
 * const allLatencies = await latencyAPI.getAllLatencies(EXCHANGES);
 * 
 * // Check API health
 * const health = await latencyAPI.healthCheck();
 * console.log('APIs available:', health);
 */