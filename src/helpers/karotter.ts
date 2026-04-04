import { Context } from 'hono';
import { Constants } from '../constants';

/** Returns karotter.jp or karotter.com based on the request domain */
export const getKarotterRoot = (c: Context): string => {
  try {
    const host = new URL(c.req.url).hostname;
    if (host.endsWith('.jp')) {
      return Constants.KAROTTER_ROOT_JP;
    }
  } catch (_e) { /* fallback */ }
  return Constants.KAROTTER_ROOT;
};
