import { Context } from 'hono';
import { Constants } from '../../constants';
import { DataProvider } from '../../enum';
import { KarotterRawPost } from './conversation';
import type { APIKarotterStatus } from '../../types/apiStatus';

const resolveMediaUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${Constants.KAROTTER_ROOT}${url}`;
};

export const buildAPIKarotterPost = (
  _c: Context,
  post: KarotterRawPost
): APIKarotterStatus => {
  const apiStatus: APIKarotterStatus = {} as APIKarotterStatus;

  apiStatus.id = String(post.id);
  apiStatus.text = post.content || '';

  if (post.author) {
    apiStatus.author = {
      id: String(post.author.id),
      name: post.author.displayName || post.author.username,
      screen_name: post.author.username,
      avatar_url: resolveMediaUrl(post.author.avatarUrl),
      banner_url: '',
      description: '',
      raw_description: { text: '', facets: [] },
      location: '',
      followers: 0,
      following: 0,
      media_count: 0,
      likes: 0,
      url: `${Constants.KAROTTER_ROOT}/@${post.author.username}`,
      protected: post.author.isPrivate,
      statuses: 0,
      joined: '',
      birthday: { day: 0, month: 0, year: 0 },
      website: { url: '', display_url: '' }
    };
  }

  apiStatus.created_at = post.createdAt;
  apiStatus.media = {};

  /* Process media */
  const photos: APIPhoto[] = [];
  const videos: APIVideo[] = [];

  if (post.mediaUrls && post.mediaUrls.length > 0) {
    post.mediaUrls.forEach((url, i) => {
      const fullUrl = resolveMediaUrl(url);
      const alt = post.mediaAlts?.[i] || '';
      const width = post.mediaWidths?.[i] || 0;
      const height = post.mediaHeights?.[i] || 0;
      const mediaType = post.mediaTypes?.[i] || 'image';

      if (mediaType === 'video') {
        videos.push({
          type: 'video',
          url: fullUrl,
          format: 'video/mp4',
          thumbnail_url: '',
          formats: [{ url: fullUrl, container: 'mp4' as const, codec: 'h264' as const }],
          width: width,
          height: height,
          duration: 0
        });
      } else {
        photos.push({
          type: 'photo',
          url: fullUrl,
          altText: alt,
          width: width,
          height: height
        });
      }
    });
  }

  if (photos.length > 0) {
    apiStatus.media.photos = photos;
    apiStatus.embed_card = 'summary_large_image';
  }
  if (videos.length > 0) {
    apiStatus.media.videos = videos;
    apiStatus.embed_card = 'player';
  }

  apiStatus.media.all = [...photos, ...videos];

  /* Engagement stats */
  apiStatus.likes = post.likesCount || 0;
  apiStatus.reposts = post.rekarotsCount || 0;
  apiStatus.replies = post.repliesCount || 0;
  apiStatus.views = post.viewsCount || 0;
  apiStatus.bookmarks = post.bookmarksCount || 0;

  /* Quoted post */
  if (post.quotedPost) {
    apiStatus.quote = buildAPIKarotterPost(_c, post.quotedPost);
    if (apiStatus.quote.embed_card && !apiStatus.embed_card) {
      apiStatus.embed_card = apiStatus.quote.embed_card;
    }
  }

  /* Poll */
  if (post.poll) {
    apiStatus.poll = {
      choices: post.poll.options.map(opt => ({
        label: opt.text,
        count: 0,
        percentage: opt.percentage
      })),
      total_votes: post.poll.totalVotes,
      time_left_en: post.poll.isExpired ? 'Final results' : 'Voting'
    };
  }

  apiStatus.source = 'Karotter';
  apiStatus.url = `${Constants.KAROTTER_ROOT}/@${post.author.username}/posts/${post.id}`;
  apiStatus.provider = DataProvider.Karotter;
  apiStatus.lang = 'ja';

  console.log('Built Karotter APIStatus:', apiStatus.id);

  return apiStatus;
};
