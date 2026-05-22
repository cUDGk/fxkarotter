import { Hono } from 'hono';
import { karotterStatusRequest } from './routes/status';
import { karotterProfileRequest } from './routes/profile';
import { howToUsePage } from './routes/howtouse';
import { llmsTxt, llmsFullTxt } from './routes/llms';
import { oembed } from '../api/routes/oembed';
import { versionRoute } from '../common/version';
import { getKarotterRoot } from '../../helpers/karotter';

export const karotter = new Hono();

/* Normalize: strip trailing slashes, redirect to clean URL */
karotter.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  const cleaned = url.pathname.replace(/\/+$/, '') || '/';
  if (url.pathname !== cleaned && cleaned !== '/') {
    return c.redirect(`${url.origin}${cleaned}${url.search}`, 301);
  }
  await next();
});

/* Root → GitHub repo */
karotter.get('/', c => c.redirect('https://github.com/cUDGk/fxkarotter', 302));

/* Utility routes */
karotter.get('/owoembed', oembed);
karotter.get('/version', c => versionRoute(c));

/* robots.txt — explicit AI/LLM crawler allowlist for AI search visibility */
karotter.get('/robots.txt', c => {
  c.header('content-type', 'text/plain;charset=utf-8');
  c.header('cache-control', 'public, max-age=86400');
  c.header('x-robots-tag', 'index, follow');
  return c.body(`# https://www.robotstxt.org/

User-agent: *
Allow: /
Disallow: /owoembed
Disallow: /version

# --- Generative AI / LLM crawlers (explicitly allowed) ---
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: GoogleOther
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: cohere-training-data-crawler
Allow: /

User-agent: Bytespider
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: meta-externalfetcher
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: PetalBot
Allow: /

User-agent: Diffbot
Allow: /

User-agent: ImagesiftBot
Allow: /

# --- Sitemaps ---
Sitemap: https://fxkarotter.com/sitemap.xml
Sitemap: https://fxkarotter.jp/sitemap.xml
`);
});

karotter.get('/google78b62ccceaca698e.html', c =>
  c.text('google-site-verification: google78b62ccceaca698e.html')
);

karotter.get('/favicon.ico', async _c => {
  const res = await fetch('https://karotter.com/karotter-log.png');
  return new Response(res.body, {
    headers: { 'content-type': 'image/png', 'cache-control': 'public, max-age=604800' }
  });
});

karotter.get('/howtouse', howToUsePage);

/* LLM-friendly machine-readable summaries (proposed llms.txt standard) */
karotter.get('/llms.txt', llmsTxt);
karotter.get('/llms-full.txt', llmsFullTxt);

karotter.get('/sitemap.xml', c => {
  c.header('content-type', 'application/xml;charset=utf-8');
  c.header('cache-control', 'public, max-age=3600');
  c.header('x-robots-tag', 'noindex');
  const today = new Date().toISOString().slice(0, 10);
  return c.body(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://fxkarotter.com/howtouse</loc>
    <xhtml:link rel="alternate" hreflang="ja" href="https://fxkarotter.com/howtouse"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://fxkarotter.com/howtouse"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fxkarotter.jp/howtouse</loc>
    <xhtml:link rel="alternate" hreflang="ja" href="https://fxkarotter.jp/howtouse"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://fxkarotter.com/howtouse"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://fxkarotter.com/llms.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://fxkarotter.jp/llms.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://fxkarotter.com/llms-full.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://fxkarotter.jp/llms-full.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
</urlset>`);
});

/* Karotter post URL patterns */
karotter.get('/@:handle/posts/:id', karotterStatusRequest);
karotter.get('/@:handle/posts/:id/:language', karotterStatusRequest);
karotter.get('/posts/:id', karotterStatusRequest);
karotter.get('/posts/:id/:language', karotterStatusRequest);
karotter.get('/:handle/status/:id', karotterStatusRequest);
karotter.get('/:handle/status/:id/:language', karotterStatusRequest);
/* Without @ prefix (karotter.com/handle/posts/123) */
karotter.get('/:handle/posts/:id', karotterStatusRequest);
karotter.get('/:handle/posts/:id/:language', karotterStatusRequest);
/* Direct status by ID */
karotter.get('/status/:id', karotterStatusRequest);

/* Share links: Karotter appends /share for its crawler-facing SSR embed page.
   The trailing /share is a literal marker, not a language code — register it as
   a static segment so it wins over the /:language routes above. */
karotter.get('/@:handle/posts/:id/share', karotterStatusRequest);
karotter.get('/:handle/posts/:id/share', karotterStatusRequest);
karotter.get('/:handle/status/:id/share', karotterStatusRequest);
karotter.get('/posts/:id/share', karotterStatusRequest);
karotter.get('/status/:id/share', karotterStatusRequest);

/* Profile patterns */
karotter.get('/profile/:handle', karotterProfileRequest);
karotter.get('/@:handle', karotterProfileRequest);

/* Catch-all: try to match common patterns, otherwise redirect to karotter.com */
karotter.all('*', async c => {
  const url = new URL(c.req.url);
  const path = url.pathname;

  /* Root (with or without trailing slash) → GitHub repo */
  if (path === '/' || path === '' || path === '//') {
    return c.redirect('https://github.com/cUDGk/fxkarotter', 302);
  }

  /* Try to extract post ID from various URL patterns */
  const postMatch = path.match(/\/(\d+)\s*$/);
  if (postMatch) {
    /* URL ends with a number - treat as post ID */
    const segments = path.split('/').filter(Boolean);
    if (segments.length >= 1) {
      /* Rewrite internally to /posts/:id */
      const id = postMatch[1];
      const handle = segments.length >= 2 ? segments[0] : null;
      c.req.addValidatedData('param', {
        id,
        handle: handle || undefined
      });
      return karotterStatusRequest(c);
    }
  }

  return c.redirect(`${getKarotterRoot(c)}${path}`, 302);
});
