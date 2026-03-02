(function () {
  function setLang(lang) {
    var isZh = lang === 'zh';
    document.documentElement.lang = isZh ? 'zh-Hans' : 'en';
    var en = document.querySelectorAll('[data-lang="en"]');
    var zh = document.querySelectorAll('[data-lang="zh"]');
    en.forEach(function (el) { el.classList.toggle('hidden', isZh); });
    zh.forEach(function (el) { el.classList.toggle('hidden', !isZh); });
    try { localStorage.setItem('dayx_lang', lang); } catch (e) {}
  }

  function getLang() {
    try {
      var saved = localStorage.getItem('dayx_lang');
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) {}
    var nav = (navigator.language || 'en').toLowerCase();
    return nav.startsWith('zh') ? 'zh' : 'en';
  }

  document.addEventListener('DOMContentLoaded', function () {
    setLang(getLang());

    var btn = document.getElementById('langToggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var current = document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
        setLang(current === 'zh' ? 'en' : 'zh');
      });
    }
  });
})();
