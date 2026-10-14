// 営業状況の表示のみ（日本時間で判定。デモ用の営業時間：14:00–23:00、最終受付22:00、水曜定休）
(function () {
  var targets = document.querySelectorAll('[data-status]');
  if (!targets.length || !window.Intl) return;

  function nowInTokyo() {
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tokyo', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    var get = function (type) {
      for (var i = 0; i < parts.length; i++) if (parts[i].type === type) return parts[i].value;
      return '';
    };
    return { day: get('weekday'), minutes: Number(get('hour')) * 60 + Number(get('minute')) };
  }

  function label() {
    var t = nowInTokyo();
    if (t.day === 'Wed') return '本日 定休日';
    if (t.minutes < 14 * 60) return '本日 14:00 から';
    if (t.minutes < 22 * 60) return '営業中・23:00 まで';
    if (t.minutes < 23 * 60) return '本日の受付は終了';
    return '本日の営業は終了';
  }

  function update() {
    var text = label();
    for (var i = 0; i < targets.length; i++) targets[i].textContent = text;
  }

  update();
  setInterval(update, 60 * 1000);
})();
