import { Hono } from 'hono';
import { karotterStatusRequest } from './routes/status';
import { karotterProfileRequest } from './routes/profile';
import { howToUsePage } from './routes/howtouse';
import { oembed } from '../api/routes/oembed';
import { versionRoute } from '../common/version';
import { Constants } from '../../constants';
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
karotter.get('/robots.txt', c => c.text('User-agent: *\nAllow: /\n\nSitemap: https://fxkarotter.com/sitemap.xml'));
karotter.get('/howtouse', howToUsePage);
karotter.get('/sitemap.xml', c => {
  c.header('content-type', 'application/xml');
  return c.body(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://fxkarotter.com/howtouse</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://fxkarotter.jp/howtouse</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
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

/* Profile patterns */
karotter.get('/profile/:handle', karotterProfileRequest);
karotter.get('/@:handle', karotterProfileRequest);

/* Catch-all: try to match common patterns, otherwise redirect to karotter.com */
karotter.all('*', async c => {
  const url = new URL(c.req.url);
  const path = url.pathname;

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
