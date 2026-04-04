import { Context } from 'hono';

export const howToUsePage = async (c: Context) => {
  const host = new URL(c.req.url).hostname;
  const origin = `https://${host}`;
  const otherDomain = host === 'fxkarotter.com' ? 'fxkarotter.jp' : 'fxkarotter.com';

  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>FxKarotter</title>
  <meta name="description" content="カロッターのリンクをDiscordに貼ったときに中身が見えるやつ。URLを変えるだけ。"/>
  <meta name="robots" content="index, follow"/>
  <link rel="canonical" href="${origin}/howtouse"/>
  <link rel="alternate" hreflang="ja" href="https://${otherDomain}/howtouse"/>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="FxKarotter"/>
  <meta property="og:description" content="カロッターのリンクをDiscordに貼ったときに中身が見えるやつ"/>
  <meta property="og:url" content="${origin}/howtouse"/>
  <meta name="twitter:card" content="summary"/>
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"FAQPage","mainEntity":[
    {"@type":"Question","name":"FxKarotterって何？","acceptedAnswer":{"@type":"Answer","text":"KarotterのリンクをDiscordやTelegramに貼ったときに、投稿の中身・画像・いいね数とかを自動で表示してくれるやつ。FxTwitterのKarotter版。"}},
    {"@type":"Question","name":"使い方は？","acceptedAnswer":{"@type":"Answer","text":"URLのkarotter.com(またはkarotter.jp)をfxkarotter.com(またはfxkarotter.jp)に変えてDiscordに貼るだけ。"}},
    {"@type":"Question","name":"無料？","acceptedAnswer":{"@type":"Answer","text":"無料。広告もトラッキングもない。"}},
    {"@type":"Question","name":"Karotterって何？","acceptedAnswer":{"@type":"Answer","text":"日本の高校生が作ったSNS。Twitterみたいに短文(カロート)を投稿する。karotter.com"}}
  ]}
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Noto+Sans+JP:wght@300;400&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
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
      top: 0; left: 0; right: 0; bottom: 0;
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
      margin: 4px 0 40px;
    }

    .domains {
      display: flex;
      gap: 0;
      margin: 0 0 36px;
    }
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
    a:not(.domains a) { color: #e33; text-decoration: none; }

    .box {
      border: 1.5px solid #ddd;
      margin: 16px 0;
    }
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
    .box-tag {
      font-size: 9px;
      letter-spacing: 1px;
      color: #bbb;
      width: 24px;
      flex-shrink: 0;
    }
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
    .grid-item {
      padding: 16px 12px;
      text-align: center;
      border-right: 1.5px solid #ddd;
    }
    .grid-item:last-child { border-right: none; }
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
    .route-path { font-family: 'Space Mono', monospace; color: #1a1a1a; }
    .route-desc { color: #ccc; font-family: 'Space Mono', monospace; font-size: 10px; }

    .divider {
      height: 1px;
      background: #ddd;
      margin: 40px 0;
    }

    .qa-item { padding: 10px 0; border-bottom: 1px solid #eee; }
    .qa-q { font-size: 13px; color: #1a1a1a; font-weight: 400; }
    .qa-a { font-size: 12px; color: #aaa; margin-top: 2px; }

    footer {
      margin-top: 48px;
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      color: #ccc;
      letter-spacing: 1px;
      display: flex;
      justify-content: space-between;
    }
    footer a { color: #aaa; text-decoration: none; }
    footer a:hover { color: #e33; }

    @media (max-width: 480px) {
      .grid { grid-template-columns: 1fr 1fr; }
      .grid-item:nth-child(2) { border-right: none; }
      .grid-item:nth-child(1), .grid-item:nth-child(2) { border-bottom: 1.5px solid #ddd; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo">fx<span class="dot">.</span>karotter</div>
    <div class="tagline">embed karotter posts everywhere</div>

    <div class="domains">
      <a href="https://fxkarotter.com">fxkarotter.com</a>
      <a href="https://fxkarotter.jp">fxkarotter.jp</a>
    </div>

    <div class="label">About</div>
    <p><a href="https://karotter.com">Karotter</a>のリンクをDiscordに貼っても中身見えない。<br>ドメインを変えるだけで見えるようになる。</p>

    <div class="label">Convert</div>
    <div class="box">
      <div class="box-row">
        <span class="box-tag">IN</span>
        <span class="box-val"><b>karotter.com</b>/@user/posts/12345</span>
      </div>
      <div class="box-row out">
        <span class="box-tag">OUT</span>
        <span class="box-val"><b>fxkarotter.com</b>/user/status/12345</span>
      </div>
    </div>

    <div class="label">Output</div>
    <div class="grid">
      <div class="grid-item"><div class="grid-icon">📝</div><div class="grid-lbl">Text</div></div>
      <div class="grid-item"><div class="grid-icon">🖼</div><div class="grid-lbl">Image</div></div>
      <div class="grid-item"><div class="grid-icon">❤️</div><div class="grid-lbl">Likes</div></div>
      <div class="grid-item"><div class="grid-icon">👁</div><div class="grid-lbl">Views</div></div>
    </div>

    <div class="label">Routes</div>
    <div class="routes">
      <div class="route"><span class="route-path">/user/status/123</span><span class="route-desc">short</span></div>
      <div class="route"><span class="route-path">/@user/posts/123</span><span class="route-desc">official</span></div>
      <div class="route"><span class="route-path">/posts/123</span><span class="route-desc">id only</span></div>
      <div class="route"><span class="route-path">/profile/user</span><span class="route-desc">profile</span></div>
    </div>

    <div class="divider"></div>

    <div class="label">FAQ</div>
    <div class="qa-item"><div class="qa-q">金かかる？</div><div class="qa-a">No. 無料。</div></div>
    <div class="qa-item"><div class="qa-q">.com と .jp の違い</div><div class="qa-a">ない。同じ。</div></div>
    <div class="qa-item"><div class="qa-q">ブラウザで開くと？</div><div class="qa-a">対応するKarotterにリダイレクト（.jp→karotter.jp、.com→karotter.com）。</div></div>
    <div class="qa-item"><div class="qa-q">ログ</div><div class="qa-a">取ってない。</div></div>
    <div class="qa-item"><div class="qa-q">Karotterって？</div><div class="qa-a">高校生が作ったSNS → <a href="https://karotter.com">karotter.com</a></div></div>

    <div class="divider"></div>

    <footer>
      <a href="https://github.com/cUDGk/fxkarotter">SOURCE</a>
      <span>BASED ON <a href="https://github.com/FxEmbed/FxEmbed">FXEMBED</a></span>
      <span>MIT</span>
    </footer>
  </div>
</body>
</html>`;

  c.header('content-type', 'text/html;charset=utf-8');
  c.header('cache-control', 'no-cache');
  return c.html(html);
};
