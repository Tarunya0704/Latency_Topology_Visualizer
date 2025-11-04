'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Exchange, LatencyData, CloudRegion } from '../types';
import { useStore } from '../store/useStore';
import ExchangeMarker from './ExchangeMarker';
import LatencyConnection from './LatencyConnection';
import CloudRegions from './CloudRegions';

function LatLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

function EarthGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={globeRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#0a1929"
        roughness={1}
        metalness={0}
      />
    </Sphere>
  );
}

function GridLines() {
  const lines = useMemo(() => {
    const lineGeometries: JSX.Element[] = [];
    
    // Latitude lines
    for (let lat = -80; lat <= 80; lat += 20) {
      const points: THREE.Vector3[] = [];
      for (let lon = -180; lon <= 180; lon += 5) {
        points.push(LatLonToVector3(lat, lon, 2.005));
      }
      lineGeometries.push(
        <Line
          key={`lat-${lat}`}
          points={points}
          color="#1e3a5f"
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      );
    }
    
    // Longitude lines
    for (let lon = -180; lon <= 180; lon += 20) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(LatLonToVector3(lat, lon, 2.005));
      }
      lineGeometries.push(
        <Line
          key={`lon-${lon}`}
          points={points}
          color="#1e3a5f"
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      );
    }
    
    return lineGeometries;
  }, []);

  return <>{lines}</>;
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
    searchTerm
  } = useStore();

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

  const visibleLatencyData = useMemo(() => {
    if (!selectedExchange || !showRealtime) return [];
    return latencyData.filter(
      (data) =>
        data.from === selectedExchange.id || data.to === selectedExchange.id
    );
  }, [latencyData, selectedExchange, showRealtime]);

  const filteredRegions = useMemo(() => {
    return cloudRegions.filter((region) =>
      selectedCloudProvider === 'all' || region.provider === selectedCloudProvider
    );
  }, [cloudRegions, selectedCloudProvider]);

  // Precompute positions for performance
  const exchangePositions = useMemo(() => {
    const positions = new Map<string, THREE.Vector3>();
    exchanges.forEach(ex => {
      positions.set(ex.id, LatLonToVector3(ex.lat, ex.lon, 2.01));
    });
    return positions;
  }, [exchanges]);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ background: '#000000' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <Stars radius={300} depth={50} count={5000} factor={4} fade speed={1} />
      
      <EarthGlobe />
      <GridLines />
      
      <CloudRegions regions={filteredRegions} visible={showRegions} />
      
      {filteredExchanges.map((exchange) => (
        <ExchangeMarker
          key={exchange.id}
          exchange={exchange}
          position={exchangePositions.get(exchange.id)!}
          onClick={() => setSelectedExchange(exchange)}
          isSelected={selectedExchange?.id === exchange.id}
          isVisible={true}
        />
      ))}
      
      {visibleLatencyData.map((data) => {
        const fromEx = exchanges.find((ex) => ex.id === data.from);
        const toEx = exchanges.find((ex) => ex.id === data.to);
        if (!fromEx || !toEx) return null;
        
        const fromPos = exchangePositions.get(fromEx.id);
        const toPos = exchangePositions.get(toEx.id);
        if (!fromPos || !toPos) return null;
        
        return (
          <LatencyConnection
            key={`${data.from}-${data.to}`}
            from={fromEx}
            to={toEx}
            fromPosition={fromPos}
            toPosition={toPos}
            latency={data.latency}
            color={data.color}
          />
        );
      })}
      
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}