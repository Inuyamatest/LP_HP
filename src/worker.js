// サブドメインで店舗サイトを振り分ける Worker
// 例: morley-salon.example.site/ → public/sites/morley-salon/
// サブドメイン名 = public/sites/ 以下のフォルダ名（スラッグ）

const SLUG = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

// サブドメインとして扱わないホスト名の先頭ラベル
const RESERVED = new Set(['www']);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const labels = url.hostname.split('.');
    const sub = labels[0];

    // workers.dev・localhost・ルートドメインなどは、パスをそのまま配信する
    // （例: https://lp-hp.xxx.workers.dev/sites/morley-salon/ で確認できる）
    const isSiteHost =
      labels.length >= 3 &&
      !url.hostname.endsWith('.workers.dev') &&
      !RESERVED.has(sub) &&
      SLUG.test(sub);

    if (!isSiteHost) {
      return env.ASSETS.fetch(request);
    }

    const target = new URL(url);
    target.pathname = `/sites/${sub}${url.pathname}`;
    const res = await env.ASSETS.fetch(new Request(target, request));

    // アセット側のリダイレクト（末尾スラッシュ補完など）は、公開URLの形に戻す
    const location = res.headers.get('Location');
    if (location) {
      const loc = new URL(location, target);
      const prefix = `/sites/${sub}`;
      if (loc.pathname.startsWith(prefix)) {
        loc.pathname = loc.pathname.slice(prefix.length) || '/';
        loc.host = url.host;
        loc.protocol = url.protocol;
        const headers = new Headers(res.headers);
        headers.set('Location', loc.toString());
        return new Response(res.body, { status: res.status, headers });
      }
    }
    return res;
  },
};
