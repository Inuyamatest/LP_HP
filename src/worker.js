// 店舗サイトを振り分ける Worker
// 2通りの公開URLに対応する（どちらも public/sites/<フォルダ名>/ を配信）
// - パス方式:       lp.wakuwaku-inc.com/tanaka-esthe/ → public/sites/tanaka-esthe/
// - サブドメイン方式: tanaka-esthe.example.site/      → public/sites/tanaka-esthe/

const SLUG = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

// パス方式で配信するホスト（/<スラッグ>/ をフォルダに振り分ける）
const PATH_HOSTS = new Set(['lp.wakuwaku-inc.com']);

// 公開URLのスラッグとフォルダ名が違うもの（公開済みURLを変えないため）
const ALIASES = {
  'mori-hair-salon': 'morley-salon',
};

// サブドメインとして扱わないホスト名の先頭ラベル
const RESERVED = new Set(['www']);

// public/sites/<folder>/ を配信し、アセット側のリダイレクトは公開URLの形に戻す
async function serveSite(request, env, url, folder, publicPrefix, rest) {
  const target = new URL(url);
  target.pathname = `/sites/${folder}${rest}`;
  const res = await env.ASSETS.fetch(new Request(target, request));

  const location = res.headers.get('Location');
  if (location) {
    const loc = new URL(location, target);
    const prefix = `/sites/${folder}`;
    if (loc.pathname.startsWith(prefix)) {
      loc.pathname = publicPrefix + loc.pathname.slice(prefix.length) || '/';
      loc.host = url.host;
      loc.protocol = url.protocol;
      const headers = new Headers(res.headers);
      headers.set('Location', loc.toString());
      return new Response(res.body, { status: res.status, headers });
    }
  }
  return res;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // パス方式: /<スラッグ>/... → public/sites/<フォルダ>/...
    if (PATH_HOSTS.has(url.hostname)) {
      const match = url.pathname.match(/^\/([^/]+)(\/.*)?$/);
      const slug = match && match[1];
      if (!slug || !SLUG.test(slug)) {
        return new Response('Not Found', { status: 404 });
      }
      // 相対パスの画像やCSSが読めるよう、/<スラッグ> は /<スラッグ>/ にそろえる
      if (!match[2]) {
        const to = new URL(url);
        to.pathname = `/${slug}/`;
        return Response.redirect(to.toString(), 301);
      }
      return serveSite(request, env, url, ALIASES[slug] || slug, `/${slug}`, match[2]);
    }

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

    return serveSite(request, env, url, ALIASES[sub] || sub, '', url.pathname);
  },
};
