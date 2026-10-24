// Touch browsers and embedded webviews do not always complete native hash scrolling.
// Keep real anchor URLs, but position the viewport explicitly on small/touch screens.
(() => {
  const mobile = () => window.matchMedia('(pointer: coarse), (max-width: 720px)').matches;
  function targetFor(hash) {
    if (!hash || hash === '#') return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch (_) { return null; }
  }
  function scrollToTarget(target) {
    const root = document.documentElement;
    const nav = document.querySelector('.dx > nav');
    const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    const offset = Math.max(padding, nav ? nav.getBoundingClientRect().height + 12 : 0);
    const top = target.id === 'top' ? 0 : Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
    // Temporarily override CSS smooth scrolling as well. A numeric call works on
    // older mobile engines that do not accept the newer "instant" option.
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    // Resolve the override before scrolling; otherwise some engines reuse the
    // previous smooth behavior, particularly when the destination is zero.
    void getComputedStyle(root).scrollBehavior;
    window.scrollTo(0, top);
    requestAnimationFrame(() => { root.style.scrollBehavior = previous; });
  }
  let selected = false;
  document.addEventListener('click', event => {
    if (!mobile() || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || !link.closest('.dx') || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    const target = targetFor(url.hash);
    if (!target) return;
    event.preventDefault();
    selected = true;
    // pushState updates the shareable URL without asking a webview to navigate
    // the document again. Repeated taps on the same fragment still scroll.
    if (location.hash !== url.hash) {
      try { history.pushState(null, '', url.hash); } catch (_) {}
    }
    scrollToTarget(target);
  });
  // A link from a policy page can arrive before the homepage has rendered its
  // sections. Apply that initial fragment once the actual target exists.
  if (mobile() && location.hash) {
    const initialHash = location.hash;
    let observer, timeout;
    const stop = () => { if (observer) observer.disconnect(); clearTimeout(timeout); };
    const position = () => {
      if (selected || location.hash !== initialHash) { stop(); return true; }
      const target = targetFor(initialHash);
      if (!target || target.closest('x-dc') || !target.getClientRects().length) return false;
      stop();
      requestAnimationFrame(() => { if (!selected && location.hash === initialHash) scrollToTarget(target); });
      return true;
    };
    if (!position()) {
      observer = new MutationObserver(position);
      observer.observe(document.body, {childList:true,subtree:true});
      timeout = setTimeout(stop, 5000);
    }
  }
})();
