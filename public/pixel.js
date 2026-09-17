/**
 * Avirena Jewels - Universal Button & Page Activity Tracker for Meta Pixel
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

  // 1. SPA Route & Page Tracking
  var lastTrackedUrl = window.location.href;
  function trackPageIfChanged() {
    var cur = window.location.href;
    if (cur !== lastTrackedUrl) {
      lastTrackedUrl = cur;
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
    }
  }

  var origPush = history.pushState;
  history.pushState = function() {
    origPush.apply(this, arguments);
    setTimeout(trackPageIfChanged, 50);
  };

  var origReplace = history.replaceState;
  history.replaceState = function() {
    origReplace.apply(this, arguments);
    setTimeout(trackPageIfChanged, 50);
  };

  window.addEventListener('popstate', function() {
    setTimeout(trackPageIfChanged, 50);
  });
  window.addEventListener('hashchange', function() {
    setTimeout(trackPageIfChanged, 50);
  });

  // 2. Universal Click Tracker for EVERY button, link, and interactive element
  document.addEventListener('click', function(e) {
    try {
      var target = e.target;
      if (!target) return;

      var el = target.closest('button, a, [role="button"], input, select, textarea, label, [onclick], [class*="cursor-pointer"], [class*="btn"], [class*="button"]') || target;
      if (el === document.body || el === document.documentElement) return;

      var text = (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || el.value || '').trim();
      if (!text && el.parentElement) {
        text = (el.parentElement.innerText || el.parentElement.getAttribute('aria-label') || '').trim();
      }
      text = text.replace(/\s+/g, ' ').slice(0, 80);

      var id = el.id || (el.parentElement && el.parentElement.id) || '';
      var tag = el.tagName ? el.tagName.toLowerCase() : 'element';
      var href = el.getAttribute('href') || (el.closest('a') ? el.closest('a').getAttribute('href') : '') || '';
      var className = typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join(' ') : '';

      if (!text && !id && !href) return;

      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'ButtonClick', {
          element: tag,
          button_text: text || 'unlabeled_button',
          button_id: id,
          button_url: href,
          button_class: className,
          page_path: window.location.pathname,
          page_title: document.title
        });

        // Intent detection
        var lower = text.toLowerCase();
        if (lower.includes('checkout') || lower.includes('buy now')) {
          window.fbq('track', 'InitiateCheckout');
        } else if (lower.includes('whatsapp') || id.includes('whatsapp')) {
          window.fbq('track', 'Contact', { channel: 'WhatsApp' });
        }
      }
    } catch (err) {}
  }, true);
})();
