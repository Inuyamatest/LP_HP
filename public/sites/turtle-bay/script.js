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
