import { Exchange } from '../types';

export const EXCHANGES: Exchange[] = [
  {
    id: 'binance-sg',
    name: 'Binance',
    lat: 1.3521,
    lon: 103.8198,
    location: 'Singapore',
    provider: 'AWS',
    region: 'ap-southeast-1',
    color: '#F3BA2F'
  },
  {
    id: 'okx-sg',
    name: 'OKX',
    lat: 1.3521,
    lon: 103.8198,
    location: 'Singapore',
    provider: 'AWS',
    region: 'ap-southeast-1',
    color: '#000000'
  },
  {
    id: 'deribit-nl',
    name: 'Deribit',
    lat: 52.3676,
    lon: 4.9041,
    location: 'Amsterdam',
    provider: 'GCP',
    region: 'europe-west4',
    color: '#00A4E4'
  },
  {
    id: 'bybit-jp',
    name: 'Bybit',
    lat: 35.6762,
    lon: 139.6503,
    location: 'Tokyo',
    provider: 'AWS',
    region: 'ap-northeast-1',
    color: '#F7A600'
  },
  {
    id: 'kraken-us',
    name: 'Kraken',
    lat: 37.7749,
    lon: -122.4194,
    location: 'San Francisco',
    provider: 'Azure',
    region: 'westus2',
    color: '#5741D9'
  },
  {
    id: 'coinbase-us',
    name: 'Coinbase',
    lat: 37.7749,
    lon: -122.4194,
    location: 'San Francisco',
    provider: 'AWS',
    region: 'us-west-1',
    color: '#0052FF'
  },
  {
    id: 'bitfinex-uk',
    name: 'Bitfinex',
    lat: 51.5074,
    lon: -0.1278,
    location: 'London',
    provider: 'GCP',
    region: 'europe-west2',
    color: '#16B157'
  },
  {
    id: 'huobi-hk',
    name: 'Huobi',
    lat: 22.3193,
    lon: 114.1694,
    location: 'Hong Kong',
    provider: 'Azure',
    region: 'eastasia',
    color: '#2EACD1'
  },
  {
    id: 'gemini-us',
    name: 'Gemini',
    lat: 40.7128,
    lon: -74.0060,
    location: 'New York',
    provider: 'AWS',
    region: 'us-east-1',
    color: '#00DCFA'
  },
  {
    id: 'kucoin-sc',
    name: 'KuCoin',
    lat: -4.6796,
    lon: 55.4920,
    location: 'Seychelles',
    provider: 'GCP',
    region: 'asia-southeast1',
    color: '#24AE8F'
  }
];

export const PROVIDER_COLORS = {
  AWS: '#FF9900',
  GCP: '#4285F4',
  Azure: '#0078D4'
};