import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'VMCloud - Cloud Infrastructure';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
  const isEN = params.locale === 'en';

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
          }}
        />
        
        {/* Logo */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 300,
            letterSpacing: '0.2em',
            color: '#3b82f6',
            marginBottom: 20,
            textTransform: 'uppercase',
          }}
        >
          VMCloud
        </div>

        {/* Main message */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 200,
            color: 'white',
            textAlign: 'center',
            marginBottom: 30,
            lineHeight: 1.2,
            maxWidth: '90%',
          }}
        >
          {isEN 
            ? '⚡ Lightning-Fast Cloud Infrastructure'
            : '⚡ Infrastructure Cloud Ultra-Rapide'}
        </div>

        {/* Key points */}
        <div
          style={{
            fontSize: 22,
            color: '#a1a1aa',
            textAlign: 'center',
            marginBottom: 40,
            lineHeight: 1.5,
          }}
        >
          {isEN ? 'VPS from €4.99' : 'VPS dès 4.99€'} • GPU {isEN ? 'Servers' : 'Serveurs'} • Web Hosting
          <br />
          {isEN ? 'European Datacenters' : 'Datacenters Européens'} • 99.99% SLA
        </div>

        {/* CTA */}
        <div
          style={{
            fontSize: 20,
            padding: '14px 40px',
            background: 'white',
            color: 'black',
            borderRadius: 999,
            fontWeight: 500,
          }}
        >
          {isEN ? 'Start Free Trial →' : 'Essai Gratuit →'}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 16,
            color: '#52525b',
          }}
        >
          vmcl.fr/{params.locale}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}