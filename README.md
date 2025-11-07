

A real-time 3D globe visualization platform for monitoring and analyzing latency between cryptocurrency exchanges across different cloud providers (AWS, GCP, Azure).

![Project Demo](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-Latest-black?style=for-the-badge&logo=three.js)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🌐 Interactive 3D Globe
- **Real-time visualization** of cryptocurrency exchange locations
- **Smooth rotation** and interactive camera controls
- **Animated connections** showing latency between exchanges
- **Grid overlay** with latitude/longitude lines

### 📊 Real-time Latency Monitoring
- Live latency data between exchanges
- Color-coded latency indicators:
  - 🟢 Green: <50ms (Excellent)
  - 🟡 Yellow: 50-100ms (Good)
  - 🟠 Orange: 100-150ms (Fair)
  - 🔴 Red: >150ms (Poor)
- Animated data particles along connection paths

### ☁️ Cloud Provider Integration
- Support for AWS, GCP, and Azure regions
- Cloud region markers with provider-specific colors
- Filter exchanges by cloud provider
- Server count visualization per region

### 📈 Analytics & Monitoring
- Historical latency data tracking
- Time range selection (1h, 24h, 7d, 30d)
- Latency range filtering
- Statistical analysis (min, max, avg)

### 🎨 User Interface
- **Dark/Light mode** toggle
- **Search functionality** for exchanges
- **Responsive control panel**
- Real-time statistics dashboard
- Historical data charts

### 🔄 Dual Mode Operation
- **Simulation Mode**: Geographic distance-based latency calculation
- **Real API Mode**: Actual exchange API integration (with CORS awareness)

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library
- **TypeScript 5+** - Type safety

### 3D Visualization
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F

### State Management
- **Zustand** - Lightweight state management

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Data & APIs
- Custom latency simulation engine
- Exchange API integration support

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd crypto-exchange-latency-visualizer
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

## 📁 Project Structure

```
crypto-exchange-latency-visualizer/
├── app/
│   ├── api/
│   │   └── latency/
│   │       └── route.ts          # Latency API endpoint
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── CloudRegions.tsx          # Cloud region markers
│   ├── ControlPanel.tsx          # UI control panel
│   ├── ExchangeMarker.tsx        # Exchange location markers
│   ├── Globe3D.tsx               # Main 3D globe component
│   ├── HeatmapOverlay.tsx        # Latency heatmap
│   ├── HistoricalChart.tsx       # Historical data charts
│   ├── LatencyConnection.tsx     # Connection visualizations
│   └── StatsPanel.tsx            # Statistics dashboard
├── hooks/
│   ├── useHistoricalData.ts      # Historical data hook
│   └── useLatencyData.ts         # Real-time latency hook
├── lib/
│   ├── apiIntegration.ts         # API integration logic
│   ├── latencySimulator.ts       # Latency simulation
│   └── exchangeData.ts           # Exchange definitions
├── store/
│   └── useStore.ts               # Zustand state store
├── types/
│   └── index.ts                  # TypeScript definitions
├── public/
├── .gitignore
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Usage

### Basic Operations

#### 1. Selecting an Exchange
- Click on any exchange marker (glowing sphere) on the globe
- View connections and latency to other exchanges
- Selected exchange will pulse with animated glow

#### 2. Filtering Data
- **Search**: Type exchange name in search box
- **Cloud Provider**: Filter by AWS, GCP, Azure, or All
- **Time Range**: Select historical data period
- **Latency Range**: Set min/max latency thresholds

#### 3. Toggling Visualization Layers
- **Real-time Latency**: Show/hide live connections
- **Historical Data**: Enable/disable historical charts
- **Cloud Regions**: Display cloud provider regions

#### 4. API Mode Switching
- **Simulation Mode** (Default): Safe for demo, uses geographic calculations
- **Real API Mode**: Attempts actual exchange connections (may have CORS issues)

### Advanced Features

#### Globe Navigation
- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag (or Ctrl + drag)
- **Auto-rotate**: Disabled by default (can be enabled in code)

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
Azure (Green)  : #00FF00
```

## 🔌 API Documentation

### GET /api/latency

Fetches current latency data between all exchange pairs.

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
// Based on geographic distance
distance_km = haversine(exchange1, exchange2)
base_latency = (distance_km / 100) * 1ms
jitter = random(-10ms, +10ms)
provider_penalty = different_providers ? 15ms : 0ms
total_latency = base_latency + jitter + provider_penalty
```

**Real API Mode:**
- Attempts actual ping to exchange endpoints
- Falls back to simulation on CORS errors
- Averages multiple measurements for accuracy

## ⚙️ Configuration

### Exchange Data
Add new exchanges in `lib/exchangeData.ts`:

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
Configure regions in the same file:

```typescript
{
  id: 'aws-singapore',
  provider: 'AWS',
  region: 'ap-southeast-1',
  lat: 1.3521,
  lon: 103.8198,
  name: 'AWS Singapore',
  serverCount: 42
}
```

### Update Intervals
Adjust in respective hooks:

```typescript
// useLatencyData.ts
const updateInterval = 5000; // 5 seconds

// useHistoricalData.ts
const interval = 10000; // 10 seconds
```

## 🎨 Customization

### Themes
Toggle between dark/light mode using the sun/moon icon in the control panel.

### Globe Appearance
Modify in `Globe3D.tsx`:

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
Adjust initial view in `Globe3D.tsx`:

```typescript
<Canvas
  camera={{ 
    position: [0, 0, 5],  // [x, y, z]
    fov: 50               // Field of view
  }}
>
```

## 🧪 Testing

### Running Tests
```bash
npm test
# or
yarn test
```

### Test Coverage
- Component rendering tests
- Latency calculation accuracy
- API endpoint responses
- State management logic

## 🐛 Troubleshooting

### Common Issues

**1. Globe Not Rendering**
- Ensure WebGL is supported in your browser
- Check browser console for Three.js errors
- Try disabling browser extensions

2. CORS Errors in Real API Mode
- Expected behavior for cross-origin requests
- Use Simulation Mode for demos
- Configure CORS proxy for production

3. Performance Issues
- Reduce number of exchanges
- Decrease update intervals
- Disable auto-rotate feature
- Lower globe geometry resolution

**4. TypeScript Errors**
```bash
npm run build
# Check for type errors



### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write meaningful commit messages
- Add comments for complex logic

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Three.js community for amazing 3D tools
- React Three Fiber for seamless React integration
- Cryptocurrency exchanges for inspiration
- Cloud providers (AWS, GCP, Azure) for infrastructure

