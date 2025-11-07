'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { CloudRegion } from '../types';
import { Html } from '@react-three/drei';

interface CloudRegionsProps {
  regions: CloudRegion[];
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

export default function CloudRegions({ regions, visible }: CloudRegionsProps) {
  if (!visible) return null;

  return (
    <>
      {regions.map((region) => (
        <CloudRegionMarker key={region.id} region={region} />
      ))}
    </>
  );
}

function CloudRegionMarker({ region }: { region: CloudRegion }) {
  const position = useMemo(
    () => LatLonToVector3(region.lat, region.lon, 2.08),
    [region.lat, region.lon]
  );

  const providerColors: Record<string, string> = {
    AWS: '#FF9900',
    GCP: '#4285F4',
    Azure: '#0078D4'
  };

  return (
    <group position={position}>
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.06, 32]} />
        <meshBasicMaterial
          color={providerColors[region.provider]}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.04, 32]} />
        <meshBasicMaterial
          color={providerColors[region.provider]}
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

     
      <Html distanceFactor={15}>
        <div className="text-white text-[10px] bg-black/70 px-2 py-1 rounded whitespace-nowrap pointer-events-none">
          <div className="font-bold">{region.name}</div>
          <div className="text-gray-300">{region.provider} - {region.region}</div>
        </div>
      </Html>
    </group>
  );
}