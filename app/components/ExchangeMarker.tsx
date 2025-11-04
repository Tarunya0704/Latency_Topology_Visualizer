
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Exchange } from '../types';
import { Html } from '@react-three/drei';

interface ExchangeMarkerProps {
  exchange: Exchange;
  position: THREE.Vector3;
  onClick: () => void;
  isSelected: boolean;
  isVisible: boolean;
}

export default function ExchangeMarker({ 
  exchange, 
  position, 
  onClick, 
  isSelected,
  isVisible 
}: ExchangeMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    
    // Pulse animation for selected marker
    if (isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      meshRef.current.scale.setScalar(scale);
      glowRef.current.scale.setScalar(scale * 1.5);
    } else {
      meshRef.current.scale.setScalar(1);
      glowRef.current.scale.setScalar(1.2);
    }
  });

  if (!isVisible) return null;

  return (
    <group position={position} onClick={onClick}>
      {/* Glow effect */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial
          color={exchange.color}
          transparent
          opacity={isSelected ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Main marker */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshStandardMaterial
          color={exchange.color}
          emissive={exchange.color}
          emissiveIntensity={isSelected ? 1 : 0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Label on hover */}
      {isSelected && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg text-xs whitespace-nowrap pointer-events-none">
            <div className="font-bold">{exchange.name}</div>
            <div className="text-gray-300">{exchange.location}</div>
            <div className="text-gray-400">{exchange.provider}</div>
          </div>
        </Html>
      )}
    </group>
  );
}