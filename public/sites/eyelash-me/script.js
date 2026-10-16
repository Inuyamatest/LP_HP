// モバイルナビの開閉と、ファーストビューの写真切り替え
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.nav-toggle__label').textContent = open ? '閉じる' : 'メニュー';
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
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
    window.matchMedia('(min-width: 768px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  var slides = document.querySelectorAll('[data-slides] img');
  var no = document.querySelector('[data-slide-no]');
  if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var i = 0;
  setInterval(function () {
    slides[i].classList.remove('is-active');
    i = (i + 1) % slides.length;
    slides[i].loading = 'eager';
    slides[i].classList.add('is-active');
    if (no) no.textContent = '0' + (i + 1);
  }, 6000);
})();
