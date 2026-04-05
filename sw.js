/*! MAN1K SW v1.2 | © 2026 Yaroslav Boruk */
'use strict';
var CACHE='mk-v6';
var GAME_CACHE='mk-game-v3';
var GALLERY_CACHE='mk-gallery-v2';
var CACHE_VERSION=4;
var PRECACHE=[
  '/',
  '/about',
  '/music',
  '/lives',
  '/gallery',
  '/services',
  '/merch',
  '/subscribe',
  '/press',
  '/legal',
  '/tap',
  '/vv17ch0uz3',
  '/global.js',
  '/polyfills.js',
  '/icons/favicon.ico',
  '/icons/apple-touch-icon.png',
  '/img/logo.svg',
  'https://fonts.cdnfonts.com/css/vcr-osd-mono'
];
var GAME_ASSETS=[
  '/game/',
  '/game/index.html',
  '/game/engine.js',
  '/game/effects.js'
];
var IMMUTABLE_EXT=['.woff2','.woff','.ttf','.webp','.avif','.png','.jpg','.jpeg','.gif','.svg','.ico','.mp3','.ogg','.opus','.wasm'];
var BYPASS=[
  '/sw.js',
  '/site.webmanifest',
  '/_cf',
  '/LICENSE',
  '/cdn-cgi',
  '/portal666',
  '/404.html',
  '/.well-known/'
];
var BYPASS_HOSTS=[
  'googletagmanager.com',
  'google-analytics.com',
  'simpleanalyticscdn.com',
  'queue.simpleanalyticscdn.com',
  'scripts.simpleanalyticscdn.com'
];
var BYPASS_EXT=['.json','.txt','.xml','.pdf','.md','.ttl'];
var BOT_RE=/bot|crawl|spider|slurp|ia_archiver|bingpreview|mediapartners|headless|lighthouse/i;
function shouldBypass(url,req){
  if(BYPASS_HOSTS.some(function(h){return url.hostname===h||url.hostname.endsWith('.'+h)}))return true;
  if(BYPASS.some(function(p){return url.pathname===p||url.pathname.startsWith(p+'/')}))return true;
  if(BYPASS_EXT.some(function(ext){return url.pathname.endsWith(ext)}))return true;
  var ua=req.headers.get('user-agent')||'';
  if(BOT_RE.test(ua))return true;
  return false;
}
function safeFetch(req){
  return fetch(req).catch(function(){return null});
}
function cacheResponse(cacheName,req,res){
  if(!res||!res.ok||res.status===206)return;
  var ct=res.headers.get('content-type')||'';
  if(ct.indexOf('text/html')!==-1&&res.url!==req.url)return;
  var c=res.clone();
  caches.open(cacheName).then(function(cache){
    try{cache.put(req,c)}catch(e){}
  });
}
function offlineFallback(url){
  if(url.pathname==='/'){return caches.match('/')}
  var ext=url.pathname.split('.').pop().toLowerCase();
  if(['jpg','jpeg','png','webp','gif','svg','avif'].indexOf(ext)!==-1){
    return Promise.resolve(new Response('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',{headers:{'Content-Type':'image/svg+xml','Cache-Control':'no-store'}}))
  }
  return caches.match('/').then(function(r){return r||new Response('Offline',{status:503,headers:{'Content-Type':'text/plain'}})});
}
self.addEventListener('install',function(e){
  e.waitUntil(
    Promise.all([
      caches.open(CACHE).then(function(c){
        return Promise.all(PRECACHE.map(function(url){
          return c.add(url).catch(function(){});
        }));
      }),
      caches.open(GAME_CACHE).then(function(c){
        return Promise.all(GAME_ASSETS.map(function(url){
          return c.add(url).catch(function(){});
        }));
      }),
      caches.open(GALLERY_CACHE)
    ]).then(function(){return self.skipWaiting()})
  );
});
self.addEventListener('activate',function(e){
  var VALID=[CACHE,GAME_CACHE,GALLERY_CACHE];
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(VALID.indexOf(k)===-1)return caches.delete(k);
      }));
    }).then(function(){return self.clients.claim()})
  );
});
self.addEventListener('fetch',function(e){
  var req=e.request;
  if(req.method!=='GET')return;
  var url;
  try{url=new URL(req.url)}catch(err){return}
  if(url.protocol!=='https:'&&url.protocol!=='http:')return;
  if(shouldBypass(url,req))return;
  var isExternal=url.hostname!==self.location.hostname;
  var isPage=req.mode==='navigate';
  var isGame=url.pathname.startsWith('/game/');
  var isGalleryImg=url.hostname==='i.ibb.co';
  var isImmutable=IMMUTABLE_EXT.some(function(ext){return url.pathname.endsWith(ext)});
  var isScript=url.pathname.endsWith('.js')||url.pathname.endsWith('.css');
  if(isGalleryImg){
    e.respondWith(
      caches.open(GALLERY_CACHE).then(function(cache){
        return cache.match(req).then(function(cached){
          var network=safeFetch(req).then(function(res){
            if(res&&res.ok&&res.status!==206){
              cache.put(req,res.clone()).catch(function(){});
            }
            return res;
          });
          if(cached){
            network.catch(function(){});
            return cached;
          }
          return network.then(function(r){
            return r||new Response('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',{headers:{'Content-Type':'image/svg+xml','Cache-Control':'no-store'}});
          });
        });
      })
    );
    return;
  }
  if(isGame){
    e.respondWith(
      caches.match(req).then(function(cached){
        var network=safeFetch(req).then(function(res){
          cacheResponse(GAME_CACHE,req,res);return res;
        });
        return cached||network.then(function(r){return r||offlineFallback(url)});
      })
    );
    return;
  }
  if(isImmutable){
    e.respondWith(
      caches.match(req).then(function(cached){
        if(cached)return cached;
        return safeFetch(req).then(function(res){
          cacheResponse(CACHE,req,res);
          return res||new Response('',{status:404});
        });
      })
    );
    return;
  }
  if(isPage){
    e.respondWith(
      safeFetch(req).then(function(res){
        if(res&&res.ok)cacheResponse(CACHE,req,res);
        return res||caches.match(req).then(function(c){return c||offlineFallback(url)});
      }).catch(function(){
        return caches.match(req).then(function(c){return c||offlineFallback(url)});
      })
    );
    return;
  }
  var CACHE_HOSTS=['fonts.cdnfonts.com'];
if(isExternal){
  if(!CACHE_HOSTS.some(function(h){return url.hostname===h||url.hostname.endsWith('.'+h)}))return;
  e.respondWith(
    caches.match(req).then(function(cached){
      if(cached)return cached;
      return safeFetch(req).then(function(res){
        cacheResponse(CACHE,req,res);return res||new Response('',{status:503});
      });
    })
  );
  return;
}
  if(isScript){
    e.respondWith(
      safeFetch(req).then(function(res){
        if(res&&res.ok)cacheResponse(CACHE,req,res);
        return res||caches.match(req).then(function(c){return c||new Response('',{status:503})});
      }).catch(function(){
        return caches.match(req).then(function(c){return c||new Response('',{status:503})});
      })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function(cached){
      var network=safeFetch(req).then(function(res){
        if(res&&res.ok)cacheResponse(CACHE,req,res);
        return res;
      });
      return cached?Promise.race([
        network.catch(function(){return cached}),
        new Promise(function(r){setTimeout(function(){r(cached)},2000)})
      ]):network.then(function(r){return r||new Response('',{status:503})});
    })
  );
});
self.addEventListener('message',function(e){
  if(!e.data)return;
  if(e.data.type==='SKIP_WAITING')self.skipWaiting();
  if(e.data.type==='CACHE_URLS'&&Array.isArray(e.data.urls)){
  var safeUrls=e.data.urls.filter(function(u){
    try{return new URL(u).hostname===self.location.hostname;}
    catch(err){return false;}
  });
  caches.open(CACHE).then(function(c){
    safeUrls.forEach(function(url){c.add(url).catch(function(){})});
  });
}
});
self.addEventListener('sync',function(e){
  if(e.tag==='cache-refresh'){
    e.waitUntil(
      caches.open(CACHE).then(function(c){
        return Promise.all(PRECACHE.map(function(url){
          return safeFetch(new Request(url,{cache:'no-cache'})).then(function(res){
            if(res&&res.ok)c.put(url,res);
          }).catch(function(){});
        }));
      })
    );
  }
});
self.addEventListener('periodicsync',function(e){
  if(e.tag==='cache-update'){
    e.waitUntil(
      caches.open(CACHE).then(function(c){
        return Promise.all(PRECACHE.slice(0,10).map(function(url){
          return safeFetch(new Request(url,{cache:'reload'})).then(function(res){
            if(res&&res.ok)c.put(url,res);
          }).catch(function(){});
        }));
      })
    );
  }
});
