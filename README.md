Latency Topology Visualizer
A sophisticated 3D visualization platform that displays cryptocurrency exchange server locations and real-time latency data across AWS, GCP, and Azure cloud regions. Built with Next.js and Three.js, this application provides traders and infrastructure teams with intuitive insights into global trading infrastructure performance.

🌟 Features
🗺️ Interactive 3D World Map
Real-time 3D globe visualization with smooth camera controls

Interactive exchange markers with hover/click information

Rotate, zoom, and pan capabilities for seamless exploration

Responsive design optimized for desktop and mobile devices

⚡ Real-time Latency Monitoring
Live latency data between exchange servers and cloud regions

Color-coded connection indicators:

🟢 Green: <50ms (Excellent)

🟡 Yellow: 50-100ms (Good)

🟠 Orange: 100-150ms (Fair)

🔴 Red: >150ms (Poor)

Animated data streams and pulse effects

Automatic updates every 5 seconds

☁️ Multi-Cloud Provider Integration
Support for AWS, GCP, and Azure regions

Provider-specific color coding and markers

Region boundary visualization with server counts

Filter exchanges by cloud provider

📊 Historical Analytics
Time-series charts for latency trends

Configurable time ranges (1h, 24h, 7d, 30d)

Statistical analysis (min, max, average latency)

Historical data tracking and visualization

🎨 Advanced Visualization
Dark/Light theme toggle

Search functionality for exchanges and regions

Toggle visualization layers (real-time, historical, regions)

Performance metrics dashboard

Network topology visualization

🛠️ Technical Stack
Frontend Framework

Next.js 14+ with App Router

React 18+ with TypeScript

Tailwind CSS for styling

3D Visualization

Three.js for 3D graphics

React Three Fiber for React integration

@react-three/drei for utilities

State Management & Data

Zustand for lightweight state management

Real-time data simulation engine

RESTful API integration

🚀 Quick Start
Prerequisites
Node.js 18 or higher

npm, yarn, or pnpm

Installation
bash
# Clone the repository
git clone <repository-url>
cd latency-topology-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
Navigate to http://localhost:3000 to view the application.

📁 Project Structure
text
latency-topology-visualizer/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── Globe3D.tsx        # Main 3D globe
│   ├── ExchangeMarker.tsx # Exchange visual markers
│   ├── LatencyConnection.tsx
│   ├── ControlPanel.tsx   # UI controls
│   ├── HistoricalChart.tsx
│   └── CloudRegions.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── store/                 # State management
├── types/                 # TypeScript definitions
└── public/               # Static assets
💡 Usage Guide
Basic Navigation
Rotate: Click and drag the globe

Zoom: Use mouse wheel or pinch gesture

Pan: Right-click and drag

Select: Click on exchange markers for detailed information

Data Filtering
Use the control panel to filter by exchange, cloud provider, or latency range

Search for specific exchanges using the search box

Toggle between real-time and historical views

Adjust time ranges for historical data analysis

Visualization Modes
Simulation Mode: Geographic distance-based latency (safe for demos)

Real API Mode: Actual exchange API integration (requires CORS configuration)

🔧 Configuration
Adding New Exchanges
Update lib/exchangeData.ts:

typescript
{
  id: 'exchange-id',
  name: 'Exchange Name',
  lat: 1.3521,
  lon: 103.8198,
  location: 'Singapore',
  provider: 'AWS',
  region: 'ap-southeast-1',
  serverCount: 15
}
Customizing Visualization
Adjust globe appearance and camera settings in components/Globe3D.tsx:

typescript
// Camera configuration
<Canvas
  camera={{ 
    position: [0, 0, 5],
    fov: 50
  }}
>
🎯 Key Implementation Details
Real-time Data Processing
Dual-mode operation (simulation and real API)

Geographic distance-based latency calculations

Fallback mechanisms for CORS limitations

Efficient data caching and state updates

Performance Optimization
Optimized 3D rendering for smooth interactions

Efficient state management with Zustand

Responsive design with mobile touch controls

Progressive loading for large datasets

🚧 Development
Running Tests
bash
npm test
npm run test:coverage
Building for Production
bash
npm run build
npm start
🤝 Contributing
While this is an assessment project, contributions to the code quality and documentation are welcome through proper channels.



Built with modern web technologies and a focus on user experience, this Latency Topology Visualizer demonstrates advanced 3D visualization capabilities and real-time data processing in a trading infrastructure context.

Technologies: Next.js, React, Three.js, TypeScript, Tailwind CSS, AWS/GCP/Azure Integration

