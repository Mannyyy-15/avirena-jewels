/**
 * Avirena Jewels - Universal Button & SPA Route Tracker for Meta Pixel
 * Pixel ID: 3584415405045765
 */
(function() {
  // Ensure fbq exists or queue it
  if (!window.fbq) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '3584415405045765');
    fbq('track', 'PageView');
  }

  // 1. SPA Route Change Listener
  var lastUrl = window.location.href;
  function onRouteChanged() {
    var cur = window.location.href;
    if (cur !== lastUrl) {
      lastUrl = cur;
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
    }
  }

  var pushState = history.pushState;
  history.pushState = function() {
    pushState.apply(this, arguments);
    setTimeout(onRouteChanged, 50);
  };

  var replaceState = history.replaceState;
  history.replaceState = function() {
    replaceState.apply(this, arguments);
    setTimeout(onRouteChanged, 50);
  };

  window.addEventListener('popstate', function() {
    setTimeout(onRouteChanged, 50);
  });
  window.addEventListener('hashchange', function() {
    setTimeout(onRouteChanged, 50);
  });

  // 2. Universal Click & Button Listener
  document.addEventListener('click', function(e) {
    try {
      var target = e.target;
      if (!target) return;

      var btn = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');
      if (!btn) return;

      var text = (btn.innerText || btn.textContent || btn.getAttribute('aria-label') || btn.getAttribute('title') || btn.value || '').trim();
      var id = btn.id || '';
      var href = btn.getAttribute('href') || '';
      var className = typeof btn.className === 'string' ? btn.className.split(' ').slice(0, 3).join(' ') : '';

      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'ButtonClick', {
          button_text: text.slice(0, 100),
          button_id: id,
          button_url: href,
          button_class: className,
          page_path: window.location.pathname,
          page_title: document.title
        });
      }
    } catch (err) {}
  }, true);
})();
