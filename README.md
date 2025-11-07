# 🌐 Latency Topology Visualizer

A real-time 3D globe visualization platform for monitoring and analyzing latency between cryptocurrency exchanges across different cloud providers (AWS, GCP, Azure).

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Development](#-development)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🌐 Interactive 3D Globe

- **Real-time visualization** of cryptocurrency exchange locations
- **Smooth rotation** and interactive camera controls
- **Animated connections** showing latency between exchanges
- **Grid overlay** with latitude/longitude lines
- **Dynamic markers** with pulsing animations

### 📊 Real-time Latency Monitoring

- Live latency data between exchanges
- Color-coded latency indicators:
  - 🟢 Green: <50ms (Excellent)
  - 🟡 Yellow: 50-100ms (Good)
  - 🟠 Orange: 100-150ms (Fair)
  - 🔴 Red: >150ms (Poor)
- Animated data particles along connection paths
- Auto-refresh every 5 seconds

### ☁️ Cloud Provider Integration

- Support for AWS, GCP, and Azure regions
- Cloud region markers with provider-specific colors
- Filter exchanges by cloud provider
- Server count visualization per region
- Cross-provider latency penalty calculation

### 📈 Analytics & Monitoring

- Historical latency data tracking
- Time range selection (1h, 24h, 7d, 30d)
- Latency range filtering (min/max thresholds)
- Statistical analysis (min, max, avg)
- Real-time statistics dashboard

### 🎨 User Interface

- **Dark/Light mode** toggle
- **Search functionality** for exchanges
- **Responsive control panel**
- Real-time statistics dashboard
- Historical data charts
- Mobile-responsive design

### 🔄 Dual Mode Operation

- **Simulation Mode**: Geographic distance-based latency calculation (default)
- **Real API Mode**: Actual exchange API integration (with CORS awareness and fallback)

## 🛠 Tech Stack

### Frontend Framework

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety

### 3D Visualization

- **Three.js** - 3D graphics library (via React Three Fiber)
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F

### State Management

- **Zustand** - Lightweight state management

### Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library

### Data & APIs

- Custom latency simulation engine
- Exchange API integration support
- RESTful API endpoints

## 📦 Installation

### Prerequisites

- **Node.js 18+**
- **npm**, **yarn**, or **pnpm**
- Modern web browser with WebGL support

### Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd Latency_Topology_Visualizer

```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
latency-visualizer/
├── app/
│   ├── api/
│   │   └── latency/
│   │       └── route.ts              # Latency API endpoint
│   ├── components/
│   │   ├── CloudRegions.tsx          # Cloud region markers
│   │   ├── ControlPanel.tsx          # UI control panel
│   │   ├── ExchangeMarker.tsx        # Exchange location markers
│   │   ├── Globe3D.tsx               # Main 3D globe component
│   │   ├── HeatmapOverlay.tsx        # Latency heatmap
│   │   ├── HistoricalChart.tsx       # Historical data charts
│   │   ├── LatencyConnection.tsx     # Connection visualizations
│   │   └── StatsPanel.tsx            # Statistics dashboard
│   ├── hooks/
│   │   ├── useHistoricalData.ts      # Historical data hook
│   │   └── useLatencyData.ts         # Real-time latency hook
│   ├── lib/
│   │   ├── apiIntegration.ts         # API integration logic
│   │   ├── latencySimulator.ts       # Latency simulation
│   │   ├── cloudRegions.ts           # Cloud region definitions
│   │   └── exchanges.ts              # Exchange definitions
│   ├── store/
│   │   └── useStore.ts               # Zustand state store
│   ├── types/
│   │   └── index.ts                  # TypeScript definitions
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page
├── public/                           # Static assets
├── .gitignore
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies
├── tailwind.config.ts                # Tailwind configuration
└── tsconfig.json                     # TypeScript configuration
```

## 🚀 Usage

### Basic Operations

#### 1. Selecting an Exchange

- Click on any exchange marker (glowing sphere) on the globe
- View connections and latency to other exchanges
- Selected exchange will pulse with animated glow
- Connection lines show latency with color coding

#### 2. Filtering Data

- **Search**: Type exchange name in search box to filter exchanges
- **Cloud Provider**: Filter by AWS, GCP, Azure, or All
- **Time Range**: Select historical data period (1h, 24h, 7d, 30d)
- **Latency Range**: Set min/max latency thresholds using sliders

#### 3. Toggling Visualization Layers

- **Real-time Latency**: Show/hide live connections
- **Historical Data**: Enable/disable historical charts
- **Cloud Regions**: Display cloud provider regions

#### 4. API Mode Switching

- **Simulation Mode** (Default): Safe for demo, uses geographic calculations
- **Real API Mode**: Attempts actual exchange connections (may have CORS issues, falls back to simulation)

### Advanced Features

#### Globe Navigation

- **Rotate**: Click and drag on the globe
- **Zoom**: Scroll wheel or pinch gesture
- **Pan**: Right-click and drag (or Ctrl + drag)
- **Reset**: Double-click to reset camera position

#### Understanding Latency Colors

```typescript
Green (#22c55e)  : <50ms   - Excellent connection
Yellow (#eab308) : 50-100ms - Good connection
Orange (#f97316) : 100-150ms - Fair connection
Red (#ef4444)    : >150ms  - Poor connection
```

#### Provider Colors

```typescript
AWS (Orange)   : #FF9900
GCP (Blue)     : #4285F4
Azure (Green)  : #0078D4
```

## 🔌 API Documentation

### GET /api/latency

Fetches current latency data between all exchange pairs.

**Endpoint:** `/api/latency`

**Method:** `GET`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "from": "binance-sg",
      "to": "okx-sg",
      "latency": 45,
      "timestamp": 1699876543210
    }
  ],
  "timestamp": 1699876543210
}
```

### Latency Calculation Algorithm

**Simulation Mode:**

```typescript
// Based on geographic distance (Haversine formula)
distance_km = haversine(exchange1, exchange2)
base_latency = (distance_km / 100) * 1ms
jitter = random(-10ms, +10ms)
provider_penalty = different_providers ? 15ms : 0ms
total_latency = base_latency + jitter + provider_penalty
```

**Real API Mode:**

- Attempts actual ping to exchange endpoints
- Uses Fetch API with CORS handling
- 5-second timeout per request
- Falls back to simulation on CORS errors or timeouts
- Averages multiple measurements for accuracy

### Supported Exchange APIs

- **Binance**: `https://api.binance.com/api/v3/ping`
- **OKX**: `https://www.okx.com/api/v5/public/time`
- **Bybit**: `https://api.bybit.com/v2/public/time`
- **Kraken**: `https://api.kraken.com/0/public/Time`
- **Coinbase**: `https://api.coinbase.com/v2/time`
- **Bitfinex**: `https://api-pub.bitfinex.com/v2/platform/status`
- **Huobi**: `https://api.huobi.pro/v1/common/timestamp`
- **Gemini**: `https://api.gemini.com/v1/pubticker/btcusd`
- **KuCoin**: `https://api.kucoin.com/api/v1/timestamp`
- **Deribit**: `https://www.deribit.com/api/v2/public/test`

## ⚙️ Configuration

### Exchange Data

Add new exchanges in `app/lib/exchanges.ts`:

```typescript
{
  id: 'exchange-id',
  name: 'Exchange Name',
  lat: 1.3521,
  lon: 103.8198,
  location: 'Singapore',
  provider: 'AWS',
  region: 'ap-southeast-1',
  color: '#FF9900'
}
```

### Cloud Regions

Configure regions in `app/lib/cloudRegions.ts`:

```typescript
{
  id: 'aws-singapore',
  provider: 'AWS',
  region: 'ap-southeast-1',
  lat: 1.3521,
  lon: 103.8198,
  name: 'Singapore',
  serverCount: 42
}
```

### Update Intervals

Adjust in respective hooks:

```typescript
// app/hooks/useLatencyData.ts
const updateInterval = 5000; // 5 seconds

// app/hooks/useHistoricalData.ts
const interval = 10000; // 10 seconds
```

### State Management

Modify default state in `app/store/useStore.ts`:

```typescript
{
  selectedExchange: null,
  selectedCloudProvider: 'all',
  searchTerm: '',
  showRealtime: true,
  showHistorical: true,
  showRegions: true,
  darkMode: true,
  timeRange: '24h',
  latencyRange: [0, 200],
}
```

## 🎨 Customization

### Themes

Toggle between dark/light mode using the sun/moon icon in the control panel. Theme state is persisted using Zustand.

### Globe Appearance

Modify in `app/components/Globe3D.tsx`:

```typescript
// Globe color
<meshStandardMaterial
  color="#0a2540"  // Dark blue
  roughness={0.9}
  metalness={0.1}
/>

// Grid line color
<lineBasicMaterial
  color="#1e3a5f"  // Light blue
  transparent
  opacity={0.4}
/>
```

### Camera Settings

Adjust initial view in `app/components/Globe3D.tsx`:

```typescript
<Canvas
  camera={{
    position: [0, 0, 5],  // [x, y, z]
    fov: 50               // Field of view
  }}
>
```

### Latency Color Thresholds

Modify in `app/lib/latencySimulator.ts`:

```typescript
export function getLatencyColor(latency: number): string {
  if (latency < 50) return "#22c55e"; // green
  if (latency < 100) return "#eab308"; // yellow
  if (latency < 150) return "#f97316"; // orange
  return "#ef4444"; // red
}
```

## 🧪 Development

### Running in Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

### Project Scripts

```json
{
  "dev": "next dev --webpack",      # Start development server
  "build": "next build --webpack",  # Build for production
  "start": "next start",            # Start production server
  "lint": "eslint"                  # Run ESLint
}
```

## 🐛 Troubleshooting

### Common Issues

**1. Globe Not Rendering**

- Ensure WebGL is supported in your browser
- Check browser console for Three.js errors
- Try disabling browser extensions
- Update graphics drivers
- Try a different browser (Chrome, Firefox, Edge)

**2. CORS Errors in Real API Mode**

- Expected behavior for cross-origin requests
- Use Simulation Mode for demos
- Configure CORS proxy for production
- Check browser console for specific error messages

**3. Performance Issues**

- Reduce number of exchanges in `exchanges.ts`
- Decrease update intervals in hooks
- Disable auto-rotate feature
- Lower globe geometry resolution
- Close other browser tabs

**4. TypeScript Errors**

```bash
npm run build
# Check for type errors in terminal output
```

**5. Module Not Found Errors**

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

**6. Styling Issues**

- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.ts` for correct content paths
- Verify PostCSS configuration

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may require WebGL enabled)
- **Opera**: Full support
- **Mobile browsers**: Limited support (responsive design available)

## 📝 Type Definitions

### Core Types

```typescript
interface Exchange {
  id: string;
  name: string;
  lat: number;
  lon: number;
  location: string;
  provider: CloudProvider;
  region: string;
  color: string;
}

type CloudProvider = "AWS" | "GCP" | "Azure";

interface CloudRegion {
  id: string;
  provider: CloudProvider;
  region: string;
  lat: number;
  lon: number;
  name: string;
  serverCount: number;
}

interface LatencyData {
  from: string;
  to: string;
  latency: number;
  timestamp: number;
  color: string;
}

interface HistoricalDataPoint {
  timestamp: number;
  latency: number;
  min: number;
  max: number;
  avg: number;
}
```

## 🔒 Security Considerations

- **CORS**: Real API mode may face CORS restrictions
- **Rate Limiting**: Exchange APIs may have rate limits
- **API Keys**: Currently using public endpoints (no authentication required)
- **Data Privacy**: No sensitive data is stored or transmitted

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

No environment variables are currently required. For production, you may want to add:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENABLE_REAL_API=true
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

### Development Guidelines

- Write type-safe code
- Test components before committing
- Ensure responsive design
- Maintain dark/light mode compatibility
- Optimize for performance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js** community for amazing 3D tools
- **React Three Fiber** for seamless React integration
- **Next.js** team for the excellent framework
- **Cryptocurrency exchanges** for inspiration
- **Cloud providers** (AWS, GCP, Azure) for infrastructure
- **Zustand** for lightweight state management
- **Tailwind CSS** for utility-first styling

## 📞 Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Check existing documentation
- Review code comments for implementation details

## 🔮 Future Enhancements

- [ ] Real-time WebSocket connections
- [ ] Advanced filtering and sorting
- [ ] Export latency data (CSV, JSON)
- [ ] Custom exchange configuration UI
- [ ] Performance optimization for large datasets
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Alert system for latency spikes
- [ ] Historical data persistence

---

**Built with ❤️ using Next.js, Three.js & TypeScript**

