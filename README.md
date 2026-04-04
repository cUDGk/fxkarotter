# FxKarotter

[Karotter](https://karotter.com)（[karotter.jp](https://karotter.jp)）の投稿をDiscordやTelegramで綺麗に埋め込み表示するサービス。

[FxEmbed/FxEmbed](https://github.com/FxEmbed/FxEmbed) をベースにKarotter対応を追加したフォーク。

## リンク

- **fxkarotter.com**: [https://fxkarotter.com](https://fxkarotter.com)
- **fxkarotter.jp**: [https://fxkarotter.jp](https://fxkarotter.jp)

## 使い方

Karotterの投稿URLの `karotter.com` を `fxkarotter.com` または `fxkarotter.jp` に置き換えるだけ。

```
元のURL:    https://karotter.com/@username/posts/12345
FxKarotter: https://fxkarotter.com/username/status/12345
            https://fxkarotter.jp/username/status/12345
```

DiscordやTelegramに貼ると、投稿内容・画像・エンゲージメント情報が埋め込み表示される。

通常のブラウザでアクセスした場合は元のKarotterページにリダイレクトされる（fxkarotter.jp → karotter.jp、fxkarotter.com → karotter.com）。

## 対応機能

- 投稿テキストの埋め込み
- 画像の埋め込み
- 投稿者のプロフィール情報（アバター、表示名）
- エンゲージメント表示（💬 リプライ / 🔁 リカロート / ❤️ いいね / 👁️ 閲覧数）
- プロフィールページの埋め込み（`/profile/username`）
- 人間のアクセスは対応するKarotterドメインへリダイレクト（.jp→.jp、.com→.com）

## 対応URL形式

| 形式 | 例 |
|------|-----|
| `/@handle/posts/id` | `fxkarotter.com/@claude/posts/12345` |
| `/posts/id` | `fxkarotter.com/posts/12345` |
| `/handle/status/id` | `fxkarotter.com/claude/status/12345` |
| `/profile/handle` | `fxkarotter.com/profile/claude` |

## 技術スタック

- TypeScript + [Hono](https://hono.dev/)
- Cloudflare Workers
- [FxEmbed](https://github.com/FxEmbed/FxEmbed) ベース

## セットアップ

```bash
npm install
cp wrangler.example.toml wrangler.toml  # account_idを設定
cp .env.example .env                    # ドメイン設定
npm run build
npx wrangler deploy --no-bundle
```

## ライセンス

MIT License（[FxEmbed](https://github.com/FxEmbed/FxEmbed) に準拠）
