import { Context } from 'hono';
import { buildAPIKarotterPost } from './processor';
import { Constants } from '../../constants';

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

const fetchKarotterPost = async (postId: string): Promise<KarotterPostResponse | null> => {
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
    return null;
  }

  return await res.json();
};

export const constructKarotterThread = async (
  id: string,
  _authorHandle: string | null,
  _processThread: boolean,
  c: Context,
  _language: string | undefined
): Promise<SocialThread> => {
  const response = await fetchKarotterPost(id);

  if (!response || !response.post) {
    return {
      status: null,
      thread: [],
      author: null,
      code: 404
    };
  }

  const post = response.post;
  const apiStatus = buildAPIKarotterPost(c, post);

  return {
    status: apiStatus,
    thread: [apiStatus],
    author: apiStatus.author,
    code: 200
  };
};
