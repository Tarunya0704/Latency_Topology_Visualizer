import { CloudRegion } from '../types';

export const CLOUD_REGIONS: CloudRegion[] = [
  // AWS Regions
  {
    id: 'aws-us-east-1',
    provider: 'AWS',
    region: 'us-east-1',
    lat: 38.9072,
    lon: -77.0369,
    name: 'N. Virginia',
    serverCount: 15
  },
  {
    id: 'aws-us-west-1',
    provider: 'AWS',
    region: 'us-west-1',
    lat: 37.3382,
    lon: -121.8863,
    name: 'N. California',
    serverCount: 12
  },
  {
    id: 'aws-eu-west-1',
    provider: 'AWS',
    region: 'eu-west-1',
    lat: 53.3498,
    lon: -6.2603,
    name: 'Ireland',
    serverCount: 18
  },
  {
    id: 'aws-ap-southeast-1',
    provider: 'AWS',
    region: 'ap-southeast-1',
    lat: 1.3521,
    lon: 103.8198,
    name: 'Singapore',
    serverCount: 20
  },
  {
    id: 'aws-ap-northeast-1',
    provider: 'AWS',
    region: 'ap-northeast-1',
    lat: 35.6762,
    lon: 139.6503,
    name: 'Tokyo',
    serverCount: 16
  },
  
  // GCP Regions
  {
    id: 'gcp-us-central1',
    provider: 'GCP',
    region: 'us-central1',
    lat: 41.2619,
    lon: -95.8608,
    name: 'Iowa',
    serverCount: 14
  },
  {
    id: 'gcp-europe-west4',
    provider: 'GCP',
    region: 'europe-west4',
    lat: 52.3676,
    lon: 4.9041,
    name: 'Netherlands',
    serverCount: 17
  },
  {
    id: 'gcp-asia-southeast1',
    provider: 'GCP',
    region: 'asia-southeast1',
    lat: 1.3521,
    lon: 103.8198,
    name: 'Singapore',
    serverCount: 15
  },
  
  // Azure Regions
  {
    id: 'azure-eastus',
    provider: 'Azure',
    region: 'eastus',
    lat: 37.3719,
    lon: -79.8164,
    name: 'Virginia',
    serverCount: 13
  },
  {
    id: 'azure-westus2',
    provider: 'Azure',
    region: 'westus2',
    lat: 47.6062,
    lon: -122.3321,
    name: 'Washington',
    serverCount: 11
  },
  {
    id: 'azure-westeurope',
    provider: 'Azure',
    region: 'westeurope',
    lat: 52.3667,
    lon: 4.8945,
    name: 'Netherlands',
    serverCount: 14
  },
  {
    id: 'azure-eastasia',
    provider: 'Azure',
    region: 'eastasia',
    lat: 22.3193,
    lon: 114.1694,
    name: 'Hong Kong',
    serverCount: 12
  }
];