import { ImageResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #0f172a 60%, #0a0a0a 100%)',
          color: 'white',
          padding: '80px',
        }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 28,
          opacity: 0.9,
          marginBottom: 20,
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 8, background: '#22d3ee' }} />
          <span>VMCloud by Hackboot</span>
        </div>
        <div style={{ fontSize: 64, lineHeight: 1.1, fontWeight: 700, marginBottom: 24 }}>
          Premium Cloud Infrastructure
        </div>
        <div style={{ fontSize: 32, opacity: 0.85 }}>
          VPS • GPU • Hosting • 99.9% SLA
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

