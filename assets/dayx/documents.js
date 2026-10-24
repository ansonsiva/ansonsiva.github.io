(() => {
  const copy = JSON.parse(document.getElementById('policy-copy-data').textContent);
  const button = document.querySelector('.language-toggle');
  function translate() {
    const en = window.DAYX_LANG === 'en';
    const text = copy[en ? 'en' : 'zh'];
    document.querySelectorAll('[data-policy-i18n]').forEach(el => {
      el.innerHTML = text[el.dataset.policyI18n];
    });
    button.textContent = en ? '中文 / EN' : 'EN / 中文';
    button.setAttribute('aria-label', en ? '切换为中文' : 'Switch to English');
    button.lang = en ? 'zh-CN' : 'en';
    document.title = document.body.dataset.app + ' · ' + (en ? 'Privacy policy' : '隐私政策') + ' · dayxlab';
    document.querySelector('meta[name="description"]').content = text.intro;
    document.querySelector('.document-nav nav').setAttribute('aria-label', en ? 'Main navigation' : '主导航');
    document.querySelector('.policy-toc nav').setAttribute('aria-label', en ? 'Table of contents' : '本页目录');
  }
  document.addEventListener('dayx:languagechange', translate);
  button.hidden = false;
  button.addEventListener('click', () => {
    window.DAYX_LANG = window.DAYX_LANG === 'en' ? 'zh' : 'en';
    try { localStorage.setItem('dayx-language', window.DAYX_LANG); } catch (e) {}
    window.applyDayxLanguage();
  });
  translate();
  function clock() {
    const d = new Date();
    document.getElementById('document-clock').textContent = new Intl.DateTimeFormat('en-GB', {hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).format(d);
    const remaining = 86400 - (d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds());
    const hh = Math.floor(remaining / 3600), mm = Math.floor(remaining / 60) % 60, ss = remaining % 60;
    document.getElementById('document-countdown').textContent = [hh,mm,ss].map(n => String(n).padStart(2,'0')).join(':');
    document.getElementById('document-year').textContent = d.getFullYear();
  }
  function progress() {
    const total = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('.read-progress').style.transform = 'scaleX(' + (total > 0 ? Math.min(1,Math.max(0,scrollY / total)) : 0) + ')';
  }
  clock(); setInterval(clock,1000);
  progress(); window.addEventListener('scroll',progress,{passive:true}); window.addEventListener('resize',progress);
})();
