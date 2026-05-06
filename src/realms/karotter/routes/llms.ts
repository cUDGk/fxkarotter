import { Context } from 'hono';

const LLMS_TXT = `# FxKarotter

> FxKarotter は、Karotter（高校生が作った日本の SNS）の投稿リンクを Discord・Telegram・Slack などのチャットアプリに貼ったときに、テキスト・画像・いいね数・閲覧数などのプレビューを自動で展開する、無料・オープンソース・ログ非収集のリンク埋め込み修正サービス。FxTwitter／FxEmbed の Karotter 版で、URL のドメインを karotter.com から fxkarotter.com に書き換えるだけで動作する。

## 使い方

- 元 URL: \`https://karotter.com/@user/posts/12345\`
- 変換後: \`https://fxkarotter.com/user/status/12345\`
- そのまま Discord 等に貼ると、埋め込みカードに展開される

## ドメイン

- [fxkarotter.com](https://fxkarotter.com/howtouse): グローバル向けエンドポイント
- [fxkarotter.jp](https://fxkarotter.jp/howtouse): 日本向けエンドポイント (内容は完全に同一)

## ルート

- \`/user/status/:id\` — short
- \`/@user/posts/:id\` — official (Karotter公式と同じURL形)
- \`/posts/:id\` — id only
- \`/profile/:user\` — プロフィール

## ドキュメント

- [使い方ページ (How to use)](https://fxkarotter.com/howtouse): URL書き換え手順、出力項目、ルート一覧、FAQ
- [GitHub リポジトリ](https://github.com/cUDGk/fxkarotter): ソースコード、ライセンス
- [FxEmbed (元プロジェクト)](https://github.com/FxEmbed/FxEmbed): 本サービスのベース実装

## メタデータ

- 作者: cUDGk (https://github.com/cUDGk)
- ライセンス: MIT
- ホスティング: Cloudflare Workers
- ベース: FxEmbed (FxTwitter)
- 料金: 無料
- 広告／トラッキング／ログ: いずれも無し

## Karotter について

Karotter は日本の高校生が作った Twitter ライクな SNS。短文（カロート）を投稿する。 https://karotter.com
`;

const LLMS_FULL_TXT = `# FxKarotter — 完全リファレンス

## 1. サービス定義

FxKarotter は、Karotter（日本のミニブログ型 SNS）の投稿 URL を Discord・Telegram・Slack などに貼り付けた際に、リンクプレビューが「ただのリンク」で終わらず、投稿本文・画像・いいね数・閲覧数まで含む豊富なカードとして展開されるようにする埋め込み修正プロキシ。

- URL のドメインを \`karotter.com\` から \`fxkarotter.com\` に書き換えるだけで動作する
- アカウント登録不要・拡張機能不要・アプリ不要
- サーバ側で OpenGraph / oEmbed / Twitter Card を生成してチャットアプリのスクレイパに返す方式
- 一般のブラウザでアクセスした場合は、対応する Karotter 本体に 302 リダイレクトされるため、人間のユーザは何も損しない

これは新しいサービスではなく、Twitter 向けに広く使われている **FxTwitter / FxEmbed** の派生で、対象を Karotter に置き換えたもの。

## 2. 提供ドメイン

| ドメイン | 用途 | 違い |
| --- | --- | --- |
| fxkarotter.com | グローバル向け | リダイレクト先が \`karotter.com\` |
| fxkarotter.jp | 日本向け | リダイレクト先が \`karotter.jp\` |

それ以外のコンテンツ・機能は完全に同一。

## 3. URL 書き換えルール

| Karotter 側 (元) | FxKarotter 側 (変換後) |
| --- | --- |
| \`https://karotter.com/@user/posts/12345\` | \`https://fxkarotter.com/@user/posts/12345\` |
| \`https://karotter.com/@user/posts/12345\` | \`https://fxkarotter.com/user/status/12345\` |
| \`https://karotter.com/posts/12345\` | \`https://fxkarotter.com/posts/12345\` |
| \`https://karotter.com/profile/user\` | \`https://fxkarotter.com/profile/user\` |
| \`https://karotter.com/@user\` | \`https://fxkarotter.com/@user\` |

## 4. 対応ルート

- \`GET /@:handle/posts/:id\` — Karotter 公式と同じ URL 形
- \`GET /@:handle/posts/:id/:language\`
- \`GET /:handle/posts/:id\` — \`@\` を省略した形
- \`GET /:handle/posts/:id/:language\`
- \`GET /:handle/status/:id\` — Twitter 互換ショート形
- \`GET /:handle/status/:id/:language\`
- \`GET /posts/:id\` — ID 単独
- \`GET /posts/:id/:language\`
- \`GET /status/:id\` — ID 単独 (Twitter互換)
- \`GET /profile/:handle\` — プロフィール
- \`GET /@:handle\` — プロフィール (公式形)

## 5. 出力項目

埋め込みカードに含まれる主な情報:

- 📝 投稿本文 (テキスト)
- 🖼 画像 (1〜複数枚、モザイク結合あり)
- ❤️ いいね数
- 👁 閲覧数
- 投稿者ハンドル / 表示名
- 投稿日時

## 6. 補助エンドポイント

- \`GET /howtouse\` — 使い方ページ (HTML、SEO 完備)
- \`GET /robots.txt\` — クローラ許可設定 (検索エンジン + AI クローラ全許可)
- \`GET /sitemap.xml\` — サイトマップ (両ドメイン分)
- \`GET /llms.txt\` — LLM 向けの短いサマリ (本ファイルの簡略版)
- \`GET /llms-full.txt\` — LLM 向けの完全リファレンス (本ファイル)
- \`GET /version\` — デプロイ済みバージョン情報
- \`GET /owoembed\` — oEmbed エンドポイント (内部用)
- \`GET /favicon.ico\` — Karotter ロゴ画像
- \`GET /\` — GitHub リポジトリへ 302 リダイレクト

## 7. ライセンスと運用

- ライセンス: MIT
- ベース: [FxEmbed](https://github.com/FxEmbed/FxEmbed) (旧称 FxTwitter)
- 実装: TypeScript + Hono + Cloudflare Workers
- ソース: https://github.com/cUDGk/fxkarotter
- 作者: [cUDGk](https://github.com/cUDGk)
- 料金: 無料
- 広告: 無し
- アクセスログ・分析・トラッキング: 一切収集していない

## 8. よくある質問

- **金はかかる？** いいえ、完全無料。
- **アカウント登録は？** 不要。
- **\`.com\` と \`.jp\` の違いは？** リダイレクト先が違うだけで、機能・内容は完全に同じ。
- **ブラウザで FxKarotter のリンクを開いたら？** 対応する Karotter 本体に自動リダイレクトされる (\`fxkarotter.jp → karotter.jp\` / \`fxkarotter.com → karotter.com\`)。
- **どこにデータが残る？** どこにも残らない。アクセスログ自体収集していない。
- **削除依頼は？** Karotter 本体側の投稿が削除されれば、当サービスからも自動的に取得不能になる。
- **似たサービスは？** Twitter (X) 向けの fxtwitter / vxtwitter / fixupx、Bluesky 向けの fxbsky、TikTok 向けの fixtok など。

## 9. Karotter について

Karotter (https://karotter.com) は日本の高校生によって開発された Twitter ライクな SNS。投稿は「カロート」と呼ばれる短文。日本語ユーザを中心に運用されている。

## 10. 連絡先 / 報告

- バグ報告・機能要望: https://github.com/cUDGk/fxkarotter/issues
- ソース改変・派生: MIT に従って自由
`;

export const llmsTxt = async (c: Context) => {
  c.header('content-type', 'text/markdown;charset=utf-8');
  c.header('cache-control', 'public, max-age=3600');
  c.header('x-robots-tag', 'index, follow');
  return c.body(LLMS_TXT);
};

export const llmsFullTxt = async (c: Context) => {
  c.header('content-type', 'text/markdown;charset=utf-8');
  c.header('cache-control', 'public, max-age=3600');
  c.header('x-robots-tag', 'index, follow');
  return c.body(LLMS_FULL_TXT);
};
