import { Context } from 'hono';
import { Constants } from '../../../constants';

export const karotterProfileRequest = async (c: Context) => {
  const { handle } = c.req.param();
  const userAgent = c.req.header('User-Agent') || '';
  const isBotUA = userAgent.match(Constants.BOT_UA_REGEX) !== null;

  if (!isBotUA) {
    return c.redirect(`${Constants.KAROTTER_ROOT}/profile/${handle}`, 302);
  }

  try {
    const res = await fetch(`${Constants.KAROTTER_API_ROOT}/users/${handle}`);
    if (!res.ok) {
      return c.redirect(`${Constants.KAROTTER_ROOT}/profile/${handle}`, 302);
    }

    const data = (await res.json()) as {
      user: {
        displayName: string;
        username: string;
        bio: string;
        avatarUrl: string;
        headerUrl: string;
        followersCount: number;
        followingCount: number;
        postsCount: number;
        location: string;
      };
    };
    const user = data.user;

    const avatarUrl = user.avatarUrl
      ? `${Constants.KAROTTER_ROOT}${user.avatarUrl}`
      : '';
    const description =
      user.bio ||
      `${user.postsCount} カロート · ${user.followersCount} フォロワー · ${user.followingCount} フォロー中`;

    const headers = [
      `<!DOCTYPE html>`,
      `<html>`,
      `<head>`,
      `<meta charset="utf-8"/>`,
      `<meta property="og:title" content="${user.displayName} (@${user.username})"/>`,
      `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}"/>`,
      `<meta property="og:url" content="${Constants.KAROTTER_ROOT}/profile/${user.username}"/>`,
      `<meta property="og:site_name" content="FxKarotter"/>`,
      `<meta property="og:type" content="profile"/>`,
      `<meta property="theme-color" content="#6363ff"/>`,
      `<meta name="twitter:card" content="summary"/>`,
      `<meta name="twitter:title" content="${user.displayName} (@${user.username})"/>`,
      `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}"/>`
    ];

    if (avatarUrl) {
      headers.push(`<meta property="og:image" content="${avatarUrl}"/>`);
      headers.push(`<meta name="twitter:image" content="${avatarUrl}"/>`);
    }

    headers.push(
      `<meta http-equiv="refresh" content="0;url=${Constants.KAROTTER_ROOT}/profile/${user.username}"/>`,
      `</head>`,
      `<body></body>`,
      `</html>`
    );

    return c.html(headers.join('\n'));
  } catch (_e) {
    return c.redirect(`${Constants.KAROTTER_ROOT}/profile/${handle}`, 302);
  }
};
