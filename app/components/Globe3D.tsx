'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Stars, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Exchange, LatencyData, CloudRegion } from '../types';
import { useStore } from '../store/useStore';
import HeatmapOverlay from './HeatmapOverlay';

function LatLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Enhanced Exchange Marker with better visibility
interface ExchangeMarkerProps {
  exchange: Exchange;
  onClick: () => void;
  isSelected: boolean;
}

function ExchangeMarker({ exchange, onClick, isSelected }: ExchangeMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const position = useMemo(
    () => LatLonToVector3(exchange.lat, exchange.lon, 2.05),
    [exchange.lat, exchange.lon]
  );

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    
    if (isSelected) {
      const scale = 1.2 + Math.sin(state.clock.elapsedTime * 4) * 0.4;
      meshRef.current.scale.setScalar(scale);
      glowRef.current.scale.setScalar(scale * 1.8);
    } else if (hovered) {
      meshRef.current.scale.setScalar(1.3);
      glowRef.current.scale.setScalar(1.6);
    } else {
      meshRef.current.scale.setScalar(1);
      glowRef.current.scale.setScalar(1.3);
    }
  });

  const providerColors = {
    AWS: '#FF9900',
    GCP: '#4285F4',
    Azure: '#00FF00'
  };

  return (
    <group position={position}>
      {/* Outer glow - larger and more visible */}
      <mesh 
        ref={glowRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial
          color={providerColors[exchange.provider]}
          transparent
          opacity={isSelected ? 0.7 : hovered ? 0.5 : 0.3}
        />
      </mesh>
      
      {/* Main marker - bigger and brighter */}
      <mesh 
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial
          color={providerColors[exchange.provider]}
          emissive={providerColors[exchange.provider]}
          emissiveIntensity={isSelected ? 1.5 : hovered ? 1.2 : 0.9}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Pin stem for better visibility */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04, 8]} />
        <meshStandardMaterial
          color={providerColors[exchange.provider]}
          emissive={providerColors[exchange.provider]}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Enhanced tooltip */}
      {(hovered || isSelected) && (
        <Html distanceFactor={6} style={{ pointerEvents: 'none' }}>
          <div className={`bg-black/95 text-white px-4 py-3 rounded-lg text-xs whitespace-nowrap border-2 ${
            isSelected ? 'border-blue-500' : 'border-gray-600'
          } shadow-2xl`}>
            <div className="font-bold text-base mb-1" style={{ color: providerColors[exchange.provider] }}>
              {exchange.name}
            </div>
            <div className="text-gray-300 text-xs">📍 {exchange.location}</div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: providerColors[exchange.provider] }} />
              <span className="text-xs font-mono">{exchange.provider}</span>
            </div>
            {isSelected && (
              <div className="mt-2 pt-2 border-t border-gray-700 text-[10px] text-blue-400">
                ⚡ Click to view connections
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// Enhanced Latency Connection with visible labels
interface LatencyConnectionProps {
  from: Exchange;
  to: Exchange;
  latency: number;
  color: string;
}

function LatencyConnection({ from, to, latency, color }: LatencyConnectionProps) {
  const lineRef = useRef<THREE.Line>(null);
  const particleRef = useRef<THREE.Mesh>(null);
  
  const { points, midPoint } = useMemo(() => {
    const start = LatLonToVector3(from.lat, from.lon, 2.06);
    const end = LatLonToVector3(to.lat, to.lon, 2.06);
    
    const distance = start.distanceTo(end);
    const elevation = Math.min(distance * 0.4, 1.2);
    
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2 + elevation);
    
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return { points: curve.getPoints(60), midPoint: mid };
  }, [from.lat, from.lon, to.lat, to.lon]);

  useFrame((state) => {
    if (lineRef.current && lineRef.current.material) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    }
    
    if (particleRef.current) {
      const t = (state.clock.elapsedTime * 0.4) % 1;
      const index = Math.floor(t * (points.length - 1));
      const position = points[index];
      if (position) {
        particleRef.current.position.copy(position);
      }
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  return (
    <>
      {/* Main connection line */}
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          linewidth={3}
        />
      </line>
      
      {/* Animated particle traveling along line */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Latency label at midpoint - always visible */}
      <Html position={midPoint} distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div className="bg-black/90 text-white px-3 py-1.5 rounded-md text-xs font-bold border border-gray-600 shadow-lg">
          <div style={{ color: color }}>{latency}ms</div>
          <div className="text-[9px] text-gray-400">{from.name} ↔ {to.name}</div>
        </div>
      </Html>
    </>
  );
}

// Cloud Region Visualization
interface CloudRegionMarkerProps {
  region: CloudRegion;
}

function CloudRegionMarker({ region }: CloudRegionMarkerProps) {
  const ringRef = useRef<THREE.Mesh>(null);
  const position = useMemo(
    () => LatLonToVector3(region.lat, region.lon, 2.08),
    [region.lat, region.lon]
  );

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  const providerColors = {
    AWS: '#FF9900',
    GCP: '#4285F4',
    Azure: '#00FF00'
  };

  return (
    <group position={position}>
      {/* Outer rotating ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.09, 32]} />
        <meshBasicMaterial
          color={providerColors[region.provider]}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner circle */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 32]} />
        <meshBasicMaterial
          color={providerColors[region.provider]}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Region label */}
      <Html distanceFactor={12} style={{ pointerEvents: 'none' }}>
        <div className="text-white text-[9px] bg-black/70 px-2 py-1 rounded whitespace-nowrap">
          <div className="font-bold">{region.name}</div>
          <div className="text-gray-300">{region.provider}</div>
          <div className="text-gray-400">{region.serverCount} servers</div>
        </div>
      </Html>
    </group>
  );
}

// Enhanced Earth Globe with better textures
function EarthGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <Sphere ref={globeRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#0a2540"
        roughness={0.9}
        metalness={0.1}
      />
    </Sphere>
  );
}

// Grid lines for reference
function GridLines() {
  const latLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    for (let lat = -80; lat <= 80; lat += 20) {
      const points: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 5) {
        points.push(LatLonToVector3(lat, lon, 2.01));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lines.push(
        <line key={`lat-${lat}`} geometry={geometry}>
          <lineBasicMaterial color="#1e3a5f" transparent opacity={0.4} />
        </line>
      );
    }
    return lines;
  }, []);

  const lonLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    for (let lon = -180; lon <= 180; lon += 20) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(LatLonToVector3(lat, lon, 2.01));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lines.push(
        <line key={`lon-${lon}`} geometry={geometry}>
          <lineBasicMaterial color="#1e3a5f" transparent opacity={0.4} />
        </line>
      );
    }
    return lines;
  }, []);

  return (
    <>
      {latLines}
      {lonLines}
    </>
  );
}

interface Globe3DProps {
  exchanges: Exchange[];
  latencyData: LatencyData[];
  cloudRegions: CloudRegion[];
}

export default function Globe3D({ exchanges, latencyData, cloudRegions }: Globe3DProps) {
  const {
    selectedExchange,
    setSelectedExchange,
    selectedCloudProvider,
    showRealtime,
    showRegions,
    searchTerm,
    latencyRange
  } = useStore();

  // Filter exchanges based on search and provider
  const filteredExchanges = useMemo(() => {
    return exchanges.filter((ex) => {
      if (selectedCloudProvider !== 'all' && ex.provider !== selectedCloudProvider) {
        return false;
      }
      if (searchTerm && !ex.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [exchanges, selectedCloudProvider, searchTerm]);

  // Filter latency data by range
  const visibleLatencyData = useMemo(() => {
    if (!selectedExchange || !showRealtime) return [];
    
    return latencyData.filter((data) => {
      const isConnected = data.from === selectedExchange.id || data.to === selectedExchange.id;
      const inRange = data.latency >= latencyRange[0] && data.latency <= latencyRange[1];
      return isConnected && inRange;
    });
  }, [latencyData, selectedExchange, showRealtime, latencyRange]);

  const filteredRegions = useMemo(() => {
    if (!showRegions) return [];
    return cloudRegions.filter((region) =>
      selectedCloudProvider === 'all' || region.provider === selectedCloudProvider
    );
  }, [cloudRegions, selectedCloudProvider, showRegions]);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      style={{ background: 'linear-gradient(to bottom, #000814, #001233)' }}
    >
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.7} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#4488ff" />
      <pointLight position={[0, 10, 0]} intensity={1.5} color="#ffffff" />
      
      {/* Starfield background */}
      <Stars radius={300} depth={60} count={10000} factor={6} fade speed={1} />
      
      <EarthGlobe />

{/* ADD THIS - Heatmap Overlay */}
<HeatmapOverlay 
  exchanges={filteredExchanges} 
  latencyData={latencyData} 
  visible={showRegions} 
/>

<GridLines />
      
      {/* Cloud Regions */}
      {filteredRegions.map((region) => (
        <CloudRegionMarker key={region.id} region={region} />
      ))}
      
      {/* Exchange Markers - Always visible when not filtered */}
      {filteredExchanges.map((exchange) => (
        <ExchangeMarker
          key={exchange.id}
          exchange={exchange}
          onClick={() => setSelectedExchange(exchange)}
          isSelected={selectedExchange?.id === exchange.id}
        />
      ))}
      
      {/* Latency Connections */}
      {visibleLatencyData.map((data) => {
        const fromEx = exchanges.find((ex) => ex.id === data.from);
        const toEx = exchanges.find((ex) => ex.id === data.to);
        if (!fromEx || !toEx) return null;
        
        return (
          <LatencyConnection
            key={`${data.from}-${data.to}`}
            from={fromEx}
            to={toEx}
            latency={data.latency}
            color={data.color}
          />
        );
      })}
      
      {/* Enhanced Camera Controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2.8}
        maxDistance={15}
        autoRotate={false}
        rotateSpeed={0.6}
        zoomSpeed={1.5}
        panSpeed={0.8}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  );
}