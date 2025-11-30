import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from './lib/ads-session';

// Supported locales
const locales = ['fr', 'en'];
const defaultLocale = 'fr';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  // Extract locale from path
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Handle i18n routing
  if (!pathnameHasLocale && !pathname.startsWith('/api/') && !pathname.startsWith('/_next/') && !pathname.match(/\.(\w+)$/)) {
    // Redirect to default locale if no locale prefix (308 = permanent redirect)
    const locale = req.cookies.get('vmcloud-locale')?.value || defaultLocale;
    const newUrl = new URL(`/${locale}${pathname}${search}`, req.url);
    return NextResponse.redirect(newUrl, { status: 308 });
  }

  // Extract actual path without locale for docs check
  const actualPath = pathnameHasLocale
    ? pathname.replace(/^\/[^/]+/, '')
    : pathname;
  
  const isDocsPath = actualPath.startsWith('/docs') || actualPath.startsWith('/api/docs');
  const isAdsPath = actualPath.startsWith('/ads');
  const isProd = process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production';

  // Protect /ads/ route - require authentication
  if (isAdsPath) {
    const sessionToken = req.cookies.get('ads_session')?.value;
    const session = sessionToken ? verifySessionToken(sessionToken) : null;

    if (!session) {
      // Not authenticated - show login page
      // We redirect to a login page that will be part of the ads route
      const locale = pathname.split('/')[1];
      const validLocale = locales.includes(locale) ? locale : defaultLocale;

      // Check if this is the login API call - allow it
      if (pathname.includes('/api/ads/auth') || pathname.includes('/api/ads/logout')) {
        return NextResponse.next();
      }

      // Show a login form page
      const html = `<!doctype html>
        <html lang="${validLocale}">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Ads Admin - Login</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              background: #0a0a0a;
              color: #e5e5e5;
              font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              width: 100%;
              max-width: 400px;
              padding: 2rem;
            }
            .card {
              background: rgba(24, 24, 27, 0.7);
              border: 1px solid #27272a;
              border-radius: 16px;
              padding: 2rem;
              backdrop-filter: blur(10px);
            }
            .logo {
              text-align: center;
              margin-bottom: 1.5rem;
            }
            .logo svg {
              width: 48px;
              height: 48px;
              color: #22d3ee;
            }
            h1 {
              font-size: 1.5rem;
              font-weight: 300;
              text-align: center;
              margin-bottom: 0.5rem;
            }
            .subtitle {
              color: #71717a;
              text-align: center;
              font-size: 0.875rem;
              margin-bottom: 2rem;
            }
            .form-group {
              margin-bottom: 1rem;
            }
            label {
              display: block;
              font-size: 0.875rem;
              color: #a1a1aa;
              margin-bottom: 0.5rem;
            }
            input[type="password"] {
              width: 100%;
              padding: 0.75rem 1rem;
              background: rgba(39, 39, 42, 0.5);
              border: 1px solid #3f3f46;
              border-radius: 8px;
              color: #fff;
              font-size: 1rem;
              transition: border-color 0.2s, box-shadow 0.2s;
            }
            input[type="password"]:focus {
              outline: none;
              border-color: #22d3ee;
              box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.1);
            }
            input[type="password"]::placeholder {
              color: #52525b;
            }
            button {
              width: 100%;
              padding: 0.75rem 1rem;
              background: linear-gradient(135deg, #0891b2, #22d3ee);
              border: none;
              border-radius: 8px;
              color: #000;
              font-size: 1rem;
              font-weight: 500;
              cursor: pointer;
              transition: opacity 0.2s, transform 0.2s;
              margin-top: 1rem;
            }
            button:hover {
              opacity: 0.9;
              transform: translateY(-1px);
            }
            button:disabled {
              opacity: 0.5;
              cursor: not-allowed;
              transform: none;
            }
            .error {
              background: rgba(239, 68, 68, 0.1);
              border: 1px solid rgba(239, 68, 68, 0.2);
              color: #f87171;
              padding: 0.75rem;
              border-radius: 8px;
              font-size: 0.875rem;
              text-align: center;
              margin-bottom: 1rem;
              display: none;
            }
            .error.show {
              display: block;
            }
            .back-link {
              display: block;
              text-align: center;
              margin-top: 1.5rem;
              color: #71717a;
              font-size: 0.875rem;
              text-decoration: none;
            }
            .back-link:hover {
              color: #a1a1aa;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="logo">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1>Ads Admin</h1>
              <p class="subtitle">${validLocale === 'fr' ? 'Entrez le mot de passe pour accéder' : 'Enter password to access'}</p>

              <div id="error" class="error"></div>

              <form id="loginForm">
                <div class="form-group">
                  <label for="password">${validLocale === 'fr' ? 'Mot de passe' : 'Password'}</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="${validLocale === 'fr' ? 'Votre mot de passe' : 'Your password'}"
                    autocomplete="current-password"
                    required
                  />
                </div>
                <button type="submit" id="submitBtn">
                  ${validLocale === 'fr' ? 'Se connecter' : 'Login'}
                </button>
              </form>

              <a href="/${validLocale}" class="back-link">
                ${validLocale === 'fr' ? "← Retour à l'accueil" : '← Back to home'}
              </a>
            </div>
          </div>

          <script>
            const form = document.getElementById('loginForm');
            const errorDiv = document.getElementById('error');
            const submitBtn = document.getElementById('submitBtn');
            const passwordInput = document.getElementById('password');

            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              errorDiv.classList.remove('show');
              submitBtn.disabled = true;
              submitBtn.textContent = '${validLocale === 'fr' ? 'Connexion...' : 'Logging in...'}';

              try {
                const response = await fetch('/api/ads/auth', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ password: passwordInput.value })
                });

                const data = await response.json();

                if (response.ok) {
                  window.location.reload();
                } else {
                  errorDiv.textContent = '${validLocale === 'fr' ? 'Mot de passe incorrect' : 'Invalid password'}';
                  errorDiv.classList.add('show');
                  submitBtn.disabled = false;
                  submitBtn.textContent = '${validLocale === 'fr' ? 'Se connecter' : 'Login'}';
                }
              } catch (err) {
                errorDiv.textContent = '${validLocale === 'fr' ? 'Erreur de connexion' : 'Connection error'}';
                errorDiv.classList.add('show');
                submitBtn.disabled = false;
                submitBtn.textContent = '${validLocale === 'fr' ? 'Se connecter' : 'Login'}';
              }
            });
          </script>
        </body>
        </html>`;

      return new NextResponse(html, {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' }
      });
    }
  }

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

  // Pass locale to the app via headers
  const requestHeaders = new Headers(req.headers);
  const locale = pathname.split('/')[1];
  if (locales.includes(locale)) {
    requestHeaders.set('x-locale', locale);
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

export const config = {
  matcher: ['/((?!_next|api/(?!docs)|.*\\.).*)'],
};
