/*! MAN1K JS v2.1 | © 2026 Yaroslav Boruk | void@man1k.xyz */
(function(W,D,L,N){
'use strict';
if(W.__MK__)return;W.__MK__=1;
var C={
  v:'2.1',
  domain:'man1k.xyz',
  portal:'/portal666',
  artistJson:'/artist.json',
  manifest:'/site.webmanifest',
  keys:['m','a','n','1','k'],
  rateLimit:300,
  rateBan:600,
  rateWindow:60000,
  icons:{
  ico:'/icons/favicon.ico',
  png32:'/icons/icon-96.png',
  png16:'/icons/icon-96.png',
  apple:'/icons/apple-touch-icon.png',
  svg:'/icons/favicon.ico',
  mask:'/icons/apple-touch-icon.png'
},
};
var h=L.hostname,p=L.pathname,S=L.search,H=L.hash;
var isLocal=h==='localhost'||h==='127.0.0.1'||h.endsWith('.local');
if(p.length>1&&p.slice(-1)==='/'){L.replace(p.slice(0,-1)+S+H);return}
if(p.slice(-5)==='.html'&&p!=='/404.html'){try{history.replaceState(null,'',p.slice(0,-5)+S+H);p=L.pathname}catch(e){}}
if(p==='/index'||p==='/index.html'){L.replace('/'+S+H);return}
var addHead=function(el){D.head.appendChild(el)};
var getEl=function(sel){return D.querySelector(sel)};
var mkEl=function(tag){return D.createElement(tag)};
var addOnce=function(sel,fn){if(!getEl(sel)){var el=fn();if(el)addHead(el)}};
var isBot=/bot|crawl|spider|slurp|lighthouse|headless|prerender|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot/i.test(N.userAgent||'');
var Canon=(function(){
  return{set:function(){
    var url='https://'+C.domain+p;
    var el=getEl('link[rel="canonical"]');
    if(el)el.href=url;
    else{var l=mkEl('link');l.rel='canonical';l.href=url;addHead(l)}
  }}
})();
var Meta=(function(){
  var mk=function(name,content,attr){var m=mkEl('meta');m[attr||'name']=name;m.content=content;return m};
  return{inject:function(){
    addOnce('link[rel="icon"][type="image/x-icon"]',function(){var l=mkEl('link');l.rel='icon';l.href=C.icons.ico;l.type='image/x-icon';return l});
    addOnce('link[rel="icon"][type="image/svg+xml"]',function(){var l=mkEl('link');l.rel='icon';l.href=C.icons.svg;l.type='image/svg+xml';return l});
    addOnce('link[rel="icon"][sizes="32x32"]',function(){var l=mkEl('link');l.rel='icon';l.type='image/png';l.sizes='32x32';l.href=C.icons.png32;return l});
    addOnce('link[rel="icon"][sizes="16x16"]',function(){var l=mkEl('link');l.rel='icon';l.type='image/png';l.sizes='16x16';l.href=C.icons.png16;return l});
    addOnce('link[rel="apple-touch-icon"]',function(){var l=mkEl('link');l.rel='apple-touch-icon';l.href=C.icons.apple;return l});
    addOnce('link[rel="mask-icon"]',function(){var l=mkEl('link');l.rel='mask-icon';l.href=C.icons.mask;l.setAttribute('color','#d42020');return l});
    addOnce('link[rel="manifest"]',function(){var l=mkEl('link');l.rel='manifest';l.href=C.manifest;return l});
    addOnce('meta[name="theme-color"]',function(){return mk('theme-color','#030303')});
    addOnce('meta[name="msapplication-TileColor"]',function(){return mk('msapplication-TileColor','#030303')});
    addOnce('meta[name="color-scheme"]',function(){return mk('color-scheme','dark')});
    addOnce('meta[name="format-detection"]',function(){return mk('format-detection','telephone=no')});
    addOnce('meta[name="mobile-web-app-capable"]',function(){return mk('mobile-web-app-capable','yes')});
    addOnce('meta[name="apple-mobile-web-app-capable"]',function(){return mk('apple-mobile-web-app-capable','yes')});
    addOnce('meta[name="apple-mobile-web-app-status-bar-style"]',function(){return mk('apple-mobile-web-app-status-bar-style','black-translucent')});
    addOnce('meta[name="robots"]',function(){return mk('robots','index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1')});
    addOnce('meta[name="referrer"]',function(){return mk('referrer','strict-origin-when-cross-origin')});
    if(!getEl('meta[property="og:url"]')){var ou=mkEl('meta');ou.setAttribute('property','og:url');ou.content='https://'+C.domain+p;addHead(ou)}
    if(!getEl('meta[property="og:type"]')){var ot=mkEl('meta');ot.setAttribute('property','og:type');ot.content='website';addHead(ot)}
  }}
})();
var SSR=(function(){
  var enhance=function(){
    var main=getEl('main')||getEl('[role="main"]')||getEl('.content');
    if(main&&!main.getAttribute('role'))main.setAttribute('role','main');
    var nav=getEl('nav');
    if(nav&&!nav.getAttribute('aria-label'))nav.setAttribute('aria-label','Main navigation');
    var links=D.querySelectorAll('a[target="_blank"]');
    for(var i=0;i<links.length;i++){
      var a=links[i],rel=a.getAttribute('rel')||'';
      if(rel.indexOf('noopener')===-1)a.rel=(rel+' noopener noreferrer').trim()
    }
    if(!getEl('h1')){
      var t=D.title;
      if(t){
        var sr=mkEl('h1');
        sr.style.cssText='position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0';
        sr.textContent=t.split(/[|\-–]/)[0].trim();
        var target=getEl('main')||D.body.firstElementChild||D.body;
        target.insertBefore(sr,target.firstChild)
      }
    }
    D.documentElement.setAttribute('lang',D.documentElement.getAttribute('lang')||'en');
  };
  var scraperMeta=function(){
    addOnce('meta[name="artist"]',function(){var m=mkEl('meta');m.name='artist';m.content='MAN1K';return m});
    addOnce('meta[name="music:musician"]',function(){var m=mkEl('meta');m.name='music:musician';m.content='https://'+C.domain;return m});
    addOnce('link[rel="alternate"][type="application/json"]',function(){var l=mkEl('link');l.rel='alternate';l.type='application/json';l.href=C.artistJson;l.title='MAN1K Artist Data';return l});
    addOnce('link[rel="alternate"][hreflang="x-default"]',function(){var l=mkEl('link');l.rel='alternate';l.hreflang='x-default';l.href='https://'+C.domain+p;return l})
  };
  var noscriptCSS=function(){
    if(getEl('noscript#mk-ns'))return;
    var ns=mkEl('noscript');ns.id='mk-ns';
    ns.innerHTML='<style>iframe[data-src]{display:none}.js-only{display:none!important}.no-js-show{display:block!important}</style>';
    addHead(ns)
  };
  return{enhance:enhance,noscriptCSS:noscriptCSS,scraperMeta:scraperMeta}
})();
var Perf=(function(){
  var lazyImg=function(){
    var imgs=D.querySelectorAll('img:not([loading])');
    for(var i=0;i<imgs.length;i++){
      var img=imgs[i];
      if(i<2){img.loading='eager';img.decoding='async';try{img.fetchPriority='high'}catch(e){}}
      else{img.loading='lazy';img.decoding='async'}
    }
  };
  var prefetch=function(){
    if(isBot)return;
    try{if(N.connection&&(N.connection.saveData||N.connection.effectiveType==='2g'||N.connection.effectiveType==='slow-2g'))return}catch(e){}
    var done={},links=D.querySelectorAll('a[href^="/"]');
    var frag=D.createDocumentFragment();
    for(var i=0;i<links.length;i++){
      var href=links[i].getAttribute('href');
      if(href&&href!==p&&href!=='#'&&!done[href]&&href.indexOf('?')===-1){
        done[href]=1;
        var l=mkEl('link');l.rel='prefetch';l.href=href;frag.appendChild(l)
      }
    }
    addHead(frag)
  };
  var preconnect=function(){
    var hosts=['fonts.cdnfonts.com','cdnjs.cloudflare.com'];
    for(var i=0;i<hosts.length;i++){
      addOnce('link[rel="preconnect"][href="https://'+hosts[i]+'"]',function(h){return function(){var l=mkEl('link');l.rel='preconnect';l.href='https://'+h;l.crossOrigin='anonymous';return l}}(hosts[i]))
    }
    var dns=['bandcamp.com','soundcloud.com','open.spotify.com','ytimg.com'];
    for(var j=0;j<dns.length;j++){
      if(!getEl('link[rel="dns-prefetch"][href="https://'+dns[j]+'"]')){var dl=mkEl('link');dl.rel='dns-prefetch';dl.href='https://'+dns[j];addHead(dl)}
    }
  };
  var criticalCSS=function(){
    var s=mkEl('style');
    s.textContent=[
      'img[loading="lazy"]{content-visibility:auto;contain-intrinsic-size:auto 300px}',
      '.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}',
      '@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}'
    ].join('');
    addHead(s)
  };
  var vitals=function(){
    if(isBot||!W.PerformanceObserver)return;
    try{
      var po=new PerformanceObserver(function(list){
        var entries=list.getEntries();
        for(var i=0;i<entries.length;i++){
          var e=entries[i];
          if(e.entryType==='largest-contentful-paint'&&W.MAN1K&&W.MAN1K.GA)
            W.MAN1K.GA.e('web_vitals',{metric:'LCP',value:Math.round(e.startTime)})
        }
      });
      po.observe({entryTypes:['largest-contentful-paint']})
    }catch(ex){}
  };
  return{lazyImg:lazyImg,prefetch:prefetch,preconnect:preconnect,criticalCSS:criticalCSS,vitals:vitals}
})();
var Cache=(function(){
  var regSW=function(){
    if(!('serviceWorker'in N))return;
    N.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'}).then(function(reg){
      reg.addEventListener('updatefound',function(){
        var nw=reg.installing;
        if(!nw)return;
        nw.addEventListener('statechange',function(){
          if(nw.state==='installed'&&N.serviceWorker.controller){
            nw.postMessage({type:'SKIP_WAITING'})
          }
        })
      })
    }).catch(function(){});
    W.__MK_HAD_CTRL__ = !!N.serviceWorker.controller;
    N.serviceWorker.addEventListener('controllerchange', function(){
  if(!W.__MK_RELOAD__ && W.__MK_HAD_CTRL__){W.__MK_RELOAD__=1;W.location.reload()}
});
    W.__MK_HAD_CTRL__=!!N.serviceWorker.controller;
  };
  return{reg:regSW}
})();
var RL=(function(){
  var k='mk_r',b='mk_b',ls;
  try{ls=W.localStorage}catch(e){return{ok:function(){return true}}};
  if(!ls)return{ok:function(){return true}};
  try{
    var bd=ls.getItem(b);
    if(bd){
      var pb=JSON.parse(bd);
      if(pb&&pb.u>Date.now()){
        var showBlocked=function(){
          D.body.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#000;color:#f00;font-family:monospace;font-size:1.25rem;gap:1rem" role="alert">' +
          '<span>BLOCKED</span>' +
          '<a href="mailto:void@man1k.xyz" style="color:#f00;font-size:0.9rem">void@man1k.xyz</a>' +
          '</div>'
        };
        if(D.readyState==='loading'){D.addEventListener('DOMContentLoaded',showBlocked,{once:true})}else{showBlocked()}
        return{ok:function(){return false}}
      }else{ls.removeItem(b)}
    }
  }catch(e){}
  var last=0;
  var check=function(){
    var now=Date.now();
    if(now-last<50)return true;
    last=now;
    try{
      var w=Math.floor(now/C.rateWindow),d=JSON.parse(ls.getItem(k)||'{}');
      if(d.w!==w){d={w:w,c:0}}
      if(++d.c>C.rateBan){ls.setItem(b,JSON.stringify({u:now+3600000}));L.reload();return false}
      ls.setItem(k,JSON.stringify(d));
      return d.c<=C.rateLimit
    }catch(e){return true}
  };
  var evts = ['click', 'keydown'];
  for(var i=0;i<evts.length;i++)W.addEventListener(evts[i],check,{passive:true,capture:false});
  return{ok:check}
})();
var Widgets=(function(){
  var loaded={},hinted={};
  var hint=function(rel,domains){
    for(var i=0;i<domains.length;i++){
      var d=domains[i];if(hinted[d])continue;hinted[d]=1;
      var l=mkEl('link');l.rel=rel;l.href='https://'+d;
      if(rel==='preconnect')l.crossOrigin='anonymous';
      addHead(l)
    }
  };
  var lazyIframes=function(){
    var frames=D.querySelectorAll('iframe[data-src]');
    if(!frames.length)return;
    if('IntersectionObserver'in W){
      var io=new IntersectionObserver(function(entries){
        for(var i=0;i<entries.length;i++){
          if(entries[i].isIntersecting){
            var f=entries[i].target;f.src=f.dataset.src;f.removeAttribute('data-src');io.unobserve(f)
          }
        }
      },{rootMargin:'400px'});
      for(var i=0;i<frames.length;i++)io.observe(frames[i])
    }else{
      for(var j=0;j<frames.length;j++){frames[j].src=frames[j].dataset.src;frames[j].removeAttribute('data-src')}
    }
  };
  var loadScript=function(url,cb){
    if(loaded[url]){cb&&cb();return}
    var s=mkEl('script');s.src=url;s.async=true;
    s.onload=function(){loaded[url]=1;cb&&cb()};
    s.onerror=function(){cb&&cb()};
    D.body.appendChild(s)
  };
  var init=function(){
    hint('dns-prefetch',['bandcamp.com','bandsintown.com','ytimg.com','ggpht.com','soundcloud.com']);
    var run=function(){lazyIframes()};
    'requestIdleCallback'in W?W.requestIdleCallback(run,{timeout:800}):setTimeout(run,80)
  };
  return{init:init,loadScript:loadScript,lazyIframes:lazyIframes,hint:hint}
})();
var Errors=(function(){
  var send=function(msg,src,line,col,err){
    try{
      var data={m:String(msg).slice(0,200),s:String(src||'').split('/').pop(),l:line,c:col,u:p,v:C.v,t:Date.now()};
      if(err&&err.stack)data.st=String(err.stack).slice(0,500);
      if(W.MAN1K&&W.MAN1K.GA)W.MAN1K.GA.e('js_error',data)
    }catch(e){}
    return false
  };
  W.onerror=function(m,s,l,c,e){send(m,s,l,c,e)};
  W.addEventListener('unhandledrejection',function(e){send('UnhandledPromise:'+(e.reason&&e.reason.message||e.reason),'promise',0,0,e.reason instanceof Error?e.reason:null)});
  return{}
})();
var Glitch=(function(){
  var play=function(cb){
    var el=mkEl('div');
    el.style.cssText='position:fixed;inset:0;z-index:999999;pointer-events:none;background:transparent';
    D.body.appendChild(el);
    var frames=[
      {bg:'rgba(122,255,26,.15)',sk:'-3deg',tx:'2px'},
      {bg:'rgba(0,220,220,.1)',sk:'2deg',tx:'-4px'},
      {bg:'rgba(255,255,255,.2)',sk:'-5deg',tx:'3px'},
      {bg:'rgba(212,32,32,.15)',sk:'4deg',tx:'-2px'},
      {bg:'rgba(0,0,0,.9)',sk:'-2deg',tx:'0'},
      {bg:'rgba(122,255,26,.25)',sk:'6deg',tx:'5px'},
      {bg:'transparent',sk:'0',tx:'0'}
    ];
    var i=0,iv=setInterval(function(){
      if(i>=frames.length){clearInterval(iv);el.parentNode&&el.parentNode.removeChild(el);cb&&cb();return}
      var f=frames[i++];
      el.style.background=f.bg;
      el.style.transform='skewX('+f.sk+') translateX('+f.tx+')';
    },60);
  };
  return{play:play}
})();
var Easter=(function(){
  var BOX='╔═══════════════════════════════════════╗\n║   W\u039eLCØM\u039e TØ TH\u039e DIGIT\u0394L \u0394BYSS        ║\n║   You have found M\u0394N1K\'s realm        ║\n║                                       ║\n║   Every line of code pulses with      ║\n║   dark electronic energy...           ║\n║                                       ║\n║   Can you decode the hidden path?     ║\n║   Try: m-a-n-1-k                      ║\n║                                       ║\n║   Binary whispers:                    ║\n║   01001101 01000001 01001110          ║\n║   00110001 01001011                   ║\n╚═══════════════════════════════════════╝';
  var greet=function(){
    if(/portal666|\/4\d\d/.test(p))return;
    try{
      W.console.log('%c'+BOX,'color:#d42020;font-weight:bold;font-family:monospace;font-size:12px;line-height:1.4');
      W.console.log('%c\u26e7 MAN1K v'+C.v+' \u26e7','color:#d42020;font-size:14px;font-weight:bold')
    }catch(e){}
  };
  var keys=function(){
    var seq=C.keys,pos=0;
    W.addEventListener('keydown',function(e){
      var k=(e.key||'').toLowerCase();
      if(k===seq[pos]){
        if(++pos>=seq.length){
          pos=0;
          try{W.console.log('%c\u26e7 PORTAL UNLOCKED \u26e7','color:#d42020;font-size:20px;font-weight:bold')}catch(ex){}
          Glitch.play(function(){L.href=C.portal})
        }
      }else{pos=k===seq[0]?1:0}
    })
  };
  return{greet:greet,keys:keys}
})();
var GA=(function(){
  var id='G-5M1G8HHZW4';
  var noop=function(){};
  var noopObj={e:noop,p:noop};
  if(isLocal||!id||N.doNotTrack==='1'||N.globalPrivacyControl)return noopObj;
  W.dataLayer=W.dataLayer||[];
  var gtag=function(){W.dataLayer.push(arguments)};
  W.gtag=gtag;
  W.MAN1K_GA_ID=id;
  var s=mkEl('script');s.async=true;
  s.setAttribute('data-cfasync','false');
  s.src='https://www.googletagmanager.com/gtag/js?id='+id;
  addHead(s);
  gtag('js',new Date());
  gtag('config',id,{
    anonymize_ip:true,
    allow_ad_personalization_signals:false,
    restricted_data_processing:true,
    cookie_flags:'SameSite=Lax;Secure',
    cookie_expires:15552000,
    send_page_view:false
  });
  return{
    e:function(n,params){try{gtag('event',n,params||{})}catch(ex){}},
    p:function(){this.e('page_view',{page_location:L.href,page_title:D.title})}
  }
})();
var BFCache=(function(){
  W.addEventListener('pageshow',function(e){
    if(e.persisted){
      D.documentElement.classList.remove('no-js');D.documentElement.classList.add('js');
      try{if(N.serviceWorker&&N.serviceWorker.controller)N.serviceWorker.controller.postMessage({type:'PAGE_SHOW'})}catch(ex){}
    }
  });
  W.addEventListener('pagehide',function(){
    try{if(N.serviceWorker&&N.serviceWorker.controller)N.serviceWorker.controller.postMessage({type:'PAGE_HIDE'})}catch(ex){}
  });
  return{}
})();
Perf.criticalCSS();
var init=function(){
  D.documentElement.classList.remove('no-js');
  D.documentElement.classList.add('js');
  
  // High Priority: Immediate sync
  Canon.set();
  SSR.noscriptCSS();
  
  // Medium Priority: Defer slightly to unblock main thread
  setTimeout(function(){
    Meta.inject();
    SSR.scraperMeta();
    Perf.preconnect();
    Perf.lazyImg();
    Widgets.init();
    SSR.enhance();
  }, 0);

  // Low Priority: Defer more
  setTimeout(function(){
    GA.p();
    // TikTok Pixel logic (only if not opted out)
    if(!isLocal&&!isBot&&N.doNotTrack!=='1'&&!N.globalPrivacyControl){
      !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('D7958NBC77U5V754BC6G');ttq.page()}(window,document,'ttq');
    }
    Easter.greet();
    Easter.keys();
  }, 100);

  var idle=function(){
    Perf.prefetch();
    Perf.vitals();
    Cache.reg()
  };
  'requestIdleCallback'in W?W.requestIdleCallback(idle,{timeout:2500}):setTimeout(idle,1500)
};
W.MAN1K={v:C.v,Widgets:Widgets,GA:GA,Glitch:Glitch,Cache:Cache,RL:RL};
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})(window,document,location,navigator);
