# LP_HP

店舗ごとのLP / ホームページ。各サイトは `public/sites/<slug>/` 以下に配置します。

## 公開（Cloudflare Workers）

`src/worker.js` が、公開URLを `public/sites/<フォルダ>/` に振り分けます。main に push すると Cloudflare が自動でデプロイします。

### パス方式（lp.wakuwaku-inc.com）

- `lp.wakuwaku-inc.com/tanaka-esthe/` → `public/sites/tanaka-esthe/`
- 新しい店舗は `public/sites/<slug>/` を追加して main に反映するだけで、`lp.wakuwaku-inc.com/<slug>/` で公開されます
- 公開URLとフォルダ名が違う店舗は、`src/worker.js` の `ALIASES` に書きます（例: `mori-hair-salon` → `morley-salon`）

Cloudflare 側の初回設定（1回だけ、wakuwaku-inc.com を管理しているアカウントで）:

1. Workers & Pages → 作成 → Workers →「リポジトリをインポート」で GitHub を連携し、`Inuyamatest/LP_HP` を選ぶ（本番ブランチ: main。ビルドコマンドは空、デプロイコマンドは既定の `npx wrangler deploy`）
2. いま `lp.wakuwaku-inc.com` を使っている Pages プロジェクトから、そのカスタムドメインを外す
3. 作成した Worker の 設定 → ドメインとルート →「カスタムドメインを追加」で `lp.wakuwaku-inc.com` を追加する

### サブドメイン方式（任意）

- `<slug>.<ドメイン>/` → `public/sites/<slug>/`
- Worker の 設定 → ドメインとルート → ルートを追加: `*.<ドメイン>/*`（ゾーン: そのドメイン）
- DNS にワイルドカードレコードを追加: タイプ `AAAA`、名前 `*`、内容 `100::`、プロキシ ON（オレンジ雲）
