import { Context } from 'hono';
import { buildAPIKarotterPost } from './processor';
import { Constants } from '../../constants';
import { getKarotterRoot } from '../../helpers/karotter';

interface KarotterPostResponse {
  post: KarotterRawPost;
}

export interface KarotterRawPost {
  id: number;
  content: string;
  createdAt: string;
  parentId: number | null;
  author: {
    id: number;
    username: string;
    displayName: string;
    avatarUrl: string;
    isPrivate: boolean;
    officialMark: string[] | null;
    isParodyAccount: boolean;
    isBotAccount: boolean;
  };
  mediaUrls: string[];
  mediaAlts: string[];
  mediaWidths: number[];
  mediaHeights: number[];
  mediaSpoilerFlags: boolean[];
  mediaR18Flags: boolean[];
  mediaTypes?: string[];
  likesCount: number;
  rekarotsCount: number;
  repliesCount: number;
  bookmarksCount: number;
  viewsCount: number;
  reactionSummary: { emoji: string; count: number }[];
  visibility: string;
  quotedPost: KarotterRawPost | null;
  poll: {
    options: { id: number; text: string; percentage: number }[];
    totalVotes: number;
    isExpired: boolean;
    expiresAt: string;
  } | null;
}

type KarotterFetchResult =
  | { post: KarotterRawPost }
  /* restricted = API returned 403 (age/sensitivity-filtered post). Karotter
     still exposes embed OG tags publicly on its SSR /share page, so the caller
     can fall back to scraping those. */
  | { post: null; restricted: boolean };

const fetchKarotterPost = async (postId: string): Promise<KarotterFetchResult> => {
  const url = `${Constants.KAROTTER_API_ROOT}/posts/${postId}`;

  console.log('Fetching Karotter post:', url);
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'FxKarotter/1.0 (Embed Bot)'
    }
  });

  if (!res.ok) {
    console.log('Karotter fetch failed:', res.status, await res.text());
    return { post: null, restricted: res.status === 403 };
  }

  const data = (await res.json()) as KarotterPostResponse;
  return { post: data.post };
};

const decodeEntities = (s: string): string =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const metaContent = (html: string, prop: string): string => {
  /* Match <meta property="og:x" content="..."> or the name="..." variant.
     [^"]* spans newlines, so multi-line og:description is captured intact. */
  const m = html.match(
    new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`, 'i')
  );
  return m ? decodeEntities(m[1]) : '';
};

/* Fallback for age-restricted posts: scrape the public SSR /share page and build
   a minimal raw post from its OG tags. Karotter only exposes the author avatar
   (not the gated media) for these, so we mirror that — text + avatar, no media. */
const fetchKarotterShareFallback = async (
  c: Context,
  handle: string,
  postId: string
): Promise<KarotterRawPost | null> => {
  const url = `${getKarotterRoot(c)}/${handle}/status/${postId}/share`;
  console.log('Karotter share fallback:', url);
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; FxKarotter/1.0; +embed)' }
  });
  if (!res.ok) return null;

  const html = await res.text();
  const title = metaContent(html, 'og:title');
  const content = metaContent(html, 'og:description');
  const image = metaContent(html, 'og:image');
  if (!title && !content) return null;

  /* SSR title format: "DisplayName (@username)" */
  const m = title.match(/^(.*) \(@(.+)\)$/);
  const displayName = m?.[1] ?? handle;
  const username = m?.[2] ?? handle;

  /* og:image is the avatar for filtered posts (path /avatars/), real media
     (/posts/) for others. Only treat the latter as post media. */
  const isAvatar = /\/avatars?\//i.test(image);

  return {
    id: Number(postId),
    content,
    createdAt: '',
    parentId: null,
    author: {
      id: 0,
      username,
      displayName,
      avatarUrl: isAvatar ? image : '',
      isPrivate: false,
      officialMark: null,
      isParodyAccount: false,
      isBotAccount: false
    },
    mediaUrls: !isAvatar && image ? [image] : [],
    mediaAlts: [],
    mediaWidths: [],
    mediaHeights: [],
    mediaSpoilerFlags: [],
    mediaR18Flags: [],
    mediaTypes: !isAvatar && image ? ['image'] : [],
    likesCount: 0,
    rekarotsCount: 0,
    repliesCount: 0,
    bookmarksCount: 0,
    viewsCount: 0,
    reactionSummary: [],
    visibility: 'public',
    quotedPost: null,
    poll: null
  };
};

export const constructKarotterThread = async (
  id: string,
  authorHandle: string | null,
  _processThread: boolean,
  c: Context,
  _language: string | undefined
): Promise<SocialThread> => {
  const response = await fetchKarotterPost(id);

  let post = response.post;
  /* Age-restricted post (API 403): fall back to the public SSR /share OG tags.
     Needs the handle to build the /share URL; the bare /posts/:id form lacks it. */
  if (!post && response.restricted && authorHandle) {
    post = await fetchKarotterShareFallback(c, authorHandle, id);
  }

  if (!post) {
    return {
      status: null,
      thread: [],
      author: null,
      code: 404
    };
  }

  const apiStatus = buildAPIKarotterPost(c, post);

  return {
    status: apiStatus,
    thread: [apiStatus],
    author: apiStatus.author,
    code: 200
  };
};
