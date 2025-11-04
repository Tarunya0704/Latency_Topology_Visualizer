'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { Exchange } from '../types';

interface LatencyConnectionProps {
  from: Exchange;
  to: Exchange;
  fromPosition: THREE.Vector3;
  toPosition: THREE.Vector3;
  latency: number;
  color: string;
}

export default function LatencyConnection({
  from,
  to,
  fromPosition,
  toPosition,
  latency,
  color
}: LatencyConnectionProps) {
  const lineRef = useRef<THREE.Line>(null);
  
  // Create curved path between two points
  const points = useMemo(() => {
    const start = fromPosition.clone();
    const end = toPosition.clone();
    
    // Calculate midpoint elevated above the surface
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(2.5); // Elevation for the curve
    
    // Create smooth curve
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(50);
  }, [fromPosition, toPosition]);

  // Animated pulse effect
  useFrame((state) => {
    if (lineRef.current && lineRef.current.material) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
  });

  return (
    <>
      <Line
        ref={lineRef}
        points={points}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.6}
        dashed={false}
      />
      
      {/* Animated particle traveling along the line */}
      <AnimatedParticle points={points} color={color} speed={latency} />
    </>
  );
}

function AnimatedParticle({ 
  points, 
  color, 
  speed 
}: { 
  points: THREE.Vector3[]; 
  color: string; 
  speed: number;
}) {
  const particleRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!particleRef.current) return;
    
    // Move particle along the curve
    const t = (state.clock.elapsedTime * 0.2) % 1;
    const index = Math.floor(t * (points.length - 1));
    const position = points[index];
    
    if (position) {
      particleRef.current.position.copy(position);
    }
  });

  return (
    <mesh ref={particleRef}>
      <sphereGeometry args={[0.015, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}