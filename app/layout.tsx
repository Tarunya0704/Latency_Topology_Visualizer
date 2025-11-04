import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Latency Topology Visualizer | Real-time Network Monitoring',
  description: 'Interactive 3D visualization of cryptocurrency exchange server locations and real-time latency monitoring across AWS, GCP, and Azure.',
  keywords: ['latency', 'network', 'monitoring', 'cryptocurrency', 'exchanges', 'AWS', 'GCP', 'Azure'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}