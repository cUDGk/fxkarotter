import { Hono } from 'hono';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { karotterStatusRequest } from './routes/status';
import { karotterProfileRequest } from './routes/profile';
import { versionRoute } from '../common/version';
import { Constants } from '../../constants';

export const karotter = new Hono();

karotter.use(trimTrailingSlash());

/* Karotter post URL patterns:
   karotter.com/@username/posts/123
   karotter.com/posts/123 (direct post ID)
   karotter.com/username/status/123 (Twitter-style) */
karotter.get('/@:handle/posts/:id', karotterStatusRequest);
karotter.get('/@:handle/posts/:id/:language', karotterStatusRequest);
karotter.get('/posts/:id', karotterStatusRequest);
karotter.get('/posts/:id/:language', karotterStatusRequest);
karotter.get('/:handle/status/:id', karotterStatusRequest);
karotter.get('/:handle/status/:id/:language', karotterStatusRequest);
karotter.get('/profile/:handle', karotterProfileRequest);
karotter.get('/@:handle', karotterProfileRequest);
karotter.get('/version', c => versionRoute(c));

karotter.all('*', async c => {
  const url = new URL(c.req.url);
  return c.redirect(`${Constants.KAROTTER_ROOT}${url.pathname}`, 302);
});
