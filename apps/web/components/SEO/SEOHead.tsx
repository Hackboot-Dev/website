import Head from 'next/head';
import Script from 'next/script';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    site_name?: string;
    url?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    site?: string;
    creator?: string;
  };
  jsonLd?: any;
  alternates?: Array<{
    lang: string;
    url: string;
  }>;
  noindex?: boolean;
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
}

export default function SEOHead({
  title,
  description,
  keywords,
  canonical,
  og,
  twitter,
  jsonLd,
  alternates,
  noindex = false,
  additionalMetaTags = []
}: SEOHeadProps) {
  const domain = 'https://vmcl.fr';
  const defaultOGImage = `${domain}/images/og-default.jpg`;

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        
        {/* Viewport and charset */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta charSet="utf-8" />
        
        {/* Robots */}
        <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
        <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
        
        {/* Canonical URL */}
        {canonical && <link rel="canonical" href={canonical} />}
        
        {/* Alternate languages */}
        {alternates?.map((alt) => (
          <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.url} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={domain} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={og?.type || 'website'} />
        <meta property="og:url" content={og?.url || canonical || domain} />
        <meta property="og:title" content={og?.title || title} />
        <meta property="og:description" content={og?.description || description} />
        <meta property="og:image" content={og?.image || defaultOGImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={og?.site_name || 'VMCloud'} />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:locale:alternate" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content={twitter?.card || 'summary_large_image'} />
        <meta name="twitter:url" content={canonical || domain} />
        <meta name="twitter:title" content={twitter?.title || title} />
        <meta name="twitter:description" content={twitter?.description || description} />
        <meta name="twitter:image" content={twitter?.image || og?.image || defaultOGImage} />
        <meta name="twitter:site" content={twitter?.site || '@vmcloud'} />
        <meta name="twitter:creator" content={twitter?.creator || '@vmcloud'} />
        
        {/* Additional SEO tags */}
        <meta name="author" content="VMCloud" />
        <meta name="publisher" content="VMCloud" />
        <meta name="copyright" content="VMCloud" />
        <meta name="application-name" content="VMCloud" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="VMCloud" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000000" />
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional custom meta tags */}
        {additionalMetaTags.map((tag, index) => {
          if (tag.property) {
            return <meta key={index} property={tag.property} content={tag.content} />;
          }
          return <meta key={index} name={tag.name!} content={tag.content} />;
        })}
      </Head>
      
      {/* JSON-LD structured data */}
      {jsonLd && (
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      )}
      
      {/* Google Tag Manager (optional) */}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `
          }}
        />
      )}
    </>
  );
}