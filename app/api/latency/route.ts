import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simulate latency data
    // In production, this would call actual APIs like Cloudflare Radar
    const latencyData = generateMockLatency();
    
    return NextResponse.json({
      success: true,
      data: latencyData,
      timestamp: Date.now()
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch latency data' },
      { status: 500 }
    );
  }
}

function generateMockLatency() {
  const exchanges = ['binance-sg', 'okx-sg', 'deribit-nl', 'bybit-jp', 'kraken-us'];
  const data = [];
  
  for (let i = 0; i < exchanges.length; i++) {
    for (let j = i + 1; j < exchanges.length; j++) {
      data.push({
        from: exchanges[i],
        to: exchanges[j],
        latency: Math.floor(Math.random() * 150) + 10,
        timestamp: Date.now()
      });
    }
  }
  
  return data;
}
