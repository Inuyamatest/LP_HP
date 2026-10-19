(function () {
  'use strict';

  // スマホのメニュー開閉
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  // 追従ボタン：ヒーローを過ぎたら出し、予約セクションが見えている間は隠す
  var dock = document.querySelector('.dock');
  var hero = document.querySelector('.hero');
  var reserve = document.getElementById('reserve');
  if (!dock || !hero || !reserve || !('IntersectionObserver' in window)) {
    if (dock) dock.classList.add('is-visible');
    return;
  }
  var pastHero = false;
  var atReserve = false;
  var update = function () {
    dock.classList.toggle('is-visible', pastHero && !atReserve);
  };
  new IntersectionObserver(function (entries) {
    pastHero = !entries[0].isIntersecting;
    update();
  }).observe(hero);
  new IntersectionObserver(function (entries) {
    atReserve = entries[0].isIntersecting;
    update();
  }).observe(reserve);
})();

// スクロールで現れる演出（動きを減らす設定のときは何もしない）
(function () {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // 手書き文を1行ずつの span に分ける（読み上げ内容は変わらない）
  var lineIndex = 0;
  document.querySelectorAll('.letter .hand').forEach(function (p) {
    var parts = p.innerHTML.split(/<br\s*\/?>/i);
    p.innerHTML = parts.map(function (html) {
      var delay = (0.3 + lineIndex++ * 0.42).toFixed(2);
      return '<span class="line" style="--line-delay:' + delay + 's">' + html.trim() + '</span>';
    }).join('<br>');
  });
  document.querySelectorAll('.address-lines div').forEach(function (row, i) {
    row.style.setProperty('--row-delay', (0.4 + i * 0.12).toFixed(2) + 's');
  });

  // [セレクタ, 同じ親の中で順番に遅らせる秒数]
  var groups = [
    ['.letter__card', 0],
    ['.stay__head', 0],
    ['.scene', 0.12],
    ['.plan__head', 0],
    ['.ticket', 0],
    ['.plan__more', 0],
    ['.kin__head', 0],
    ['.kin__notes li', 0.15],
    ['.kin__body > .note', 0],
    ['.access__info', 0],
    ['.access__map', 0.15],
    ['.reserve__title', 0],
    ['.reserve__lead', 0.1],
    ['.reserve__actions li', 0.18],
    ['.reserve__flow li', 0.12],
    ['.site-footer__nav', 0]
  ];

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el, i) {
      el.classList.add('anim');
      if (g[1]) el.style.setProperty('--delay', (i * g[1]).toFixed(2) + 's');
      io.observe(el);
    });
  });
})();
