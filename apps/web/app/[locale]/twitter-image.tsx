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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          style={{ width: 110, height: 110, marginBottom: 24 }}
        >
          <defs>
            <linearGradient id="logoGradientTwitter" x1="8" y1="16" x2="24" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3b82f6" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="6" fill="#0a0a0a" />
          <path
            d="M8 12L12 20L16 10L20 20L24 12"
            stroke="url(#logoGradientTwitter)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16" r="1.5" fill="url(#logoGradientTwitter)" />
        </svg>

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
            ? '⚡ Sovereign Cloud. Lightning Fast.'
            : '⚡ Cloud souverain. Ultra-rapide.'}
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
          {isEN ? 'VPS from €29' : 'VPS dès 29€'} • GPU {isEN ? 'Clusters' : 'Clusters GPU'} • {isEN ? 'Managed Hosting' : 'Hébergement managé'}
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
          {isEN ? 'Spin up in 60s →' : 'Lancez en 60s →'}
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
