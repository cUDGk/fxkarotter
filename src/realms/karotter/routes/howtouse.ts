import { Context } from 'hono';

const SITE_NAME = 'FxKarotter';
const TITLE = 'FxKarotter — Karotterの投稿をDiscordで埋め込み表示';
const SUMMARY_LONG =
  'FxKarotter は、Karotter（高校生が作った日本の SNS）の投稿リンクを Discord・Telegram・Slack などのチャットアプリに貼ったときに、テキスト・画像・いいね数・閲覧数を自動でプレビュー展開する、無料・オープンソース・ログ非収集のリンク埋め込み修正サービスです。FxTwitter／FxEmbed の Karotter 版で、URL のドメインを karotter.com から fxkarotter.com に書き換えるだけで動作します。';
const SUMMARY_SHORT =
  'Karotterの投稿リンクをDiscord等で埋め込み表示するための無料サービス。URLのkarotter.comをfxkarotter.comに変えるだけ。';
const KEYWORDS =
  'fxkarotter,fx.karotter,karotter,カロッター,カロート,fxtwitter,fxembed,Discord 埋め込み,Telegram 埋め込み,リンクプレビュー,SNS embed';
const OG_IMAGE = 'https://karotter.com/karotter-log.png';

export const howToUsePage = async (c: Context) => {
  const url = new URL(c.req.url);
  const host = url.hostname;
  const origin = `https://${host}`;
  const otherHost = host === 'fxkarotter.com' ? 'fxkarotter.jp' : 'fxkarotter.com';
  const otherOrigin = `https://${otherHost}`;
  const pageUrl = `${origin}/howtouse`;
  const otherPageUrl = `${otherOrigin}/howtouse`;

  const jsonLd: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${origin}/#website`,
      'name': SITE_NAME,
      'alternateName': 'fx.karotter',
      'url': origin,
      'inLanguage': 'ja-JP',
      'description': SUMMARY_SHORT,
      'publisher': { '@type': 'Person', 'name': 'cUDGk', 'url': 'https://github.com/cUDGk' }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': SITE_NAME,
      'operatingSystem': 'Web',
      'applicationCategory': 'UtilitiesApplication',
      'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'JPY' },
      'url': origin,
      'sameAs': [
        'https://fxkarotter.com',
        'https://fxkarotter.jp',
        'https://github.com/cUDGk/fxkarotter'
      ],
      'downloadUrl': 'https://github.com/cUDGk/fxkarotter',
      'license': 'https://opensource.org/licenses/MIT',
      'softwareVersion': '1.0',
      'author': { '@type': 'Person', 'name': 'cUDGk', 'url': 'https://github.com/cUDGk' },
      'isBasedOn': 'https://github.com/FxEmbed/FxEmbed',
      'description': SUMMARY_LONG,
      'image': OG_IMAGE
    },
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': 'KarotterのリンクをDiscord等で埋め込み展開する手順',
      'description':
        'URL のドメインを karotter.com (または karotter.jp) から fxkarotter.com (または fxkarotter.jp) に書き換えるだけで、Discord・Telegram 等にプレビューが展開されます。',
      'totalTime': 'PT5S',
      'step': [
        {
          '@type': 'HowToStep',
          'position': 1,
          'name': '元のリンクをコピー',
          'text':
            'Karotter の投稿ページの URL をコピーする (例: https://karotter.com/@user/posts/12345 )',
          'url': `${pageUrl}#step-1`
        },
        {
          '@type': 'HowToStep',
          'position': 2,
          'name': 'ドメインを書き換える',
          'text':
            'karotter.com を fxkarotter.com に変える (例: https://fxkarotter.com/user/status/12345 )',
          'url': `${pageUrl}#step-2`
        },
        {
          '@type': 'HowToStep',
          'position': 3,
          'name': 'Discord に貼る',
          'text':
            'チャットに送信すると、テキスト・画像・いいね数・閲覧数のプレビューが自動展開される',
          'url': `${pageUrl}#step-3`
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': 'FxKarotterって何？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              'KarotterのリンクをDiscordやTelegramに貼ったときに、投稿の中身・画像・いいね数・閲覧数を自動で表示する、無料・オープンソースのリンクプレビュー修正サービス。FxTwitter のKarotter版。'
          }
        },
        {
          '@type': 'Question',
          'name': 'どうやって使う？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              'URL の karotter.com (または karotter.jp) を fxkarotter.com (または fxkarotter.jp) に変えてDiscordに貼るだけ。アカウント登録もアプリインストールも不要。'
          }
        },
        {
          '@type': 'Question',
          'name': '無料？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': '完全無料。広告もトラッキングもログ収集もない。'
          }
        },
        {
          '@type': 'Question',
          'name': '.com と .jp の違いは？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              '中身は完全に同じ。.jp は karotter.jp に、.com は karotter.com にリダイレクトする点だけが違う。'
          }
        },
        {
          '@type': 'Question',
          'name': 'ブラウザで開いたらどうなる？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              '対応する Karotter 本体にリダイレクトされる（fxkarotter.jp → karotter.jp、fxkarotter.com → karotter.com）。'
          }
        },
        {
          '@type': 'Question',
          'name': 'Karotterって何？',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text':
              '日本の高校生が作った Twitter 風 SNS。短文（カロート）を投稿する。https://karotter.com'
          }
        }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': SITE_NAME, 'item': origin },
        { '@type': 'ListItem', 'position': 2, 'name': '使い方', 'item': pageUrl }
      ]
    }
  ];
  const ldScripts = jsonLd
    .map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n  ');

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
  <title>${TITLE}</title>
  <meta name="description" content="${SUMMARY_SHORT}"/>
  <meta name="keywords" content="${KEYWORDS}"/>
  <meta name="author" content="cUDGk"/>
  <meta name="generator" content="FxEmbed (Cloudflare Workers)"/>
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"/>
  <meta name="googlebot" content="index, follow"/>
  <meta name="bingbot" content="index, follow"/>
  <meta name="theme-color" content="#fafafa" media="(prefers-color-scheme: light)"/>
  <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)"/>
  <meta name="color-scheme" content="light dark"/>
  <meta http-equiv="content-language" content="ja"/>
  <link rel="canonical" href="${pageUrl}"/>
  <link rel="alternate" hreflang="ja" href="${pageUrl}"/>
  <link rel="alternate" hreflang="ja-JP" href="${pageUrl}"/>
  <link rel="alternate" hreflang="x-default" href="https://fxkarotter.com/howtouse"/>
  <meta property="og:type" content="website"/>
  <meta property="og:site_name" content="${SITE_NAME}"/>
  <meta property="og:title" content="${TITLE}"/>
  <meta property="og:description" content="${SUMMARY_SHORT}"/>
  <meta property="og:url" content="${pageUrl}"/>
  <meta property="og:image" content="${OG_IMAGE}"/>
  <meta property="og:image:alt" content="Karotter logo"/>
  <meta property="og:locale" content="ja_JP"/>
  <meta name="twitter:card" content="summary"/>
  <meta name="twitter:title" content="${TITLE}"/>
  <meta name="twitter:description" content="${SUMMARY_SHORT}"/>
  <meta name="twitter:image" content="${OG_IMAGE}"/>
  <meta name="twitter:image:alt" content="Karotter logo"/>
  <link rel="icon" type="image/png" href="https://karotter.com/karotter-log.png"/>
  <link rel="apple-touch-icon" href="https://karotter.com/karotter-log.png"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  ${ldScripts}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Noto+Sans+JP:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    h1, h2, h3, h4, h5, h6 { font-weight: inherit; font-size: inherit; }
    ul, ol, dl { list-style: none; }
    body {
      font-family: 'Noto Sans JP', sans-serif;
      font-weight: 300;
      background: #fafafa;
      color: #1a1a1a;
      min-height: 100vh;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: radial-gradient(#ddd 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
      z-index: -1;
    }
    .wrap { max-width: 500px; margin: 0 auto; padding: 56px 20px 72px; }

    .logo {
      font-family: 'Space Mono', monospace;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .logo .dot { color: #e33; }
    .tagline {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      color: #aaa;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin: 4px 0 32px;
    }
    .lead { font-size: 13px; color: #555; line-height: 1.9; margin: 0 0 32px; }

    .domains { display: flex; gap: 0; margin: 0 0 36px; }
    .domains a {
      flex: 1;
      display: block;
      border: 1.5px solid #1a1a1a;
      padding: 12px 0;
      text-align: center;
      color: #1a1a1a;
      text-decoration: none;
      font-family: 'Space Mono', monospace;
      font-size: 13px;
      letter-spacing: 0.5px;
      transition: all 0.1s;
    }
    .domains a + a { border-left: none; }
    .domains a:hover { background: #1a1a1a; color: #fff; }

    .label {
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      color: #e33;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin: 36px 0 12px;
    }

    p { font-size: 14px; color: #555; line-height: 1.9; }
    a:not(.domains a):not(footer a) { color: #e33; text-decoration: none; }

    .box { border: 1.5px solid #ddd; margin: 16px 0; }
    .box-row {
      display: flex;
      padding: 10px 14px;
      border-bottom: 1.5px solid #ddd;
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      align-items: center;
      gap: 12px;
    }
    .box-row:last-child { border-bottom: none; }
    .box-tag { font-size: 9px; letter-spacing: 1px; color: #bbb; width: 24px; flex-shrink: 0; }
    .box-row.out { background: #f4f4f4; }
    .box-row.out .box-val b { color: #e33; }
    .box-val { color: #888; }
    .box-val b { color: #1a1a1a; font-weight: 400; }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      border: 1.5px solid #ddd;
      margin: 16px 0;
    }
    .grid li { padding: 16px 12px; text-align: center; border-right: 1.5px solid #ddd; }
    .grid li:last-child { border-right: none; }
    .grid-icon { font-size: 18px; }
    .grid-lbl {
      font-family: 'Space Mono', monospace;
      font-size: 8px;
      color: #bbb;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-top: 4px;
    }

    .routes { margin: 12px 0; }
    .route {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 1px solid #eee;
      font-size: 12px;
    }
    .route dt, .route dd { display: inline; margin: 0; }
    .route code { font-family: 'Space Mono', monospace; color: #1a1a1a; background: transparent; padding: 0; }
    .route .route-desc { color: #ccc; font-family: 'Space Mono', monospace; font-size: 10px; }

    .divider { height: 1px; border: 0; background: #ddd; margin: 40px 0; }

    .qa { margin: 0; }
    .qa-item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .qa-q { font-size: 13px; color: #1a1a1a; font-weight: 400; margin: 0; }
    .qa-a { font-size: 12px; color: #aaa; margin: 2px 0 0; }

    footer {
      margin-top: 48px;
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      color: #ccc;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    footer a { color: #aaa; text-decoration: none; }
    footer a:hover { color: #e33; }

    @media (max-width: 480px) {
      .grid { grid-template-columns: 1fr 1fr; }
      .grid li:nth-child(2) { border-right: none; }
      .grid li:nth-child(1), .grid li:nth-child(2) { border-bottom: 1.5px solid #ddd; }
    }
    @media (prefers-color-scheme: dark) {
      body { background: #0f0f0f; color: #f0f0f0; }
      body::before { background-image: radial-gradient(#222 1px, transparent 1px); }
      .domains a { border-color: #f0f0f0; color: #f0f0f0; }
      .domains a:hover { background: #f0f0f0; color: #0f0f0f; }
      p { color: #aaa; }
      .lead { color: #bbb; }
      .box, .grid { border-color: #2a2a2a; }
      .box-row { border-color: #2a2a2a; }
      .box-row.out { background: #1a1a1a; }
      .box-val b { color: #f0f0f0; }
      .grid li { border-color: #2a2a2a; }
      .route { border-color: #1f1f1f; }
      .route code { color: #f0f0f0; }
      .qa-item { border-color: #1f1f1f; }
      .qa-q { color: #f0f0f0; }
      .divider { background: #2a2a2a; }
    }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  </style>
</head>
<body>
  <main class="wrap">
    <header>
      <h1 class="logo">fx<span class="dot">.</span>karotter</h1>
      <p class="tagline">embed karotter posts everywhere</p>
    </header>

    <p class="lead">${SUMMARY_LONG}</p>

    <nav class="domains" aria-label="Karotterを開く">
      <a href="https://karotter.com" rel="external">karotter.com</a>
      <a href="https://karotter.jp" rel="external">karotter.jp</a>
    </nav>

    <section aria-labelledby="h-about">
      <h2 id="h-about" class="label">About</h2>
      <p><a href="https://karotter.com">Karotter</a>のリンクをDiscordに貼っても中身が見えない。<br>ドメインを変えるだけで見えるようになる。</p>
    </section>

    <section aria-labelledby="h-convert">
      <h2 id="h-convert" class="label">Convert</h2>
      <div class="box">
        <div class="box-row" id="step-1"><span class="box-tag">IN</span><span class="box-val"><b>karotter.com</b>/@user/posts/12345</span></div>
        <div class="box-row out" id="step-2"><span class="box-tag">OUT</span><span class="box-val"><b>fxkarotter.com</b>/user/status/12345</span></div>
      </div>
    </section>

    <section aria-labelledby="h-output">
      <h2 id="h-output" class="label">Output</h2>
      <ul class="grid" role="list">
        <li><div class="grid-icon" aria-hidden="true">📝</div><div class="grid-lbl">Text</div></li>
        <li><div class="grid-icon" aria-hidden="true">🖼</div><div class="grid-lbl">Image</div></li>
        <li><div class="grid-icon" aria-hidden="true">❤️</div><div class="grid-lbl">Likes</div></li>
        <li><div class="grid-icon" aria-hidden="true">👁</div><div class="grid-lbl">Views</div></li>
      </ul>
    </section>

    <section aria-labelledby="h-routes">
      <h2 id="h-routes" class="label">Routes</h2>
      <dl class="routes">
        <div class="route"><dt><code>/user/status/123</code></dt><dd class="route-desc">short</dd></div>
        <div class="route"><dt><code>/@user/posts/123</code></dt><dd class="route-desc">official</dd></div>
        <div class="route"><dt><code>/posts/123</code></dt><dd class="route-desc">id only</dd></div>
        <div class="route"><dt><code>/profile/user</code></dt><dd class="route-desc">profile</dd></div>
      </dl>
    </section>

    <hr class="divider"/>

    <section aria-labelledby="h-faq">
      <h2 id="h-faq" class="label">FAQ</h2>
      <dl class="qa">
        <div class="qa-item"><dt class="qa-q">金かかる？</dt><dd class="qa-a">No. 無料。</dd></div>
        <div class="qa-item"><dt class="qa-q">.com と .jp の違い</dt><dd class="qa-a">ない。同じ。</dd></div>
        <div class="qa-item"><dt class="qa-q">ブラウザで開くと？</dt><dd class="qa-a">対応するKarotterにリダイレクト（.jp→karotter.jp、.com→karotter.com）。</dd></div>
        <div class="qa-item"><dt class="qa-q">ログ</dt><dd class="qa-a">取ってない。</dd></div>
        <div class="qa-item"><dt class="qa-q">Karotterって？</dt><dd class="qa-a">高校生が作ったSNS → <a href="https://karotter.com">karotter.com</a></dd></div>
      </dl>
    </section>

    <hr class="divider"/>

    <footer>
      <a href="https://github.com/cUDGk/fxkarotter" rel="noopener">SOURCE</a>
      <span>BASED ON <a href="https://github.com/FxEmbed/FxEmbed" rel="noopener">FXEMBED</a></span>
      <span>MIT</span>
    </footer>
  </main>
</body>
</html>`;

  c.header('content-type', 'text/html;charset=utf-8');
  c.header('cache-control', 'public, max-age=3600, s-maxage=86400');
  c.header('x-robots-tag', 'index, follow, max-snippet:-1, max-image-preview:large');
  c.header(
    'link',
    `<${pageUrl}>; rel="canonical", <${otherPageUrl}>; rel="alternate"; hreflang="ja"`
  );
  return c.html(html);
};
