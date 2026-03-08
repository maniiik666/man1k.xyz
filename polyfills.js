/*! MAN1K Polyfills v1.0 | © 2026 Yaroslav Boruk */
(function(W,D,OP,AP,EP){
'use strict';
var OPH=OP.hasOwnProperty,toString=OP.toString;
var isCallable=function(fn){return typeof fn==='function'||toString.call(fn)==='[object Function]'};
var toInt=function(v){var n=+v;return isNaN(n)||n===0?0:n>0?Math.floor(n):-Math.floor(-n)};
var toLen=function(v){return Math.min(Math.max(toInt(v),0),9007199254740991)};
if(typeof Object.assign!=='function'){
  Object.defineProperty(Object,'assign',{value:function(t){
    if(t==null)throw new TypeError('Object.assign: target is null/undefined');
    var r=Object(t);
    for(var i=1;i<arguments.length;i++){var s=arguments[i];if(s!=null)for(var k in s)if(OPH.call(s,k))r[k]=s[k]}
    return r
  },writable:true,configurable:true})
}
if(typeof Object.keys!=='function'){
  Object.keys=function(o){
    if(o==null||typeof o!=='object'&&typeof o!=='function')throw new TypeError('Object.keys: argument is not an object');
    var k=[];for(var p in o)if(OPH.call(o,p))k.push(p);return k
  }
}
if(typeof Object.values!=='function'){
  Object.values=function(o){
    if(o==null)throw new TypeError('Object.values: argument is null/undefined');
    var v=[];for(var k in Object(o))if(OPH.call(o,k))v.push(o[k]);return v
  }
}
if(typeof Object.entries!=='function'){
  Object.entries=function(o){
    if(o==null)throw new TypeError('Object.entries: argument is null/undefined');
    var e=[];for(var k in Object(o))if(OPH.call(o,k))e.push([k,o[k]]);return e
  }
}
if(!Array.from){
  Array.from=function(al,mapFn,T){
    if(al==null)throw new TypeError('Array.from: argument is null/undefined');
    if(mapFn!==undefined&&!isCallable(mapFn))throw new TypeError('Array.from: mapFn is not callable');
    var items=Object(al);
    var len=toLen(items.length);
    var A=isCallable(this)?Object(new this(len)):new Array(len);
    for(var k=0;k<len;k++){
      A[k]=mapFn?T!==undefined?mapFn.call(T,items[k],k):mapFn(items[k],k):items[k]
    }
    A.length=len;return A
  }
}
if(!Array.isArray){
  Array.isArray=function(v){return toString.call(v)==='[object Array]'}
}
if(!AP.find){
  Object.defineProperty(AP,'find',{value:function(fn,t){
    if(this==null)throw new TypeError('Array.prototype.find: called on null/undefined');
    if(!isCallable(fn))throw new TypeError('Array.prototype.find: predicate is not callable');
    var o=Object(this),l=toLen(o.length);
    for(var i=0;i<l;i++)if(fn.call(t,o[i],i,o))return o[i]
  },writable:true,configurable:true})
}
if(!AP.findIndex){
  Object.defineProperty(AP,'findIndex',{value:function(fn,t){
    if(this==null)throw new TypeError('Array.prototype.findIndex: called on null/undefined');
    if(!isCallable(fn))throw new TypeError('Array.prototype.findIndex: predicate is not callable');
    var o=Object(this),l=toLen(o.length);
    for(var i=0;i<l;i++)if(fn.call(t,o[i],i,o))return i;return -1
  },writable:true,configurable:true})
}
if(!AP.includes){
  Object.defineProperty(AP,'includes',{value:function(v,from){
    if(this==null)throw new TypeError('Array.prototype.includes: called on null/undefined');
    var o=Object(this),l=toLen(o.length);
    if(l===0)return false;
    var k=Math.max(from===undefined?0:(from>=0?+from:l-Math.abs(+from||0)),0);
    while(k<l){var el=o[k++];if(el===v||(v!==v&&el!==el))return true}
    return false
  },writable:true,configurable:true})
}
if(!AP.flat){
  Object.defineProperty(AP,'flat',{value:function(d){
    var depth=d===undefined?1:Math.floor(+d);
    if(isNaN(depth)||depth<1)return AP.slice.call(this);
    return AP.reduce.call(this,function(a,v){
      return a.concat(Array.isArray(v)&&depth>1?AP.flat.call(v,depth-1):v)
    },[])
  },writable:true,configurable:true})
}
if(!AP.flatMap){
  Object.defineProperty(AP,'flatMap',{value:function(fn,t){
    if(!isCallable(fn))throw new TypeError('Array.prototype.flatMap: fn is not callable');
    return AP.flat.call(AP.map.call(this,fn,t),1)
  },writable:true,configurable:true})
}
if(!AP.fill){
  Object.defineProperty(AP,'fill',{value:function(v,s,e){
    if(this==null)throw new TypeError('Array.prototype.fill: called on null/undefined');
    var o=Object(this),l=toLen(o.length);
    var start=s===undefined?0:toInt(s);var end=e===undefined?l:toInt(e);
    start=start<0?Math.max(l+start,0):Math.min(start,l);
    end=end<0?Math.max(l+end,0):Math.min(end,l);
    while(start<end)o[start++]=v;return o
  },writable:true,configurable:true})
}
if(!EP.matches){
  EP.matches=EP.msMatchesSelector||EP.mozMatchesSelector||EP.webkitMatchesSelector||function(s){
    var all=D.querySelectorAll(s),i=all.length;
    while(--i>=0)if(all[i]===this)return true;return false
  }
}
if(!EP.closest){
  EP.closest=function(s){
    var el=this;
    do{if(EP.matches.call(el,s))return el;el=el.parentElement||el.parentNode}
    while(el!==null&&el.nodeType===1);
    return null
  }
}
if(!EP.remove){
  EP.remove=function(){this.parentNode&&this.parentNode.removeChild(this)}
}
if(!EP.after){
  EP.after=function(){
    var ref=this;
    for(var i=0;i<arguments.length;i++){
      var n=typeof arguments[i]==='string'?D.createTextNode(arguments[i]):arguments[i];
      ref.parentNode&&ref.parentNode.insertBefore(n,ref.nextSibling);ref=n
    }
  }
}
if(!EP.before){
  EP.before=function(){
    for(var i=0;i<arguments.length;i++){
      var n=typeof arguments[i]==='string'?D.createTextNode(arguments[i]):arguments[i];
      this.parentNode&&this.parentNode.insertBefore(n,this)
    }
  }
}
if(!EP.prepend){
  EP.prepend=function(){
    var df=D.createDocumentFragment();
    for(var i=0;i<arguments.length;i++)df.appendChild(typeof arguments[i]==='string'?D.createTextNode(arguments[i]):arguments[i]);
    this.insertBefore(df,this.firstChild)
  }
}
if(!EP.append){
  EP.append=function(){
    var df=D.createDocumentFragment();
    for(var i=0;i<arguments.length;i++)df.appendChild(typeof arguments[i]==='string'?D.createTextNode(arguments[i]):arguments[i]);
    this.appendChild(df)
  }
}
if(!W.NodeList||!W.NodeList.prototype.forEach){
  try{W.NodeList.prototype.forEach=AP.forEach}catch(e){}
}
if(!String.prototype.includes){
  Object.defineProperty(String.prototype,'includes',{value:function(s,p){
    if(this==null)throw new TypeError('String.prototype.includes: called on null/undefined');
    if(toString.call(s)==='[object RegExp]')throw new TypeError('String.prototype.includes: search cannot be a RegExp');
    return this.indexOf(s,p||0)!==-1
  },writable:true,configurable:true})
}
if(!String.prototype.startsWith){
  Object.defineProperty(String.prototype,'startsWith',{value:function(s,p){
    if(this==null)throw new TypeError('String.prototype.startsWith: called on null/undefined');
    var str=String(this),pos=Math.max(toInt(p),0);
    return str.slice(pos,pos+s.length)===s
  },writable:true,configurable:true})
}
if(!String.prototype.endsWith){
  Object.defineProperty(String.prototype,'endsWith',{value:function(s,l){
    if(this==null)throw new TypeError('String.prototype.endsWith: called on null/undefined');
    var str=String(this),end=l===undefined?str.length:Math.min(Math.max(toInt(l),0),str.length);
    return str.slice(end-s.length,end)===s
  },writable:true,configurable:true})
}
if(!String.prototype.repeat){
  Object.defineProperty(String.prototype,'repeat',{value:function(n){
    if(this==null)throw new TypeError('String.prototype.repeat: called on null/undefined');
    var count=toInt(n);
    if(count<0||count===Infinity)throw new RangeError('String.prototype.repeat: count is invalid');
    var r='',s=String(this);while(count>0){if(count%2)r+=s;s+=s;count=Math.floor(count/2)}return r
  },writable:true,configurable:true})
}
if(!String.prototype.trimStart){
  Object.defineProperty(String.prototype,'trimStart',{value:function(){return this.replace(/^\s+/,'')},writable:true,configurable:true})
  String.prototype.trimLeft=String.prototype.trimStart
}
if(!String.prototype.trimEnd){
  Object.defineProperty(String.prototype,'trimEnd',{value:function(){return this.replace(/\s+$/,'')},writable:true,configurable:true})
  String.prototype.trimRight=String.prototype.trimEnd
}
if(!String.prototype.padStart){
  Object.defineProperty(String.prototype,'padStart',{value:function(l,f){
    var str=String(this),tl=Math.max(toInt(l),0),fill=f===undefined?' ':String(f);
    if(str.length>=tl||fill==='')return str;
    var pad='';while(pad.length<tl-str.length)pad+=fill;
    return pad.slice(0,tl-str.length)+str
  },writable:true,configurable:true})
}
if(!String.prototype.padEnd){
  Object.defineProperty(String.prototype,'padEnd',{value:function(l,f){
    var str=String(this),tl=Math.max(toInt(l),0),fill=f===undefined?' ':String(f);
    if(str.length>=tl||fill==='')return str;
    var pad='';while(pad.length<tl-str.length)pad+=fill;
    return str+pad.slice(0,tl-str.length)
  },writable:true,configurable:true})
}
if(!Math.sign){Math.sign=function(x){return x=+x,x===0||isNaN(x)?x:x>0?1:-1}}
if(!Math.trunc){Math.trunc=function(x){return isNaN(x)?NaN:x<0?Math.ceil(x):Math.floor(x)}}
if(!Math.cbrt){Math.cbrt=function(x){var y=Math.pow(Math.abs(x),1/3);return x<0?-y:y}}
if(!Math.log2){Math.log2=function(x){return Math.log(x)*Math.LOG2E}}
if(!Math.log10){Math.log10=function(x){return Math.log(x)*Math.LOG10E}}
if(!Math.hypot){Math.hypot=function(){var s=0;for(var i=0;i<arguments.length;i++)s+=arguments[i]*arguments[i];return Math.sqrt(s)}}
if(!Math.clz32){Math.clz32=function(x){var v=x>>>0;return v===0?32:31-Math.floor(Math.log(v)*Math.LOG2E)}}
if(Number.isFinite===undefined){Number.isFinite=function(v){return typeof v==='number'&&isFinite(v)}}
if(Number.isNaN===undefined){Number.isNaN=function(v){return typeof v==='number'&&isNaN(v)}}
if(Number.isInteger===undefined){Number.isInteger=function(v){return typeof v==='number'&&isFinite(v)&&Math.floor(v)===v}}
if(Number.isSafeInteger===undefined){Number.isSafeInteger=function(v){return Number.isInteger(v)&&Math.abs(v)<=9007199254740991}}
if(Number.parseInt===undefined){Number.parseInt=parseInt}
if(Number.parseFloat===undefined){Number.parseFloat=parseFloat}
if(Number.EPSILON===undefined){Number.EPSILON=2.220446049250313e-16}
if(Number.MAX_SAFE_INTEGER===undefined){Number.MAX_SAFE_INTEGER=9007199254740991}
if(Number.MIN_SAFE_INTEGER===undefined){Number.MIN_SAFE_INTEGER=-9007199254740991}
if(typeof W.Promise==='undefined'){
  var asap=typeof MutationObserver!=='undefined'?function(fn){
    var c=0,node=D.createTextNode('');
    new MutationObserver(fn).observe(node,{characterData:true});
    return function(){node.data=c=++c%2}
  }:function(fn){return function(){setTimeout(fn,0)}};
  var queue=[],drain=asap(function(){var q=queue.splice(0);for(var i=0;i<q.length;i++)q[i]()});
  var schedule=function(fn){queue.push(fn);drain()};
  var PENDING=0,FULFILLED=1,REJECTED=2;
  var handle=function(p,onF,onR,resolve,reject){
    schedule(function(){
      var fn=p._s===FULFILLED?onF:onR;
      if(!isCallable(fn)){(p._s===FULFILLED?resolve:reject)(p._v);return}
      try{resolve(fn(p._v))}catch(e){reject(e)}
    })
  };
  var transition=function(p,state,value){
    if(p._s!==PENDING)return;p._s=state;p._v=value;
    for(var i=0;i<p._h.length;i++)handle.apply(null,p._h[i])
  };
  var resolve=function(p,x){
    if(x===p){reject(p,new TypeError('Promise: self resolution'));return}
    if(x&&(typeof x==='object'||isCallable(x))){
      var then;try{then=x.then}catch(e){reject(p,e);return}
      if(isCallable(then)){var called=false;try{then.call(x,function(v){called||(called=true,resolve(p,v))},function(r){called||(called=true,reject(p,r))})}catch(e){called||(reject(p,e))};return}
    }
    transition(p,FULFILLED,x)
  };
  var reject=function(p,r){transition(p,REJECTED,r)};
  W.Promise=function(fn){
    if(!isCallable(fn))throw new TypeError('Promise: executor is not callable');
    var p=this;p._s=PENDING;p._v=undefined;p._h=[];
    try{fn(function(v){resolve(p,v)},function(r){reject(p,r)})}catch(e){reject(p,e)}
  };
  W.Promise.prototype.then=function(onF,onR){
    var self=this;
    return new W.Promise(function(res,rej){
      var entry=[self,onF,onR,res,rej];
      self._s===PENDING?self._h.push(entry):handle.apply(null,entry)
    })
  };
  W.Promise.prototype.catch=function(onR){return this.then(null,onR)};
  W.Promise.prototype.finally=function(fn){
    return this.then(
      function(v){return W.Promise.resolve(isCallable(fn)?fn():undefined).then(function(){return v})},
      function(r){return W.Promise.resolve(isCallable(fn)?fn():undefined).then(function(){throw r})}
    )
  };
  W.Promise.resolve=function(v){return new W.Promise(function(r){r(v)})};
  W.Promise.reject=function(r){return new W.Promise(function(_,j){j(r)})};
  W.Promise.all=function(it){
    return new W.Promise(function(res,rej){
      var arr=Array.isArray(it)?it:Array.from(it),n=arr.length,r=new Array(n),c=n;
      if(!n){res([]);return}
      arr.forEach(function(p,i){W.Promise.resolve(p).then(function(v){r[i]=v;if(--c===0)res(r)},rej)})
    })
  };
  W.Promise.race=function(it){
    return new W.Promise(function(res,rej){
      var arr=Array.isArray(it)?it:Array.from(it);
      arr.forEach(function(p){W.Promise.resolve(p).then(res,rej)})
    })
  };
  W.Promise.allSettled=function(it){
    return new W.Promise(function(res){
      var arr=Array.isArray(it)?it:Array.from(it),n=arr.length,r=new Array(n),c=n;
      if(!n){res([]);return}
      arr.forEach(function(p,i){W.Promise.resolve(p).then(
        function(v){r[i]={status:'fulfilled',value:v};if(--c===0)res(r)},
        function(e){r[i]={status:'rejected',reason:e};if(--c===0)res(r)}
      )})
    })
  }
}
if(typeof W.fetch==='undefined'){
  W.fetch=function(url,opts){
    return new W.Promise(function(res,rej){
      var o=opts||{},xhr=new XMLHttpRequest();
      xhr.open(o.method||'GET',url,true);
      xhr.responseType='arraybuffer';
      if(o.headers)for(var k in o.headers)if(OPH.call(o.headers,k))xhr.setRequestHeader(k,o.headers[k]);
      xhr.onload=function(){
        var h={};try{var raw=xhr.getAllResponseHeaders();raw.replace(/^([^:\r\n]+):\s*(.+)$/gm,function(_,k,v){h[k.toLowerCase().trim()]=v.trim()})}catch(e){}
        var ab=xhr.response;
        res({ok:xhr.status>=200&&xhr.status<300,status:xhr.status,statusText:xhr.statusText,headers:h,
          text:function(){try{var u=new Uint8Array(ab),s='',c=8192;for(var i=0;i<u.length;i+=c)s+=String.fromCharCode.apply(null,u.subarray(i,i+c));return W.Promise.resolve(s)}catch(e){return W.Promise.resolve('')}},
          json:function(){try{var u=new Uint8Array(ab),s='',c=8192;for(var i=0;i<u.length;i+=c)s+=String.fromCharCode.apply(null,u.subarray(i,i+c));return W.Promise.resolve(JSON.parse(s))}catch(e){return W.Promise.reject(e)}},
          blob:function(){return W.Promise.resolve(new Blob([ab]))}
        })
      };
      xhr.onerror=function(){rej(new TypeError('fetch: network error'))};
      xhr.ontimeout=function(){rej(new TypeError('fetch: timeout'))};
      if(o.signal){if(o.signal.aborted){rej(new DOMException('Aborted','AbortError'));return}o.signal.addEventListener('abort',function(){xhr.abort();rej(new DOMException('Aborted','AbortError'))})}
      xhr.send(o.body||null)
    })
  }
}
if(typeof W.IntersectionObserver==='undefined'){
  var ioInstances=[];
  var ioCheck=function(){
    for(var i=0;i<ioInstances.length;i++){
      var inst=ioInstances[i];
      for(var j=0;j<inst._els.length;j++){
        var el=inst._els[j],rect=el.getBoundingClientRect(),margin=parseInt(inst._opt.rootMargin)||0;
        var isIntersecting=rect.top<W.innerHeight+margin&&rect.bottom>-margin&&rect.left<W.innerWidth+margin&&rect.right>-margin;
        if(isIntersecting!==el._io_prev){el._io_prev=isIntersecting;inst.callback([{target:el,isIntersecting:isIntersecting,boundingClientRect:rect,intersectionRatio:isIntersecting?1:0}])}
      }
    }
  };
  W.addEventListener('scroll',ioCheck,{passive:true});
  W.addEventListener('resize',ioCheck,{passive:true});
  W.IntersectionObserver=function(cb,opts){this.callback=cb;this._opt=opts||{};this._els=[];ioInstances.push(this)};
  W.IntersectionObserver.prototype.observe=function(el){el._io_prev=false;this._els.push(el);ioCheck()};
  W.IntersectionObserver.prototype.unobserve=function(el){this._els=this._els.filter(function(e){return e!==el})};
  W.IntersectionObserver.prototype.disconnect=function(){this._els=[];ioInstances=ioInstances.filter(function(i){return i!==this}.bind(this))}
}
if(!W.requestAnimationFrame){
  var lastTime=0;
  W.requestAnimationFrame=function(cb){var now=Date.now(),delay=Math.max(0,16-(now-lastTime));lastTime=now+delay;return setTimeout(function(){cb(lastTime)},delay)};
  W.cancelAnimationFrame=function(id){clearTimeout(id)}
}
if(typeof W.requestIdleCallback==='undefined'){
  W.requestIdleCallback=function(cb,opts){
    var start=Date.now(),timeout=opts&&opts.timeout;
    return setTimeout(function(){cb({didTimeout:timeout?Date.now()-start>timeout:false,timeRemaining:function(){return Math.max(0,50-(Date.now()-start))}})},1)
  };
  W.cancelIdleCallback=function(id){clearTimeout(id)}
}
if(typeof W.CustomEvent==='undefined'||typeof W.CustomEvent!=='function'){
  W.CustomEvent=function(e,p){var ev=D.createEvent('CustomEvent');p=p||{};ev.initCustomEvent(e,!!p.bubbles,!!p.cancelable,p.detail!==undefined?p.detail:null);return ev};
  W.CustomEvent.prototype=W.Event.prototype
}
if(typeof W.URL==='undefined'){
  W.URL=function(url,base){
    var a=D.createElement('a');
    if(base){
      var b=D.createElement('base');b.href=base;
      var doc=D.implementation.createHTMLDocument('');
      doc.head.appendChild(b);var l=doc.createElement('a');l.href=url;
      a.href=l.href
    }else{a.href=url}
    this.href=a.href;this.protocol=a.protocol;this.host=a.host;this.hostname=a.hostname;
    this.port=a.port;this.pathname=a.pathname;this.search=a.search;this.hash=a.hash;
    this.origin=a.protocol+'//'+a.host;this.toString=function(){return a.href}
  }
}
if(typeof W.queueMicrotask==='undefined'){
  W.queueMicrotask=typeof W.Promise!=='undefined'?function(fn){W.Promise.resolve().then(fn)}:function(fn){setTimeout(fn,0)}
}
if(typeof W.WeakRef==='undefined'){
  W.WeakRef=function(t){this._t=t};
  W.WeakRef.prototype.deref=function(){return this._t}
}
if(!D.querySelector){
  D.querySelector=function(s){return D.querySelectorAll(s)[0]||null}
}
if(typeof W.CSS==='undefined'){W.CSS={}}
if(typeof W.CSS.supports!=='function'){
  W.CSS.supports=function(p,v){
    try{var el=D.createElement('div'),s=el.style;if(v===undefined){var a=p.split(':');if(a.length<2)return false;s[a[0].trim()]=a[1].trim();return s[a[0].trim()]!==''}s[p]=v;return s[p]!==''}catch(e){return false}
  }
}
try{W.localStorage.setItem('__mank_test__','1');W.localStorage.removeItem('__mank_test__')}catch(e){
  var _store={};
  Object.defineProperty(W,'localStorage',{value:{getItem:function(k){return OPH.call(_store,k)?_store[k]:null},setItem:function(k,v){_store[k]=String(v)},removeItem:function(k){delete _store[k]},clear:function(){_store={}},key:function(i){return Object.keys(_store)[i]||null},get length(){return Object.keys(_store).length}},writable:false})
}
if(typeof W.sessionStorage==='undefined'){
  var _sess={};
  Object.defineProperty(W,'sessionStorage',{value:{getItem:function(k){return OPH.call(_sess,k)?_sess[k]:null},setItem:function(k,v){_sess[k]=String(v)},removeItem:function(k){delete _sess[k]},clear:function(){_sess={}},key:function(i){return Object.keys(_sess)[i]||null},get length(){return Object.keys(_sess).length}},writable:false})
}
})(window,document,Object.prototype,Array.prototype,Element.prototype);