/* 
 * MAN1K Website Global JavaScript
 * Optimized & Refactored Version
 * Copyright © 2026 Yaroslav Boruk
 * Contact: maniiik666@gmail.com
 */

(() => {
  'use strict';

  const CONFIG = {
    site: {
      domain: 'man1k.xyz',
      portalPath: '/portal666'
    },
    analytics: {
      GA_ID: window.MAN1K_GA_ID || '', // Set via: window.MAN1K_GA_ID = 'G-XXXXXXXXXX'
      anonymizeIP: true,
      allowAdSignals: false
    },
    security: {
      windowMs: 60000,        // 60s window
      maxActions: 80,         // max interactions per window
      banThreshold: 200,      // hard block threshold
      storageKey: 'mk_sec'
    },
    performance: {
      targetFPS: 30,
      transitionMs: 260,
      noise: { 
        scale: 0.015, 
        opacity: 0.06 
      }
    },
    easter: {
      consoleGreeting: true,
      keySequence: ['m','a','n','1','k']  // Secret key combo to portal
    }
  };

  /** ==============================
   * SECURITY: Rate Limiter
   * ============================== */
  const Security = (() => {
    const { windowMs, maxActions, banThreshold, storageKey } = CONFIG.security;
    
    const getWindow = () => Math.floor(Date.now() / windowMs);
    
    const increment = () => {
      try {
        const currentWindow = getWindow();
        const data = JSON.parse(localStorage.getItem(storageKey) || '{}');
        
        if (data.w !== currentWindow) {
          data.w = currentWindow;
          data.c = 0;
        }
        
        data.c++;
        localStorage.setItem(storageKey, JSON.stringify(data));
        
        if (data.c > banThreshold) return 'BAN';
        if (data.c > maxActions) return 'THROTTLE';
        return 'OK';
      } catch {
        return 'OK';
      }
    };
    
    // Track user interactions
    ['click', 'keydown', 'wheel', 'touchstart'].forEach(event => {
      window.addEventListener(event, increment, { passive: true });
    });
    
    return { increment };
  })();

  /** ==============================
   * PRIVACY-RESPECTING ANALYTICS (GA4)
   * Checks user privacy signals before loading analytics
   * ============================== */
  const Analytics = (() => {
    const { GA_ID, anonymizeIP, allowAdSignals } = CONFIG.analytics;
    
    if (!GA_ID) return { event: () => {}, page: () => {} };
    
    // ==========================================
    // PRIVACY CHECKS
    // ==========================================
    
    /**
     * Check if user has enabled Do Not Track (DNT)
     */
    const isDNTEnabled = () => {
      return navigator.doNotTrack === '1' || 
             navigator.doNotTrack === 'yes' ||
             window.doNotTrack === '1' ||
             navigator.msDoNotTrack === '1';
    };
    
    /**
     * Check for Global Privacy Control (GPC)
     * New standard: https://globalprivacycontrol.org/
     */
    const isGPCEnabled = () => {
      return navigator.globalPrivacyControl === true;
    };
    
    /**
     * Detect if user is using Tor Browser
     * Tor users value privacy highly
     */
    const isTorBrowser = () => {
      const ua = navigator.userAgent.toLowerCase();
      return ua.includes('tor browser');
    };
    
    /**
     * Check if ad blocker is present
     * If user already blocks ads, respect that choice
     */
    const hasAdBlocker = () => {
      try {
        const bait = document.createElement('div');
        bait.className = 'adsbox';
        bait.style.cssText = 'position:absolute;top:-1px;left:-1px;width:1px;height:1px';
        document.body.appendChild(bait);
        const isBlocked = bait.offsetHeight === 0;
        document.body.removeChild(bait);
        return isBlocked;
      } catch (e) {
        return false;
      }
    };
    
    // ==========================================
    // MAIN PRIVACY CHECK
    // ==========================================
    
    const shouldBlockAnalytics = () => {
      const dnt = isDNTEnabled();
      const gpc = isGPCEnabled();
      const tor = isTorBrowser();
      const adblock = hasAdBlocker();
      
      // If ANY privacy signal detected, block analytics
      return dnt || gpc || tor || adblock;
    };
    
    // ==========================================
    // BLOCK IF PRIVACY SIGNALS DETECTED
    // ==========================================
    
    if (shouldBlockAnalytics()) {
      // Return stub functions that do nothing
      return { 
        event: () => {}, 
        page: () => {} 
      };
    }
    
    // ==========================================
    // LOAD ANALYTICS (no privacy signals detected)
    // ==========================================
    
    // Inject gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.onerror = () => {}; // Silently fail if blocked by network
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', GA_ID, {
      anonymize_ip: anonymizeIP,
      allow_ad_personalization_signals: allowAdSignals
    });
    
    const event = (name, params = {}) => {
      try { gtag('event', name, params); } catch {}
    };
    
    const page = () => {
      event('page_view', {
        page_location: location.href,
        page_title: document.title
      });
    };
    
    return { event, page };
  })();

  /** ==============================
   * PERFORMANCE
   * ============================== */
  const Performance = (() => {
    const { targetFPS, noise } = CONFIG.performance;
    const frameInterval = 1000 / targetFPS;
    let lastFrame = 0;
    
    // Lazy load images
    const lazyImages = () => {
      document.querySelectorAll('img:not([loading])').forEach(img => {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('decoding', 'async');
      });
    };
    
    // Create animated noise overlay
    const createNoiseCanvas = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      
      Object.assign(canvas.style, {
        position: 'fixed',
        inset: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '2',
        opacity: String(noise.opacity)
      });
      
      document.body.appendChild(canvas);
      
      let width, height;
      
      const resize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      };
      
      resize();
      window.addEventListener('resize', resize, { passive: true });
      
      const render = (timestamp) => {
        if (timestamp - lastFrame < frameInterval) {
          requestAnimationFrame(render);
          return;
        }
        
        lastFrame = timestamp;
        const imageData = ctx.createImageData(width, height);
        const data = imageData.data;
        
        // Fast noise generation using hash function
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const hash = Math.sin(
              (x * noise.scale + timestamp * 0.0007) * 12.9898 + 
              (y * noise.scale - timestamp * 0.0009) * 78.233
            ) * 43758.5453;
            
            const value = Math.floor(Math.abs(hash % 1) * 255);
            const index = (y * width + x) * 4;
            
            data[index] = data[index + 1] = data[index + 2] = value;
            data[index + 3] = 255;
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(render);
      };
      
      requestAnimationFrame(render);
      return canvas;
    };
    
    return { lazyImages, createNoiseCanvas };
  })();

  /** ==============================
   * GLITCH PAGE TRANSITIONS
   * ============================== */
  const Glitch = (() => {
    const { transitionMs } = CONFIG.performance;
    let overlay = null;
    
    const createOverlay = () => {
      if (overlay) return overlay;
      
      overlay = document.createElement('div');
      overlay.id = 'mk-glitch-overlay';
      
      Object.assign(overlay.style, {
        position: 'fixed',
        inset: '0',
        background: '#000',
        opacity: '0',
        pointerEvents: 'none',
        zIndex: '9999',
        transition: `opacity ${transitionMs}ms ease`
      });
      
      document.body.appendChild(overlay);
      return overlay;
    };
    
    const playTransition = (callback) => {
      const el = createOverlay();
      el.style.opacity = '1';
      
      setTimeout(() => {
        if (callback) callback();
      }, transitionMs * 0.6);
    };
    
    const endTransition = () => {
      if (overlay) {
        overlay.style.opacity = '0';
      }
    };
    
    const interceptNavigation = () => {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        // Skip external links, new tabs, hash links, widgets
        if (link.target === '_blank') return;
        if (link.hostname && link.hostname !== location.hostname) return;
        if (link.getAttribute('href')?.startsWith('#')) return;
        if (link.dataset?.noGlitch === '1') return;
        if (link.closest('.bit-widget-initializer')) return;
        
        e.preventDefault();
        playTransition(() => {
          location.href = link.href;
        });
      });
      
      // End transition on page load
      window.addEventListener('pageshow', endTransition);
      window.addEventListener('load', endTransition);
      setTimeout(endTransition, 800);
    };
    
    return { interceptNavigation, playTransition, endTransition };
  })();

  /** ==============================
   * EASTER EGGS
   * ============================== */
  const Easter = (() => {
    // Console greeting
    const consoleGreeting = () => {
      if (!CONFIG.easter.consoleGreeting) return;
      
      const path = location.pathname.toLowerCase();
      const isPortal = path.includes('/portal666');
      const isErrorPage = /\/(400|401|403|404|503)/.test(path);
      
      if (isPortal || isErrorPage) return;
      
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
    
    // Secret key sequence to portal
    const secretSequence = () => {
      const sequence = CONFIG.easter.keySequence.slice();
      let position = 0;
      
      window.addEventListener('keydown', (e) => {
        const key = (e.key || '').toLowerCase();
        if (!key) return;
        
        if (key === sequence[position]) {
          position++;
          
          if (position >= sequence.length) {
            position = 0;
            console.log('%c⛧ PORTAL UNLOCKED ⛧', 'color: #ff0000; font-size: 20px; font-weight: bold;');
            Glitch.playTransition(() => {
              location.href = CONFIG.site.portalPath;
            });
          }
        } else {
          position = (key === sequence[0]) ? 1 : 0;
        }
      });
    };
    
    return { consoleGreeting, secretSequence };
  })();

  /** ==============================
   * META INJECTOR (Optional fallback)
   * Ensures critical meta tags exist
   * ============================== */
  const MetaInjector = (() => {
    const defaults = {
      themeColor: '#000000',
      favicon: '/icons/favicon.ico',
      manifest: '/icons/manifest.json'
    };
    
    const ensure = (selector, createFn) => {
      if (document.querySelector(selector)) return;
      const element = createFn();
      document.head.appendChild(element);
    };
    
    const inject = () => {
      // Theme color
      ensure('meta[name="theme-color"]', () => {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = defaults.themeColor;
        return meta;
      });
      
      // Favicon
      ensure('link[rel="icon"]', () => {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = defaults.favicon;
        return link;
      });
      
      // Manifest
      ensure('link[rel="manifest"]', () => {
        const link = document.createElement('link');
        link.rel = 'manifest';
        link.href = defaults.manifest;
        return link;
      });
    };
    
    return { inject };
  })();

  /** ==============================
   * INITIALIZATION
   * ============================== */
  const init = () => {
    // Core functionality
    MetaInjector.inject();
    Performance.lazyImages();
    Glitch.interceptNavigation();
    Analytics.page();
    
    // Easter eggs
    Easter.consoleGreeting();
    Easter.secretSequence();
    
    // Optional: Enable noise overlay
    // Uncomment to enable on all pages:
    // Performance.createNoiseCanvas();
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Expose public API
  window.MAN1K = {
    Analytics,
    Performance,
    Glitch,
    version: '2.0.0'
  };

})();