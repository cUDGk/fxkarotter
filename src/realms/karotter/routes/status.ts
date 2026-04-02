import { Context } from 'hono';
import { handleStatus } from '../../../embed/status';
import { DataProvider } from '../../../enum';
import { Constants } from '../../../constants';
import { Strings } from '../../../strings';
import { InputFlags } from '../../../types/types';

export const karotterStatusRequest = async (c: Context) => {
  console.log('Karotter status request');
  const { handle, id, language } = c.req.param();
  const actualId = id.match(/\d+/g)?.[0] ?? '';

  const userAgent = c.req.header('User-Agent') || '';
  const url = new URL(c.req.url);
  const flags: InputFlags = { noActivity: true };

  /* Build the original karotter.com URL for redirects */
  const karotterUrl = handle
    ? `${Constants.KAROTTER_ROOT}/@${handle}/posts/${actualId}`
    : `${Constants.KAROTTER_ROOT}/posts/${actualId}`;

  if (url.pathname.match(/\/posts\/\d+\.(mp4|png|jpe?g|gifv?)/g)) {
    console.log('Direct media request by extension');
    flags.direct = true;
  } else if (Constants.DIRECT_MEDIA_DOMAINS.includes(url.hostname)) {
    console.log('Direct media request by domain');
    flags.direct = true;
  } else if (Constants.TEXT_ONLY_DOMAINS.includes(url.hostname)) {
    console.log('Text-only embed request');
    flags.textOnly = true;
  }

  const isBotUA = userAgent.match(Constants.BOT_UA_REGEX) !== null || flags?.archive;

  if (isBotUA || flags.direct || flags.api) {
    if (isBotUA) {
      console.log(`Matched bot UA ${userAgent}`);
    } else {
      console.log(`Bypass bot check (Presented user-agent ${userAgent})`);
    }

    const statusResponse = await handleStatus(
      c,
      actualId,
      handle || null,
      undefined,
      userAgent,
      flags,
      language,
      DataProvider.Karotter
    );

    if (statusResponse) {
      if (!isBotUA && !flags.api && !flags.direct) {
        return c.redirect(
          karotterUrl,
          302
        );
      }
      c.status(200);
      return statusResponse;
    } else {
      return c.text(Strings.ERROR_UNKNOWN, 500);
    }
  } else {
    console.log('Matched human UA', userAgent);
    return c.redirect(
      karotterUrl,
      302
    );
  }
};
