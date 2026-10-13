# LP_HP

店舗ごとのLP / ホームページ。各サイトは `public/sites/<slug>/` 以下に配置します。

## 公開（Cloudflare Workers）

`src/worker.js` が、サブドメイン名をそのままフォルダ名として振り分けます。

- `morley-salon.<ドメイン>/` → `public/sites/morley-salon/`
- 新しい店舗は `public/sites/<slug>/` を追加して main に反映するだけで、`<slug>.<ドメイン>` で公開されます

Cloudflare 側の初回設定（1回だけ）:

1. ドメインの DNS を Cloudflare で管理する
2. Workers & Pages → 作成 → Workers →「リポジトリをインポート」で `Inuyamatest/LP_HP` を選ぶ（本番ブランチ: main、設定は `wrangler.jsonc` を自動で使用）
3. 作成した Worker の 設定 → ドメインとルート → ルートを追加: `*.<ドメイン>/*`（ゾーン: そのドメイン）
4. DNS にワイルドカードレコードを追加: タイプ `AAAA`、名前 `*`、内容 `100::`、プロキシ ON（オレンジ雲）
