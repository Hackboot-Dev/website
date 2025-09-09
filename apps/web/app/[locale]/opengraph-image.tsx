import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'VMCloud - Premium Cloud Infrastructure';
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
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
            opacity: 0.5,
          }}
        />
        
        {/* Logo/Brand */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: '0.1em',
            color: '#71717a',
            marginBottom: 20,
            textTransform: 'uppercase',
          }}
        >
          VMCloud
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 200,
            color: 'white',
            textAlign: 'center',
            marginBottom: 30,
            lineHeight: 1.1,
            maxWidth: '80%',
          }}
        >
          {isEN ? 'Premium Cloud' : 'Infrastructure'}
          <br />
          {isEN ? 'Infrastructure' : 'Cloud Premium'}
        </div>

        {/* Services */}
        <div
          style={{
            fontSize: 24,
            color: '#a1a1aa',
            display: 'flex',
            gap: 30,
            marginBottom: 40,
          }}
        >
          <span>VPS NVMe</span>
          <span style={{ color: '#52525b' }}>•</span>
          <span>GPU {isEN ? 'Servers' : 'Serveurs'}</span>
          <span style={{ color: '#52525b' }}>•</span>
          <span>Web Hosting</span>
        </div>

        {/* Key features */}
        <div
          style={{
            fontSize: 20,
            color: '#71717a',
            display: 'flex',
            gap: 40,
            marginBottom: 40,
          }}
        >
          <span>99.99% SLA</span>
          <span>{isEN ? '24/7 Support' : 'Support 24/7'}</span>
          <span>{isEN ? 'From' : 'Dès'} €4.99</span>
        </div>

        {/* CTA */}
        <div
          style={{
            fontSize: 18,
            padding: '12px 32px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            borderRadius: 8,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {isEN ? '30-Day Free Trial' : 'Essai Gratuit 30 Jours'}
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            right: 40,
            fontSize: 18,
            color: '#52525b',
          }}
        >
          vmcl.fr
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}