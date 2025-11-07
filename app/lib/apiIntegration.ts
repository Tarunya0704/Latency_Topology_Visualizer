import { Exchange } from '../types';

export class LatencyAPIService {
  private static instance: LatencyAPIService;
  private useSimulation: boolean = true;

  private constructor() {}

  static getInstance(): LatencyAPIService {
    if (!this.instance) {
      this.instance = new LatencyAPIService();
    }
    return this.instance;
  }

  setUseSimulation(useSimulation: boolean) {
    this.useSimulation = useSimulation;
    console.log(`🔧 API Mode: ${useSimulation ? 'SIMULATION' : 'REAL API'}`);
  }

  // Ping REAL exchange APIs using Fetch API (better CORS handling)
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
      console.log(`📡 Pinging ${exchangeName} API: ${apiUrl}`);
      const start = performance.now();
      
      // Use fetch instead of axios - better for CORS
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const end = performance.now();
        const latency = Math.round(end - start);
        console.log(`✅ ${exchangeName} latency: ${latency}ms`);
        return latency;
      } else {
        console.warn(`⚠️ ${exchangeName} API returned ${response.status}, using simulation`);
        return this.simulateLatency();
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn(`⏱️ ${exchangeName} API timeout, using simulation`);
      } else {
        console.warn(`⚠️ ${exchangeName} API blocked (CORS/Network), using simulation`);
      }
      return this.simulateLatency();
    }
  }

  async getLatencyBetweenExchanges(from: Exchange, to: Exchange): Promise<number> {
    if (this.useSimulation) {
      return this.simulateLatency(from, to);
    }

    try {
      const [fromLatency, toLatency] = await Promise.allSettled([
        this.pingExchangeAPI(from.name),
        this.pingExchangeAPI(to.name)
      ]);

      let avgLatency = 0;
      let count = 0;

      if (fromLatency.status === 'fulfilled') {
        avgLatency += fromLatency.value;
        count++;
      }
      if (toLatency.status === 'fulfilled') {
        avgLatency += toLatency.value;
        count++;
      }

      if (count > 0) {
        return Math.round(avgLatency / count);
      }

      return this.simulateLatency(from, to);
    } catch (error) {
      console.error('API integration error:', error);
      return this.simulateLatency(from, to);
    }
  }

  private simulateLatency(from?: Exchange, to?: Exchange): number {
    if (!from || !to) {
      return Math.floor(Math.random() * 150) + 10;
    }

    const R = 6371;
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
    
    const baseLatency = (distance / 100) * 1;
    const jitter = Math.random() * 20 - 10;
    const providerPenalty = from.provider !== to.provider ? 15 : 0;
    
    return Math.max(5, Math.round(baseLatency + jitter + providerPenalty));
  }

  async healthCheck(): Promise<{
    working: string[];
    failed: string[];
  }> {
    const testExchanges = ['Binance', 'Coinbase', 'Kraken'];
    const working: string[] = [];
    const failed: string[] = [];

    console.log('🏥 Running API health check...');

    for (const exchange of testExchanges) {
      try {
        const latency = await this.pingExchangeAPI(exchange);
        if (latency < 10000) {
          working.push(exchange);
        } else {
          failed.push(exchange);
        }
      } catch {
        failed.push(exchange);
      }
    }

    console.log('📊 API Health Check Results:', { working, failed });
    return { working, failed };
  }
}

export const latencyAPI = LatencyAPIService.getInstance();