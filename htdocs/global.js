/* 
 * MAN1K Website Global JavaScript
 * Optimized & Refactored Version
 * Copyright © 2026 Yaroslav Boruk
 * Contact: maniiik666@gmail.com
 */

(() => {
  'use strict';

  const W = window;
  const D = document;
  const N = navigator;
  const L = location;

  if (W.__MAN1K_LOCK__) return;
  W.__MAN1K_LOCK__ = true;

  const CONFIG = {
    site: {
      domain: 'man1k.xyz',
      portalPath: '/portal666'
    },
    analytics: {
      GA_ID: W.MAN1K_GA_ID || '',
      anonymizeIP: true,
      allowAdSignals: false
    },
    security: {
      windowMs: 60000,
      maxActions: 80,
      banThreshold: 200,
      storageKey: 'mk_sec'
    },
    performance: {
      targetFPS: 30
    },
    easter: {
      consoleGreeting: true,
      keySequence: ['m', 'a', 'n', '1', 'k']
    }
  };

  const ua = N.userAgent.toLowerCase();
  const isBot = /bot|crawler|spider|headless|python|curl|wget|scrapy|axios|httpclient|ai|gpt|openai|claude|bard|bing|yandex|duckduck/i.test(ua);
  if (isBot) {
    D.documentElement.innerHTML = '';
    throw new Error('Blocked');
  }

  try {
    Object.defineProperty(W, 'eval', { value: undefined });
    Object.defineProperty(W, 'Function', { value: undefined });
  } catch {}

  ['debug','profile','profileEnd','table','time','timeEnd'].forEach(k => {
    try { console[k] = () => {}; } catch {}
  });

  D.addEventListener('contextmenu', e => e.preventDefault());
  D.addEventListener('dragstart', e => e.preventDefault());
  D.addEventListener('keydown', e => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  if (L.protocol === 'http:' && L.hostname !== 'localhost') {
    L.replace('https://' + L.hostname + L.pathname + L.search + L.hash);
  }

  const Security = (() => {
    const { windowMs, maxActions, banThreshold, storageKey } = CONFIG.security;
    const getWindow = () => Math.floor(Date.now() / windowMs);

    const increment = () => {
      try {
        const w = getWindow();
        const d = JSON.parse(localStorage.getItem(storageKey) || '{}');
        if (d.w !== w) {
          d.w = w;
          d.c = 0;
        }
        d.c++;
        localStorage.setItem(storageKey, JSON.stringify(d));
        if (d.c > banThreshold) throw new Error('ban');
        return d.c <= maxActions;
      } catch {
        return false;
      }
    };

    ['click','keydown','wheel','touchstart'].forEach(e =>
      W.addEventListener(e, increment, { passive: true })
    );

    return {};
  })();

  const Analytics = (() => {
    const { GA_ID, anonymizeIP, allowAdSignals } = CONFIG.analytics;
    if (!GA_ID) return { event: () => {}, page: () => {} };

    const block =
      N.doNotTrack === '1' ||
      N.globalPrivacyControl === true ||
      ua.includes('tor') ||
      (() => {
        try {
          const b = D.createElement('div');
          b.className = 'adsbox';
          b.style.cssText = 'position:absolute;left:-999px';
          D.body.appendChild(b);
          const r = b.offsetHeight === 0;
          D.body.removeChild(b);
          return r;
        } catch { return false; }
      })();

    if (block) return { event: () => {}, page: () => {} };

    W.dataLayer = W.dataLayer || [];
    const s = D.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    D.head.appendChild(s);

    W.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: anonymizeIP,
      allow_ad_personalization_signals: allowAdSignals
    });

    const event = (n, p = {}) => { try { gtag('event', n, p); } catch {} };
    const page = () => event('page_view', { page_location: L.href, page_title: D.title });

    return { event, page };
  })();

  const Performance = (() => {
    const lazyImages = () => {
      D.querySelectorAll('img:not([loading])').forEach(i => {
        i.loading = 'lazy';
        i.decoding = 'async';
      });
    };
    return { lazyImages };
  })();

  const Easter = (() => {
    const consoleGreeting = () => {
      if (!CONFIG.easter.consoleGreeting) return;
      try {
        const messages = [
`
╔═══════════════════════════════════════╗
║   WΞLCØMΞ TØ THΞ DIGITΔL ΔBYSS        ║
║   You have found MΔN1K's realm        ║
║                                       ║
║   Every line of code pulses with      ║
║   dark electronic energy...           ║
║                                       ║
║   Can you decode the hidden path?     ║
║   Try: m-a-n-1-k                      ║
║                                       ║
║   Binary whispers:                    ║
║   01001101 01000001 01001110          ║
║   00110001 01001011                   ║
╚═══════════════════════════════════════╝`
].join('\n');
        
        console.log(messages, 'color: #ff0000; font-family: monospace; font-size: 12px; font-weight: bold;');
      } catch {}
    };

    const secretSequence = () => {
      const seq = CONFIG.easter.keySequence;
      let p = 0;
      W.addEventListener('keydown', e => {
        const k = (e.key || '').toLowerCase();
        if (k === seq[p]) {
          p++;
          if (p === seq.length) {
            p = 0;
            L.href = CONFIG.site.portalPath;
          }
        } else {
          p = k === seq[0] ? 1 : 0;
        }
      });
    };

    return { consoleGreeting, secretSequence };
  })();

  const MetaInjector = (() => {
    const ensure = (q, f) => {
      if (!D.querySelector(q)) D.head.appendChild(f());
    };

    const inject = () => {
      ensure('meta[name="theme-color"]', () => {
        const m = D.createElement('meta');
        m.name = 'theme-color';
        m.content = '#000000';
        return m;
      });
      ensure('link[rel="icon"]', () => {
        const l = D.createElement('link');
        l.rel = 'icon';
        l.href = '/icons/favicon.ico';
        return l;
      });
      ensure('link[rel="manifest"]', () => {
        const l = D.createElement('link');
        l.rel = 'manifest';
        l.href = '/icons/manifest.json';
        return l;
      });
      const r = D.createElement('meta');
      r.name = 'robots';
      r.content = 'noai,noimageai,nosnippet';
      D.head.appendChild(r);
    };

    return { inject };
  })();

  const init = () => {
    MetaInjector.inject();
    Performance.lazyImages();
    Analytics.page();
    Easter.consoleGreeting();
    Easter.secretSequence();
  };

  if (D.readyState === 'loading') {
    D.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  const cf = D.createElement('script');
  cf.defer = true;
  cf.src = 'https://static.cloudflareinsights.com/beacon.min.js';
  cf.setAttribute('data-cf-beacon', '{"token":"cf-public"}');
  D.head.appendChild(cf);

  W.MAN1K = {
    Analytics,
    Performance,
    version: '1.0.0'
  };
})();