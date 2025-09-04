import { NextRequest, NextResponse } from 'next/server';

// Block documentation in production at the edge level
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDocsPath = pathname.startsWith('/docs') || pathname.startsWith('/api/docs');
  const isProd = process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production';

  if (isProd && isDocsPath) {
    const wantsJson = pathname.startsWith('/api/') || req.headers.get('accept')?.includes('application/json');
    if (wantsJson) {
      return new NextResponse(
        JSON.stringify({ error: 'Documentation interdite en production', code: 403 }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }

    const html = `<!doctype html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>403 – Accès interdit</title>
        <style>
          body{margin:0;background:#0a0a0a;color:#e5e5e5;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif}
          .wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem}
          .card{background:rgba(24,24,27,.7);border:1px solid #27272a;border-radius:12px;max-width:720px;width:100%;padding:32px;text-align:center}
          h1{font-weight:300;margin:0 0 12px 0;font-size:28px}
          p{color:#a1a1aa;margin:0 0 18px 0}
          .badge{display:inline-block;padding:4px 10px;border:1px solid #3f3f46;border-radius:999px;color:#a1a1aa;font-size:12px;margin-bottom:12px}
          a{color:#22d3ee;text-decoration:none}
          a:hover{color:#67e8f9}
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="card">
            <div class="badge">Erreur 403</div>
            <h1>Documentation indisponible en production</h1>
            <p>Cette section est temporairement désactivée. Passez l’application en environnement de développement pour y accéder.</p>
            <p><a href="/">Revenir à l’accueil</a></p>
          </div>
        </div>
      </body>
      </html>`;
    return new NextResponse(html, { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/docs/:path*', '/api/docs/:path*'],
};
