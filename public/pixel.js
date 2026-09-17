/**
 * Avirena Jewels - Meta (Facebook) Pixel & Comprehensive Activity Tracker
 * Pixel ID: 3584415405045765
 */
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Initialize Meta Pixel
fbq('init', '3584415405045765');

// Track initial PageView
fbq('track', 'PageView');

// 1. SPA Route & Page Tracking (Every page view across all pages)
(function() {
  var lastUrl = window.location.href;
  function reportPageView() {
    var currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'PageView');
      }
    }
  }

  var origPushState = history.pushState;
  history.pushState = function() {
    origPushState.apply(this, arguments);
    setTimeout(reportPageView, 60);
  };

  var origReplaceState = history.replaceState;
  history.replaceState = function() {
    origReplaceState.apply(this, arguments);
    setTimeout(reportPageView, 60);
  };

  window.addEventListener('popstate', function() {
    setTimeout(reportPageView, 60);
  });
  window.addEventListener('hashchange', function() {
    setTimeout(reportPageView, 60);
  });
})();

// 2. Universal Button & Click Tracking (Every button and clickable element on all pages)
document.addEventListener('click', function(e) {
  try {
    var target = e.target;
    if (!target) return;

    var el = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');
    if (!el) return;

    var text = (el.innerText || el.textContent || el.getAttribute('aria-label') || el.getAttribute('title') || el.value || '').trim();
    var id = el.id || '';
    var href = el.getAttribute('href') || '';
    var className = typeof el.className === 'string' ? el.className.split(' ').slice(0, 3).join(' ') : '';

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
  } catch (err) {
    // Fail silently so user interactions are never blocked
  }
}, true);
