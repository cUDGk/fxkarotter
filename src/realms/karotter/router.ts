import { Hono } from 'hono';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { karotterStatusRequest } from './routes/status';
import { versionRoute } from '../common/version';
import { getBranding } from '../../helpers/branding';

export const karotter = new Hono();

karotter.use(trimTrailingSlash());

/* Karotter post URL patterns:
   karotter.com/@username/posts/123
   karotter.com/posts/123 (direct post ID) */
karotter.get('/@:handle/posts/:id', karotterStatusRequest);
karotter.get('/@:handle/posts/:id/:language', karotterStatusRequest);
karotter.get('/posts/:id', karotterStatusRequest);
karotter.get('/posts/:id/:language', karotterStatusRequest);
karotter.get('/version', c => versionRoute(c));

karotter.all('*', async c => c.redirect(getBranding(c).redirect, 302));
