'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Exchange, LatencyData } from '../types';

interface HeatmapOverlayProps {
  exchanges: Exchange[];
  latencyData: LatencyData[];
  visible: boolean;
}

function LatLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function HeatmapOverlay({ exchanges, latencyData, visible }: HeatmapOverlayProps) {
  const heatmapRef = useRef<THREE.Mesh>(null);

  // Create heatmap texture based on exchange latencies
  const heatmapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Clear canvas with transparent background
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, size, size);

    // Calculate average latency for each exchange
    const exchangeLatencies = new Map<string, number>();
    exchanges.forEach(ex => {
      const relevantLatencies = latencyData.filter(
        d => d.from === ex.id || d.to === ex.id
      );
      if (relevantLatencies.length > 0) {
        const avg = relevantLatencies.reduce((sum, d) => sum + d.latency, 0) / relevantLatencies.length;
        exchangeLatencies.set(ex.id, avg);
      }
    });

    // Draw heatmap spots for each exchange
    exchanges.forEach(ex => {
      const latency = exchangeLatencies.get(ex.id) || 50;
      
      // Convert lat/lon to canvas coordinates
      const x = ((ex.lon + 180) / 360) * size;
      const y = ((90 - ex.lat) / 180) * size;

      // Determine color based on latency
      let color: string;
      let alpha: number;
      if (latency < 50) {
        color = '34, 197, 94'; // green
        alpha = 0.5;
      } else if (latency < 100) {
        color = '234, 179, 8'; // yellow
        alpha = 0.6;
      } else if (latency < 150) {
        color = '249, 115, 22'; // orange
        alpha = 0.7;
      } else {
        color = '239, 68, 68'; // red
        alpha = 0.8;
      }

      // Draw radial gradient for heat spot
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size / 6);
      gradient.addColorStop(0, `rgba(${color}, ${alpha})`);
      gradient.addColorStop(0.5, `rgba(${color}, ${alpha * 0.5})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size / 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Apply blur for smoother heatmap
    ctx.filter = 'blur(25px)';
    ctx.drawImage(canvas, 0, 0);
    ctx.filter = 'none';

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [exchanges, latencyData]);

  // Animate opacity with subtle pulse
  useFrame((state) => {
    if (heatmapRef.current && heatmapRef.current.material) {
      const material = heatmapRef.current.material as THREE.MeshBasicMaterial;
      if (visible) {
        material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
      } else {
        material.opacity = 0;
      }
    }
  });

  if (!visible) return null;

  return (
    <mesh ref={heatmapRef}>
      <sphereGeometry args={[2.015, 64, 64]} />
      <meshBasicMaterial
        map={heatmapTexture}
        transparent
        opacity={0.5}
        side={THREE.FrontSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}