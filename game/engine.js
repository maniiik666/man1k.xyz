"use strict";
var VXDOOM=(function(){
var W,H,cvs,ctx,raf,running=false,score=0,best=0,lives=3,level=1;
var dt=0,last=0,tick=0,fA=0,FT=16.667;
var keys={},touch={l:0,r:0,f:0};
var aCtx=null,muted=false,mGain=null;
var ship=null,state="menu",deathTimer=0,paused=false;
var powerUp=0,combo=0,comboT=0,kStreak=0,comboMilestone=0;
var weaponType=0,weaponAmmo=0;
var glitch=false,glitchD=0,glitchT=0;
var shake=0,flash=0,fR=255,fG=20,fB=20,scanY=0;
var waveT=0,waveDelay=130,waveNum=0;
var bossOn=false,boss=null;
var dpr=1;
var bullets=[],enemies=[],sparks=[],drops=[],eBullets=[];
var stars=[],debris=[];
var onDeath=null,onScore=null,onPause=null;
var dashCD=0,dashAct=0;
var slowMo=0,freeze=0;
var warnTxt="",warnT=0;
var R=Math.random,F=Math.floor,abs=Math.abs,sin=Math.sin,cos=Math.cos,PI=Math.PI,atan2=Math.atan2,sqrt=Math.sqrt,mn=Math.min,mx=Math.max;
var rng=function(a,b){return R()*(b-a)+a};
var ri=function(a,b){return F(R()*(b-a+1))+a};
var cl=function(v,a,b){return v<a?a:v>b?b:v};
var lr=function(a,b,t){return a+(b-a)*t};
var hx=function(h){if(!h||h[0]!=="#")return[255,50,50];var v=parseInt(h.slice(1),16);return[(v>>16)&255,(v>>8)&255,v&255]};
var C={bg:"#0c0606",ship:"#ff2828",shipC:"#ff5050",shipG:"#ff2233",bul:"#ff4444",
bulL:"#55eeff",bulS:"#ffee22",bulH:"#ff55ff",
eC:["#bb2244","#33aa33","#2266bb","#aa6622","#7733aa","#558800"],
eG:["#ff3366","#55ff55","#55aaff","#ffbb33","#cc55ff","#bbff55"],
eB:"#66ff66",dr:["#ff5533","#33ff77","#ffdd33","#55aaff","#ff55ff"],
tx:"#ff4444",txD:"#aa4444",txH:"#ff6666",
boss:"#770033",bossG:"#ff2277",bossHP:"#ff3355",cmb:"#ffbb55"};
function initStars(){stars=[];for(var i=0;i<70;i++)stars.push({x:rng(0,W),y:rng(0,H),s:rng(.6,2.2),v:rng(.3,1.4),a:rng(.12,.55)})}
function initDebris(){debris=[];for(var i=0;i<12;i++)debris.push({x:rng(0,W),y:rng(0,H),w:rng(1,3),h:rng(8,35),v:rng(.15,.45),a:rng(.03,.07)})}
function mkShip(){return{x:W/2,y:H-80*dpr,w:42*dpr,h:46*dpr,vx:0,spd:6.5*dpr,fr:7,ft:0,inv:0,trail:[],shield:0,dx:0,tp:0,tilt:0,vy:0}}
function mkBul(){return{x:0,y:0,vx:0,vy:0,w:4*dpr,h:14*dpr,on:false,pow:0}}
function mkEn(){return{x:0,y:0,type:0,w:0,h:0,hp:0,mhp:0,vx:0,vy:0,ph:0,amp:0,ft:0,on:false,rot:0,age:0,hf:0,edge:0,tx:0,ty:0}}
function mkSp(){return{x:0,y:0,vx:0,vy:0,life:0,ml:0,r:0,cr:0,cg:0,cb:0,on:false,gv:0}}
function mkDr(){return{x:0,y:0,vy:0,w:16*dpr,type:0,on:false,ph:0}}
function mkEB(){return{x:0,y:0,vx:0,vy:0,w:5*dpr,on:false}}
var LIM={b:100,e:55,s:200,d:15,eb:70};
function initPools(){bullets=[];enemies=[];sparks=[];drops=[];eBullets=[];
for(var i=0;i<LIM.b;i++)bullets.push(mkBul());for(var i=0;i<LIM.e;i++)enemies.push(mkEn());
for(var i=0;i<LIM.s;i++)sparks.push(mkSp());for(var i=0;i<LIM.d;i++)drops.push(mkDr());
for(var i=0;i<LIM.eb;i++)eBullets.push(mkEB())}
function gp(a,mk,lim){for(var i=0;i<a.length;i++)if(!a[i].on)return a[i];if(a.length<lim){var o=mk();a.push(o);return o}return null}
function fire(x,y,sp,wt){var b=gp(bullets,mkBul,LIM.b);if(!b)return;var wn=wt!==undefined?wt:weaponType;b.x=x;b.y=y;b.vx=(sp||0)*dpr;b.pow=powerUp>0?1:0;b.wt=wn;b.homing=false;
if(wn===0){b.vy=-11*dpr;b.w=(b.pow?6:4)*dpr;b.h=(b.pow?18:14)*dpr}
else if(wn===1){b.vy=-8*dpr;b.w=3*dpr;b.h=22*dpr}
else if(wn===2){b.vy=-14*dpr;b.w=8*dpr;b.h=8*dpr}
else if(wn===3){b.vy=-6*dpr;b.w=5*dpr;b.h=5*dpr;b.homing=true}
b.on=true;snd("shoot")}
function grantWeapon(){var wt=ri(1,3);weaponType=wt;weaponAmmo=ri(18,30);snd("pickup");
var names=["▶ SINGLE","▶ LASER","▶ SCATTER","▶ HOMING"];setW(names[wt]+" ×"+weaponAmmo,50)}
function fireE(x,y,tx,ty){var eb=gp(eBullets,mkEB,LIM.eb);if(!eb)return;var a=atan2(ty-y,tx-x),sp=(2.5+level*.12)*dpr;eb.x=x;eb.y=y;eb.vx=cos(a)*sp;eb.vy=sin(a)*sp;eb.on=true;eb.w=5*dpr}
function boom(x,y,n,cr,cg,cb){for(var i=0;i<n;i++){var s=gp(sparks,mkSp,LIM.s);if(!s)break;var a=rng(0,PI*2),sp=rng(1.5,5.5)*dpr;s.x=x;s.y=y;s.vx=cos(a)*sp;s.vy=sin(a)*sp;s.life=rng(8,25);s.ml=25;s.r=rng(1,3.5)*dpr;s.cr=cr||255;s.cg=cg||30;s.cb=cb||30;s.on=true;s.gv=0}}
function boomRing(x,y,n,rad,cr,cg,cb){for(var i=0;i<n;i++){var s=gp(sparks,mkSp,LIM.s);if(!s)break;var a=PI*2*(i/n);s.x=x+cos(a)*rad*.3;s.y=y+sin(a)*rad*.3;s.vx=cos(a)*rad*.11;s.vy=sin(a)*rad*.11;s.life=16;s.ml=16;s.r=rng(2,3)*dpr;s.cr=cr;s.cg=cg;s.cb=cb;s.on=true;s.gv=0}}
function dropItem(x,y){if(R()>.78)return;var d=gp(drops,mkDr,LIM.d);if(!d)return;d.x=x;d.y=y;d.vy=1.5*dpr;d.type=R()<.12?4:ri(0,3);d.on=true;d.ph=0;d.w=16*dpr}
function spawnEn(type,x,y){var e=gp(enemies,mkEn,LIM.e);if(!e)return;e.x=x||rng(60*dpr,W-60*dpr);e.y=y||rng(-80*dpr,-20*dpr);e.type=type||0;e.on=true;e.ph=rng(0,PI*2);e.rot=0;e.ft=ri(40,140);e.age=0;e.hf=0;e.edge=0;e.tx=0;e.ty=0;var s=dpr,lm=1+level*.08;
if(type===0){e.w=32*s;e.h=32*s;e.hp=1;e.mhp=1;e.vy=.65*s;e.amp=0;e.vx=0}
else if(type===1){e.w=36*s;e.h=36*s;e.hp=2;e.mhp=2;e.vy=.5*s;e.amp=40*s;e.vx=0}
else if(type===2){e.w=42*s;e.h=42*s;e.hp=F(3*lm);e.mhp=e.hp;e.vy=.3*s;e.amp=55*s;e.vx=0}
else if(type===3){e.w=26*s;e.h=26*s;e.hp=1;e.mhp=1;e.vy=1.5*s;e.amp=16*s;e.vx=0}
else if(type===4){e.w=30*s;e.h=30*s;e.hp=F(2*lm);e.mhp=e.hp;e.vy=.28*s;e.amp=0;e.vx=(R()<.5?-1:1)*1.1*s}
else if(type===5){e.w=28*s;e.h=28*s;e.hp=2;e.mhp=2;e.vy=0;e.amp=0;e.vx=0;e.edge=1;
var side=R()<.5?1:-1;e.x=side>0?W+30*s:-30*s;e.y=rng(H*.1,H*.6);e.tx=side>0?-40*s:W+40*s;e.ty=e.y}
else if(type===6){e.w=38*s;e.h=22*s;e.hp=F(4*lm);e.mhp=e.hp;e.vy=.18*s;e.amp=0;e.vx=0}}
function spawnBoss(){bossOn=true;var hp=38+level*13;boss={x:W/2,y:-120*dpr,ty:85*dpr,w:110*dpr,h:65*dpr,hp:hp,mhp:hp,ph:0,ft:0,on:true,entered:false,pat:0,patT:0,burstT:0,rage:false,shf:0,phase:1,phaseT:0,spinAng:0,teleT:0};setW("▲ BOSS ▲",140);snd("boss")}
function setW(t,d){warnTxt=t;warnT=d}
function spawnWave(){waveNum++;var cnt=cl(5+F(level*1.3),5,16);var tp=[0,0,0,1];
if(level>2)tp.push(1,2,4);if(level>4)tp.push(2,3,3,4,5);if(level>6)tp.push(2,2,3,5,6);
if(waveNum%5===0&&level>1){spawnBoss();return}setW("▲ WAVE "+waveNum+" ▲",65);snd("warn");
var fm=waveNum%5;for(var i=0;i<cnt;i++){var t=tp[ri(0,tp.length-1)],ex,ey;
if(fm===0){ex=60*dpr+(W-120*dpr)*(i/(cnt-1||1));ey=-30*dpr-ri(0,45)*dpr}
else if(fm===1){var row=F(i/6),col=i%6;ex=W*.15+col*(W*.14);ey=-30*dpr-row*42*dpr}
else if(fm===2){var ang=PI+PI*(i/(cnt-1||1));ex=W/2+cos(ang)*W*.28;ey=-45*dpr-sin(ang)*W*.07}
else if(fm===3){var side=i%2===0?1:-1;ex=side>0?W+30*dpr:-30*dpr;ey=rng(H*.08,H*.55);t=5}
else{ex=W/2+(i-(cnt>>1))*42*dpr;ey=-30*dpr-F(i/5)*40*dpr;if(level>2&&i<4)t=6}
spawnEn(t,ex,ey)}}
function initAudio(){try{var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;aCtx=new AC();mGain=aCtx.createGain();mGain.gain.value=.72;var comp=aCtx.createDynamicsCompressor();comp.threshold.value=-12;comp.ratio.value=4;comp.knee.value=6;mGain.connect(comp);comp.connect(aCtx.destination)}catch(e){aCtx=null}}
var _audioUnlocked=false;
function unlockAudio(){if(_audioUnlocked)return;_audioUnlocked=true;if(!aCtx)initAudio();if(aCtx&&aCtx.state==="suspended"){aCtx.resume().catch(function(){})}}
function snd(type){if(!aCtx||muted)return;if(aCtx.state==="suspended")aCtx.resume();try{var o=aCtx.createOscillator(),g=aCtx.createGain(),n=aCtx.currentTime;o.connect(g);g.connect(mGain);
if(type==="shoot"){o.type="square";o.frequency.setValueAtTime(1100,n);o.frequency.exponentialRampToValueAtTime(180,n+.05);g.gain.setValueAtTime(.18,n);g.gain.exponentialRampToValueAtTime(.001,n+.05);o.start(n);o.stop(n+.05)}
else if(type==="shootL"){o.type="sawtooth";o.frequency.setValueAtTime(2200,n);o.frequency.exponentialRampToValueAtTime(1800,n+.04);g.gain.setValueAtTime(.14,n);g.gain.exponentialRampToValueAtTime(.001,n+.04);o.start(n);o.stop(n+.04)}
else if(type==="shootS"){o.type="square";o.frequency.setValueAtTime(600,n);o.frequency.exponentialRampToValueAtTime(200,n+.03);g.gain.setValueAtTime(.15,n);g.gain.exponentialRampToValueAtTime(.001,n+.06);o.start(n);o.stop(n+.06)}
else if(type==="shootH"){o.type="triangle";o.frequency.setValueAtTime(440,n);o.frequency.setValueAtTime(880,n+.02);g.gain.setValueAtTime(.13,n);g.gain.exponentialRampToValueAtTime(.001,n+.05);o.start(n);o.stop(n+.05)}
else if(type==="hit"){o.type="sawtooth";o.frequency.setValueAtTime(320,n);o.frequency.exponentialRampToValueAtTime(45,n+.1);g.gain.setValueAtTime(.28,n);g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}
else if(type==="die"){o.type="sawtooth";o.frequency.setValueAtTime(460,n);o.frequency.exponentialRampToValueAtTime(18,n+.5);g.gain.setValueAtTime(.38,n);g.gain.exponentialRampToValueAtTime(.001,n+.5);o.start(n);o.stop(n+.5)}
else if(type==="power"){o.type="sine";o.frequency.setValueAtTime(500,n);o.frequency.exponentialRampToValueAtTime(1300,n+.1);g.gain.setValueAtTime(.22,n);g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}
else if(type==="boss"){o.type="square";o.frequency.setValueAtTime(42,n);o.frequency.setValueAtTime(65,n+.2);o.frequency.setValueAtTime(42,n+.4);g.gain.setValueAtTime(.32,n);g.gain.exponentialRampToValueAtTime(.001,n+.55);o.start(n);o.stop(n+.55)}
else if(type==="lvl"){o.type="triangle";o.frequency.setValueAtTime(440,n);o.frequency.setValueAtTime(660,n+.06);o.frequency.setValueAtTime(880,n+.12);g.gain.setValueAtTime(.22,n);g.gain.exponentialRampToValueAtTime(.001,n+.22);o.start(n);o.stop(n+.22)}
else if(type==="dash"){o.type="sine";o.frequency.setValueAtTime(170,n);o.frequency.exponentialRampToValueAtTime(850,n+.06);g.gain.setValueAtTime(.18,n);g.gain.exponentialRampToValueAtTime(.001,n+.06);o.start(n);o.stop(n+.06)}
else if(type==="shield"){o.type="triangle";o.frequency.setValueAtTime(680,n);o.frequency.exponentialRampToValueAtTime(230,n+.1);g.gain.setValueAtTime(.18,n);g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}
else if(type==="warn"){o.type="square";o.frequency.setValueAtTime(95,n);o.frequency.setValueAtTime(150,n+.08);o.frequency.setValueAtTime(95,n+.16);g.gain.setValueAtTime(.16,n);g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}
else if(type==="pickup"){o.type="sine";o.frequency.setValueAtTime(780,n);o.frequency.setValueAtTime(980,n+.04);o.frequency.setValueAtTime(1150,n+.08);g.gain.setValueAtTime(.22,n);g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}
else if(type==="combo"){o.type="triangle";o.frequency.setValueAtTime(660,n);o.frequency.setValueAtTime(880,n+.05);o.frequency.setValueAtTime(1100,n+.1);o.frequency.setValueAtTime(1320,n+.15);g.gain.setValueAtTime(.3,n);g.gain.exponentialRampToValueAtTime(.001,n+.22);o.start(n);o.stop(n+.22)}
else if(type==="combo10"){o.type="square";o.frequency.setValueAtTime(220,n);o.frequency.setValueAtTime(440,n+.06);o.frequency.setValueAtTime(880,n+.12);o.frequency.setValueAtTime(1760,n+.18);g.gain.setValueAtTime(.38,n);g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}
else if(type==="menu"){o.type="triangle";o.frequency.setValueAtTime(280,n);o.frequency.setValueAtTime(380,n+.04);g.gain.setValueAtTime(.14,n);g.gain.exponentialRampToValueAtTime(.001,n+.07);o.start(n);o.stop(n+.07)}
else if(type==="pause"){o.type="sine";o.frequency.setValueAtTime(300,n);o.frequency.exponentialRampToValueAtTime(100,n+.12);g.gain.setValueAtTime(.18,n);g.gain.exponentialRampToValueAtTime(.001,n+.12);o.start(n);o.stop(n+.12)}
}catch(e){}}
function updShip(){if(!ship)return;var m=0;
if(keys["ArrowLeft"]||keys["KeyA"]||touch.l)m=-1;
if(keys["ArrowRight"]||keys["KeyD"]||touch.r)m=1;
ship.tilt=lr(ship.tilt,m*.12,.1);ship.tp+=.2;
if(dashAct>0){ship.x+=ship.dx;dashAct--;if(dashAct<=0)ship.dx=0}
else{ship.vx=lr(ship.vx,m*ship.spd,.28);ship.x+=ship.vx}
ship.x=cl(ship.x,ship.w/2,W-ship.w/2);
if(ship.vy){ship.y+=ship.vy;ship.vy*=.82;if(abs(ship.vy)<.01)ship.vy=0}
ship.y=cl(ship.y,ship.h/2,H-ship.h/2);
if(ship.inv>0)ship.inv--;if(ship.shield>0)ship.shield--;if(dashCD>0)dashCD--;
if(weaponType>0&&weaponAmmo<=0){weaponType=0;setW("▶ SINGLE",30)}
if((keys["ShiftLeft"]||keys["ShiftRight"])&&dashCD<=0&&m!==0){dashCD=35;dashAct=7;ship.dx=m*14*dpr;ship.inv=8;snd("dash");boom(ship.x,ship.y,4,255,100,50)}
ship.ft--;
if((keys["Space"]||touch.f)&&ship.ft<=0){
var wt=weaponType,fr=ship.fr;
if(wt===0){fr=powerUp>0?3:ship.fr;ship.vy=mx(ship.vy+2.2*dpr,-7*dpr);fire(ship.x,ship.y-ship.h/2,0);if(powerUp>0){fire(ship.x-14*dpr,ship.y-ship.h/2+6*dpr,-1.2);fire(ship.x+14*dpr,ship.y-ship.h/2+6*dpr,1.2)}if(powerUp>120){fire(ship.x-7*dpr,ship.y-ship.h/2,-.4);fire(ship.x+7*dpr,ship.y-ship.h/2,.4)};snd("shoot")}
else if(wt===1){fr=3;ship.vy=mx(ship.vy+1.0*dpr,-4*dpr);for(var li=0;li<3;li++){var b=gp(bullets,mkBul,LIM.b);if(!b)break;b.x=ship.x+(li-1)*8*dpr;b.y=ship.y-ship.h/2;b.vy=-13*dpr;b.vx=0;b.on=true;b.pow=0;b.wt=1;b.w=2*dpr;b.h=28*dpr;b.homing=false;}snd("shootL")}
else if(wt===2){fr=6;ship.vy=mx(ship.vy+3.0*dpr,-9*dpr);for(var si=0;si<5;si++){var ang2=(-2+si)*.22;var b=gp(bullets,mkBul,LIM.b);if(!b)break;b.x=ship.x;b.y=ship.y-ship.h/2;b.vy=cos(ang2)*-11*dpr;b.vx=sin(ang2)*11*dpr;b.on=true;b.pow=0;b.wt=2;b.w=6*dpr;b.h=6*dpr;b.homing=false;}snd("shootS")}
else if(wt===3){fr=12;ship.vy=mx(ship.vy+1.2*dpr,-4*dpr);var b=gp(bullets,mkBul,LIM.b);if(b){b.x=ship.x;b.y=ship.y-ship.h/2;b.vy=-9*dpr;b.vx=0;b.on=true;b.pow=0;b.wt=3;b.w=7*dpr;b.h=7*dpr;b.homing=true;}snd("shootH")}
if(wt>0)weaponAmmo--;
ship.ft=fr}
if(powerUp>0)powerUp--;
ship.trail.unshift({x:ship.x,y:ship.y+ship.h*.3,a:.5});if(ship.trail.length>10)ship.trail.pop();
for(var i=0;i<ship.trail.length;i++)ship.trail[i].a*=.8}
function updBullets(){for(var i=0;i<bullets.length;i++){var b=bullets[i];if(!b.on)continue;
if(b.homing&&ship){var tgt=null,td=99999;for(var ei=0;ei<enemies.length;ei++){if(!enemies[ei].on)continue;var dx2=enemies[ei].x-b.x,dy2=enemies[ei].y-b.y,dd=sqrt(dx2*dx2+dy2*dy2);if(dd<td){td=dd;tgt=enemies[ei]}}if(boss&&boss.on&&boss.entered){var bdx=boss.x-b.x,bdy=boss.y-b.y,bdd=sqrt(bdx*bdx+bdy*bdy);if(bdd<td){td=bdd;tgt=boss}}if(tgt){var ha=atan2(tgt.y-b.y,tgt.x-b.x);b.vx=lr(b.vx,cos(ha)*9*dpr,.08);b.vy=lr(b.vy,sin(ha)*9*dpr,.08)}}
b.y+=b.vy;b.x+=b.vx;
if(b.y<-30||b.y>H+30||b.x<-30||b.x>W+30){b.on=false;continue}
var dmg=b.wt===2?1:(b.wt===3?2:(b.pow?2:1));
for(var j=0;j<enemies.length;j++){var e=enemies[j];if(!e.on)continue;
var hw=b.wt===1?b.w*0.5:b.w,hh=b.wt===1?b.h*0.3:b.h;
if(abs(b.x-e.x)<(hw+e.w)*.44&&abs(b.y-e.y)<(hh+e.h)*.44){
if(b.wt!==1)b.on=false;e.hp-=dmg;e.hf=5;
if(e.hp<=0){e.on=false;var pts=(e.type+1)*15;combo++;comboT=90;kStreak++;
if(combo>2)pts=F(pts*(1+combo*.25));
var cm=combo;
if(cm===10&&cm!==comboMilestone){comboMilestone=cm;doFlash(.55,255,200,50);doShake(6);snd("combo10");setW("★ COMBO x10 ★",60)}
else if(cm===5&&cm!==comboMilestone){comboMilestone=cm;doFlash(.35,255,150,0);doShake(4);snd("combo");setW("★ COMBO x5 ★",50)}
else if(cm>10&&cm%5===0&&cm!==comboMilestone){comboMilestone=cm;doFlash(.45,255,220,80);doShake(5);snd("combo10");setW("★ COMBO x"+cm+" ★",60)}
if(kStreak>=10&&kStreak%10===0){ship.shield=200;snd("shield");setW("◆ SHIELD",45)}
score+=pts;if(onScore)onScore(score,level,lives);var rgb=hx(C.eG[mn(e.type,5)]);
boom(e.x,e.y,10+e.type*2,rgb[0],rgb[1],rgb[2]);boomRing(e.x,e.y,8,e.w,rgb[0],rgb[1],rgb[2]);dropItem(e.x,e.y);snd("hit");doGlitch(3+e.type)}
else boom(e.x,e.y,2,255,140,50);if(b.wt!==1)break}}
if(b.on&&bossOn&&boss&&boss.on&&boss.entered){if(abs(b.x-boss.x)<(boss.w*.44+b.w)&&abs(b.y-boss.y)<(boss.h*.44+b.h)){if(b.wt!==1)b.on=false;boss.hp-=dmg;boss.shf=4;boom(b.x,b.y,3,255,30,80);
if(boss.hp<=0){boss.on=false;bossOn=false;score+=800+level*150;if(onScore)onScore(score,level,lives);
boom(boss.x,boss.y,25,255,50,120);boomRing(boss.x,boss.y,16,boss.w*.6,255,50,150);doGlitch(30);doShake(18);doFlash(1,255,50,120);freeze=6;snd("die");
if(waveNum>=30){state="won";if(score>best){best=score;saveBest()};if(onDeath)onDeath(score,best)}
else{level++;waveDelay=mx(40,waveDelay-12);waveT=0;setW("▲ LEVEL "+level+" ▲",90);snd("lvl")}}}}}}
function updEnemies(){for(var i=0;i<enemies.length;i++){var e=enemies[i];if(!e.on)continue;e.ph+=.02;e.rot+=.015;e.age++;if(e.hf>0)e.hf--;
if(e.type===5){var tx5=e.tx,ty5=e.ty;
if(e.edge===1){e.x=lr(e.x,tx5,.03);e.y=lr(e.y,ty5+sin(e.ph)*25*dpr,.025);
if(abs(e.x-tx5)<5*dpr){e.edge=2;e.tx=ship?ship.x:W/2;e.ty=ship?ship.y-40*dpr:H/2}}
else if(e.edge===2){e.x=lr(e.x,e.tx,.025);e.y=lr(e.y,e.ty,.025);
if(ship&&abs(e.x-ship.x)<e.w&&abs(e.y-ship.y)<e.h){hitShip();e.on=false;boom(e.x,e.y,5,255,200,50)}}
if(e.y>H+60*dpr||e.x<-80*dpr||e.x>W+80*dpr){e.on=false;continue}}
else if(e.type===6){e.y+=e.vy*(slowMo>0?.4:1);
if(e.age%60===0&&ship){fireE(e.x-e.w*.3,e.y+e.h/2,ship.x-20*dpr,ship.y);fireE(e.x,e.y+e.h/2,ship.x,ship.y);fireE(e.x+e.w*.3,e.y+e.h/2,ship.x+20*dpr,ship.y)}
if(e.y>H+55*dpr){e.on=false;continue}
if(ship&&ship.inv<=0&&ship.shield<=0&&abs(e.x-ship.x)<(e.w+ship.w)*.35&&abs(e.y-ship.y)<(e.h+ship.h)*.3){hitShip();e.on=false;boom(e.x,e.y,5,255,50,30)}}
else{
e.y+=e.vy*(slowMo>0?.4:1);if(e.amp>0)e.x+=sin(e.ph)*e.amp*.02;
if(e.vx!==0){e.x+=e.vx;if(e.x<e.w||e.x>W-e.w)e.vx*=-1}
e.x=cl(e.x,e.w/2,W-e.w/2);e.ft--;
if(e.ft<=0&&ship){e.ft=mx(10,ri(45,150)-level*3);if(R()<.28+level*.03){fireE(e.x,e.y+e.h/2,ship.x,ship.y);
if(e.type>=2&&R()<.22){fireE(e.x-10*dpr,e.y+e.h/2,ship.x-25*dpr,ship.y);fireE(e.x+10*dpr,e.y+e.h/2,ship.x+25*dpr,ship.y)}}}
if(e.y>H+55*dpr){e.on=false;continue}
if(ship&&ship.inv<=0&&ship.shield<=0&&abs(e.x-ship.x)<(e.w+ship.w)*.3&&abs(e.y-ship.y)<(e.h+ship.h)*.3){hitShip();e.on=false;boom(e.x,e.y,5,255,50,30)}}}}
function updEB(){for(var i=0;i<eBullets.length;i++){var b=eBullets[i];if(!b.on)continue;
b.x+=b.vx*(slowMo>0?.4:1);b.y+=b.vy*(slowMo>0?.4:1);
if(b.y>H+20||b.y<-20||b.x<-20||b.x>W+20){b.on=false;continue}
if(ship&&ship.inv<=0){if(ship.shield>0&&abs(b.x-ship.x)<(ship.w*.55+b.w)&&abs(b.y-ship.y)<(ship.h*.55+b.w)){b.on=false;boom(b.x,b.y,3,60,160,255);score+=5;continue}
if(abs(b.x-ship.x)<(ship.w*.3+b.w)&&abs(b.y-ship.y)<(ship.h*.3+b.w)){b.on=false;hitShip()}}}}
function updBoss(){if(!bossOn||!boss||!boss.on)return;if(boss.shf>0)boss.shf--;
var hpRatio=boss.hp/boss.mhp;
var newPhase=hpRatio>.65?1:(hpRatio>.3?2:3);
if(newPhase>boss.phase){boss.phase=newPhase;doGlitch(15);doShake(10);doFlash(.6,255,80,200);setW("▲ PHASE "+boss.phase+" ▲",70);snd("boss")}
boss.rage=boss.phase===3;
if(!boss.entered){boss.y=lr(boss.y,boss.ty,.02);if(abs(boss.y-boss.ty)<3*dpr){boss.entered=true;snd("warn")}return}
boss.ph+=.008+boss.phase*.003;boss.patT++;boss.ft--;boss.burstT++;boss.teleT++;boss.spinAng+=.04+boss.phase*.02;
if(boss.phase===1){boss.x=W/2+sin(boss.ph)*(W*.3)}
else if(boss.phase===2){boss.x=W/2+sin(boss.ph)*(W*.38);boss.y=lr(boss.y,85*dpr+sin(boss.ph*.7)*35*dpr,.03)}
else{if(boss.teleT>180&&level>5){boss.teleT=0;boss.x=rng(W*.15,W*.85);boss.y=rng(50*dpr,H*.35);doGlitch(8)}
else{boss.x=lr(boss.x,W/2+sin(boss.ph*1.5)*(W*.4),.04);boss.y=lr(boss.y,60*dpr+sin(boss.ph*.9)*50*dpr,.04)}}
if(boss.ft<=0&&ship){boss.ft=mx(6,22-level*2-boss.phase*3);var p=boss.pat%(3+boss.phase);
if(p===0){fireE(boss.x,boss.y+boss.h/2,ship.x,ship.y)}
else if(p===1){var spread=boss.phase+3;for(var a=0;a<spread;a++){var ang2=-.5+(a/(spread-1))*1.0,eb=gp(eBullets,mkEB,LIM.eb);if(eb){eb.x=boss.x;eb.y=boss.y+boss.h/2;eb.vx=sin(ang2)*(3+boss.phase*.5)*dpr;eb.vy=cos(ang2)*(3+boss.phase*.5)*dpr;eb.on=true;eb.w=5*dpr}}}
else if(p===2){fireE(boss.x-40*dpr,boss.y+boss.h/2,ship.x,ship.y);fireE(boss.x+40*dpr,boss.y+boss.h/2,ship.x,ship.y);fireE(boss.x,boss.y+boss.h/2,ship.x,ship.y)}
else if(p===3&&boss.phase>=2){var n2=8+boss.phase*4;for(var a=0;a<n2;a++){var ang2=PI*2*(a/n2)+boss.spinAng,eb=gp(eBullets,mkEB,LIM.eb);if(eb){eb.x=boss.x;eb.y=boss.y;eb.vx=cos(ang2)*(2.5+boss.phase)*dpr;eb.vy=sin(ang2)*(2.5+boss.phase)*dpr;eb.on=true;eb.w=5*dpr}}}
else if(p===4&&boss.phase===3){for(var qi=0;qi<4;qi++){setTimeout((function(qi2){return function(){if(!bossOn||!boss||!boss.on)return;var n3=12;for(var a=0;a<n3;a++){var ang3=PI*2*(a/n3)+boss.spinAng+qi2*.4,eb2=gp(eBullets,mkEB,LIM.eb);if(eb2){eb2.x=boss.x;eb2.y=boss.y;eb2.vx=cos(ang3)*4*dpr;eb2.vy=sin(ang3)*4*dpr;eb2.on=true;eb2.w=6*dpr}}}})(qi),qi*120)}}
if(boss.patT>mx(30,70-boss.phase*12)){boss.pat++;boss.patT=0}
if(boss.rage&&boss.burstT>100){boss.burstT=0;for(var a=0;a<16;a++){var ang2=PI*2*(a/16)+boss.spinAng,eb=gp(eBullets,mkEB,LIM.eb);if(eb){eb.x=boss.x;eb.y=boss.y;eb.vx=cos(ang2)*4.5*dpr;eb.vy=sin(ang2)*4.5*dpr;eb.on=true;eb.w=7*dpr}}doGlitch(6);snd("warn")}}}
function updDrops(){for(var i=0;i<drops.length;i++){var d=drops[i];if(!d.on)continue;d.y+=d.vy;d.ph+=.08;
if(d.y>H+30){d.on=false;continue}
if(ship&&abs(d.x-ship.x)<24*dpr&&abs(d.y-ship.y)<24*dpr){d.on=false;var rgb=hx(C.dr[d.type]);
if(d.type===0){powerUp=320;snd("pickup");setW("⚡ POWER",30)}
else if(d.type===1){lives=mn(lives+1,5);snd("pickup");setW("♥ +1 LIFE",30)}
else if(d.type===2){score+=80;snd("pickup");setW("★ +80",30)}
else if(d.type===3){ship.shield=220;snd("shield");setW("◆ SHIELD",30)}
else if(d.type===4){grantWeapon()}
boom(d.x,d.y,5,rgb[0],rgb[1],rgb[2]);if(onScore)onScore(score,level,lives)}}}
function updSparks(){for(var i=0;i<sparks.length;i++){var s=sparks[i];if(!s.on)continue;s.x+=s.vx;s.y+=s.vy+s.gv;s.vx*=.93;s.vy*=.93;s.life--;if(s.life<=0)s.on=false}}
function updStars(){for(var i=0;i<stars.length;i++){var s=stars[i];s.y+=s.v;if(s.y>H){s.y=0;s.x=rng(0,W)}}}
function updDebris(){for(var i=0;i<debris.length;i++){var d=debris[i];d.y+=d.v;if(d.y>H+d.h){d.y=-d.h;d.x=rng(0,W)}}}
function hitShip(){if(!ship||ship.inv>0)return;
if(ship.shield>0){ship.shield=0;boom(ship.x,ship.y,10,60,120,255);snd("shield");return}
lives--;combo=0;kStreak=0;ship.inv=95;boom(ship.x,ship.y,22,255,40,40);boomRing(ship.x,ship.y,14,ship.w,255,60,40);doShake(16);doFlash(.9,255,30,20);doGlitch(20);snd("die");
if(onScore)onScore(score,level,lives);if(lives<=0){state="dead";deathTimer=140;slowMo=20;if(score>best){best=score;saveBest()};if(onDeath)onDeath(score,best)}}
function doGlitch(d){glitch=true;glitchD=d||ri(3,10);glitchT=0}
function doShake(a){shake=mx(shake,a)}
function doFlash(a,r,g,b){flash=mx(flash,a);fR=r||255;fG=g||20;fB=b||20}
function updGlitch(){if(glitch){glitchT++;if(glitchT>=glitchD)glitch=false}
if(shake>0){shake*=.83;if(shake<.1)shake=0}
if(flash>0){flash*=.86;if(flash<.01)flash=0}
scanY=(scanY+3*dpr)%H;if(comboT>0)comboT--;if(comboT<=0){combo=0;comboMilestone=0}if(warnT>0)warnT--;if(slowMo>0)slowMo--;if(freeze>0)freeze--;if(R()<.022)doGlitch(ri(3,9));if(R()<.008)doShake(ri(1,3))}
function tri(c,x,y,w,h,inv){if(!w||!h)return;c.beginPath();if(inv){c.moveTo(x,y+h/2);c.lineTo(x-w/2,y-h/2);c.lineTo(x+w/2,y-h/2)}else{c.moveTo(x,y-h/2);c.lineTo(x-w/2,y+h/2);c.lineTo(x+w/2,y+h/2)}c.closePath()}
function drawBg(c){c.fillStyle=C.bg;c.fillRect(0,0,W,H);
for(var i=0;i<debris.length;i++){var d=debris[i];c.globalAlpha=d.a;c.fillStyle="#3a0a0a";c.fillRect(d.x,d.y,d.w,d.h)}
for(var i=0;i<stars.length;i++){var s=stars[i];c.globalAlpha=s.a;c.fillStyle="#ff3838";c.fillRect(s.x,s.y,s.s,s.s)}c.globalAlpha=1}
function drawShip(c){if(!ship)return;if(ship.inv>0&&tick%5<2)return;
for(var i=ship.trail.length-1;i>=0;i--){var t=ship.trail[i];c.globalAlpha=t.a*.35;c.fillStyle="#ff2828";c.fillRect(t.x-2*dpr,t.y,4*dpr,2*dpr)}c.globalAlpha=1;
c.save();c.translate(ship.x,ship.y);c.rotate(ship.tilt);
if(ship.shield>0){c.strokeStyle="rgba(80,180,255,"+((.3+sin(tick*.12)*.15).toFixed(2))+")";c.lineWidth=2*dpr;c.beginPath();c.arc(0,0,ship.w*.72,0,PI*2);c.stroke()}
if(dashAct>0)c.globalAlpha=.4;
c.fillStyle=C.ship;tri(c,0,0,ship.w,ship.h,true);c.fill();
c.fillStyle=C.shipC;tri(c,0,ship.h*.05,ship.w*.38,ship.h*.45,true);c.fill();
c.fillStyle=C.shipG;c.globalAlpha=.45+sin(ship.tp)*.25;
var fh=7*dpr+sin(ship.tp)*3*dpr;c.fillRect(-2*dpr,ship.h/2-2*dpr,4*dpr,fh);c.fillRect(-ship.w*.28,ship.h*.28,2*dpr,fh*.5);c.fillRect(ship.w*.28-2*dpr,ship.h*.28,2*dpr,fh*.5);
if(powerUp>0){c.globalAlpha=.14+sin(tick*.1)*.08;c.fillStyle="#ff6622";c.beginPath();c.arc(0,0,ship.w*.52,0,PI*2);c.fill()}
c.globalAlpha=1;c.restore()}
function drawEn(c){for(var i=0;i<enemies.length;i++){var e=enemies[i];if(!e.on)continue;
c.save();c.translate(e.x,e.y);
if(e.hf>0)c.globalAlpha=.55+R()*.45;else c.globalAlpha=.8+e.hp/e.mhp*.2;
c.fillStyle=C.eC[e.type]||"#bb2244";
if(e.type<=1){if(e.type===1){c.save();c.rotate(e.ph*.4)}tri(c,0,0,e.w,e.h,false);c.fill();c.fillStyle=C.eG[e.type];c.globalAlpha*=.25;tri(c,0,e.h*.08,e.w*.4,e.h*.35,false);c.fill();if(e.type===1)c.restore()}
else if(e.type===2){tri(c,0,0,e.w,e.h,false);c.fill();c.fillStyle=C.eC[2];c.globalAlpha*=.6;tri(c,0,0,e.w*.6,e.h*.6,true);c.fill()}
else if(e.type===3){c.save();c.rotate(e.rot*2);tri(c,0,0,e.w,e.h,false);c.fill();c.restore()}
else if(e.type===4){var pts=5;c.beginPath();for(var p=0;p<pts;p++){var a=PI*2*(p/pts)-PI/2+e.rot,r=e.w/2,r2=e.w*.22;c.lineTo(cos(a)*r,sin(a)*r);c.lineTo(cos(a+PI/pts)*r2,sin(a+PI/pts)*r2)}c.closePath();c.fill()}
else if(e.type===5){c.fillStyle="#778800";tri(c,0,0,e.w,e.h,false);c.fill();c.fillStyle=C.eG[5];c.globalAlpha*=.35;c.beginPath();c.arc(0,0,e.w*.4,0,PI*2);c.fill();c.globalAlpha=.65+sin(e.ph*3)*.3;c.strokeStyle="#bbff55";c.lineWidth=1.5*dpr;c.beginPath();c.arc(0,0,e.w*.55,0,PI*2);c.stroke()}
else if(e.type===6){c.fillStyle="#3333aa";c.fillRect(-e.w/2,-e.h/2,e.w,e.h);c.fillStyle="#5544cc";c.globalAlpha*=.55;c.fillRect(-e.w/2+2*dpr,-e.h/2+2*dpr,e.w-4*dpr,e.h*.4);c.globalAlpha=.85;c.strokeStyle="#7766ff";c.lineWidth=2*dpr;c.strokeRect(-e.w/2,-e.h/2,e.w,e.h)}
c.globalAlpha=1;c.restore()}}
function drawBul(c){for(var i=0;i<bullets.length;i++){var b=bullets[i];if(!b.on)continue;
var wt=b.wt||0;
if(wt===1){c.globalAlpha=.92;c.fillStyle=C.bulL;c.fillRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h);c.globalAlpha=.18;c.fillStyle="#aaeeff";c.fillRect(b.x-b.w*2,b.y,b.w*4,b.h*.2);c.globalAlpha=1}
else if(wt===2){c.globalAlpha=.92;c.fillStyle=C.bulS;c.beginPath();c.arc(b.x,b.y,b.w/2,0,PI*2);c.fill();c.globalAlpha=.35;c.fillStyle="#ffffaa";c.beginPath();c.arc(b.x,b.y,b.w,0,PI*2);c.fill();c.globalAlpha=1}
else if(wt===3){c.globalAlpha=.92;c.fillStyle=C.bulH;c.beginPath();c.arc(b.x,b.y,b.w/2,0,PI*2);c.fill();c.globalAlpha=.45;c.fillStyle="#ff88ff";c.beginPath();c.arc(b.x,b.y,b.w*.9,0,PI*2);c.fill();c.globalAlpha=.12;c.beginPath();c.arc(b.x,b.y,b.w*1.8,0,PI*2);c.fill();c.globalAlpha=1}
else if(b.pow){c.fillStyle="#ffbb55";c.fillRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h);c.globalAlpha=.28;c.fillRect(b.x-b.w,b.y-b.h*.3,b.w*2,b.h*.6);c.globalAlpha=1}
else{c.fillStyle=C.bul;c.fillRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h)}}}
function drawEB(c){c.fillStyle=C.eB;for(var i=0;i<eBullets.length;i++){var b=eBullets[i];if(!b.on)continue;c.fillRect(b.x-b.w,b.y-b.w,b.w*2,b.w*2);c.globalAlpha=.28;c.fillStyle="#aaffaa";c.fillRect(b.x-b.w*.4,b.y-b.w*.4,b.w*.8,b.w*.8);c.globalAlpha=1;c.fillStyle=C.eB}}
function drawBoss(c){if(!bossOn||!boss||!boss.on)return;c.save();c.translate(boss.x,boss.y);
var ph=boss.phase||1;var bc=ph===3?"#880033":(ph===2?"#664400":C.boss);
c.fillStyle=bc;tri(c,0,0,boss.w,boss.h,false);c.fill();
c.fillStyle="#220010";c.fillRect(-boss.w*.16,-boss.h*.2,boss.w*.1,boss.h*.18);c.fillRect(boss.w*.06,-boss.h*.2,boss.w*.1,boss.h*.18);
c.fillStyle=ph===3?"#ff0044":(ph===2?"#ff7700":"#ff0044");c.globalAlpha=.3;c.fillRect(-boss.w*.25,boss.h*.08,boss.w*.5,boss.h*.04);c.globalAlpha=1;
var gc2=ph===3?"#ff0055":(ph===2?"#ff9933":"#ff2277");c.fillStyle=gc2;c.globalAlpha=.35+sin(tick*.05)*.15;
for(var i=-3;i<=3;i++){c.fillRect(i*13*dpr-2*dpr,boss.h/2-3*dpr,4*dpr,5*dpr+sin(tick*.18+i)*2*dpr)}c.globalAlpha=1;
if(ph>=2){c.strokeStyle="rgba(255,"+(ph===3?"60,60":"160,60")+","+(.3+sin(tick*.08)*.12).toFixed(2)+")";c.lineWidth=2*dpr;for(var ri3=0;ri3<ph;ri3++){c.beginPath();c.arc(0,0,(boss.w*.4+ri3*14)*dpr/dpr,(tick*.03+ri3*.6)%(PI*2),(tick*.03+ri3*.6+PI)%(PI*2));c.stroke()}}
if(boss.shf>0){c.strokeStyle="rgba(255,110,160,.6)";c.lineWidth=2.5*dpr;tri(c,0,0,boss.w+8*dpr,boss.h+8*dpr,false);c.stroke()}
c.fillStyle="#0a0008";c.fillRect(-boss.w/2,-boss.h/2-14*dpr,boss.w,8*dpr);
var hpf=boss.hp/boss.mhp;c.fillStyle=hpf>.6?C.bossHP:(hpf>.3?"#ff8800":"#ff0044");c.fillRect(-boss.w/2,-boss.h/2-14*dpr,boss.w*hpf,8*dpr);
c.fillStyle="#aa4455";c.font=F(7*dpr)+"px monospace";c.textAlign="center";c.fillText("PHASE "+ph,0,-boss.h/2-17*dpr);
c.restore()}
function drawDrops(c){for(var i=0;i<drops.length;i++){var d=drops[i];if(!d.on)continue;c.fillStyle=C.dr[mn(d.type,4)];c.globalAlpha=.6+sin(d.ph)*.3;c.beginPath();c.arc(d.x,d.y,d.w/2,0,PI*2);c.fill();c.globalAlpha=.18;c.strokeStyle=C.dr[mn(d.type,4)];c.lineWidth=dpr;c.beginPath();c.arc(d.x,d.y,d.w/2+3*dpr+sin(d.ph*2)*2*dpr,0,PI*2);c.stroke();c.globalAlpha=1;
if(d.type===4){c.fillStyle="#ff55ff";c.globalAlpha=.85;c.font="bold "+F(9*dpr)+"px monospace";c.textAlign="center";c.fillText("W",d.x,d.y+3*dpr);c.globalAlpha=1}}}
function drawSparks(c){for(var i=0;i<sparks.length;i++){var s=sparks[i];if(!s.on)continue;var t=s.life/s.ml;c.globalAlpha=t;c.fillStyle="rgb("+s.cr+","+s.cg+","+s.cb+")";c.fillRect(s.x-s.r,s.y-s.r,s.r*2,s.r*2)}c.globalAlpha=1}
function drawHUD(c){c.font="bold "+F(16*dpr)+"px monospace";c.fillStyle=C.txH;c.textAlign="left";c.fillText(score,12*dpr,24*dpr);
c.font=F(8*dpr)+"px monospace";c.fillStyle=C.txD;c.fillText("HI "+best,12*dpr,35*dpr);
c.textAlign="right";c.fillStyle=C.txH;c.font="bold "+F(11*dpr)+"px monospace";c.fillText("LV"+level,W-12*dpr,24*dpr);c.fillText("W"+waveNum,W-12*dpr,36*dpr);
for(var i=0;i<5;i++){c.fillStyle=i<lives?"#ff3344":"#220808";tri(c,W-12*dpr-i*15*dpr,46*dpr,9*dpr,9*dpr,false);c.fill()}
if(ship&&ship.shield>0){c.fillStyle="#66aaff";c.textAlign="center";c.font=F(8*dpr)+"px monospace";c.fillText("SHIELD "+F(ship.shield/60)+"s",W/2,H-26*dpr)}
if(powerUp>0){c.fillStyle=C.cmb;c.textAlign="center";c.font=F(8*dpr)+"px monospace";c.fillText("POWER "+F(powerUp/60)+"s",W/2,H-14*dpr)}
if(combo>1){c.textAlign="center";c.fillStyle=combo>=10?"#ffff00":(combo>=5?"#ffbb00":C.cmb);c.globalAlpha=cl(comboT/80,0,1);c.font="bold "+F(28*dpr)+"px monospace";c.fillText("x"+combo,W/2,H*.35);c.globalAlpha=1}
if(kStreak>=5){c.textAlign="center";c.font="bold "+F(9*dpr)+"px monospace";c.fillStyle=kStreak>=10?"#66aaff":"#ff8855";c.fillText("STREAK "+kStreak,W/2,H*.42)}
if(warnT>0){c.textAlign="center";c.font="bold "+F(14*dpr)+"px monospace";c.globalAlpha=mn(1,warnT/20);c.fillStyle="#ff5555";c.fillText(warnTxt,W/2,H*.25);c.globalAlpha=1}
if(dashCD>0){var dp=1-dashCD/35;c.fillStyle="#220a0a";c.fillRect(W/2-20*dpr,H-6*dpr,40*dpr,3*dpr);c.fillStyle="rgba(255,90,50,"+((.35+dp*.5).toFixed(2))+")";c.fillRect(W/2-20*dpr,H-6*dpr,40*dpr*dp,3*dpr)}
if(paused){c.fillStyle="rgba(5,0,0,.92)";c.fillRect(0,0,W,H);
var bx=W/2,by=H*.22,bw=mn(W*.7,310*dpr),bh=242*dpr;
c.fillStyle="rgba(18,4,4,.98)";c.fillRect(bx-bw/2,by,bw,bh);
c.strokeStyle="#773333";c.lineWidth=2*dpr;c.strokeRect(bx-bw/2,by,bw,bh);
c.strokeStyle="#552222";c.lineWidth=1*dpr;c.strokeRect(bx-bw/2+3*dpr,by+3*dpr,bw-6*dpr,bh-6*dpr);
c.textAlign="center";c.fillStyle="#ff6666";c.font="bold "+F(22*dpr)+"px monospace";c.fillText("── PAUSED ──",bx,by+32*dpr);
c.strokeStyle="#552222";c.lineWidth=dpr;c.beginPath();c.moveTo(bx-bw/2+12*dpr,by+42*dpr);c.lineTo(bx+bw/2-12*dpr,by+42*dpr);c.stroke();
c.font=F(9*dpr)+"px monospace";
var rows=[["MOVE","← → / A D"],["FIRE","SPACE"],["DASH","SHIFT + dir"],["PAUSE","ESC"]];
var rowH=38*dpr;
for(var ri2=0;ri2<rows.length;ri2++){var ry=by+60*dpr+ri2*rowH;
c.fillStyle="rgba(70,15,15,.7)";c.fillRect(bx-bw/2+10*dpr,ry-14*dpr,bw-20*dpr,28*dpr);
c.strokeStyle="#552222";c.lineWidth=dpr;c.strokeRect(bx-bw/2+10*dpr,ry-14*dpr,bw-20*dpr,28*dpr);
c.fillStyle="#ff6666";c.textAlign="left";c.fillText(rows[ri2][0],bx-bw/2+20*dpr,ry+4*dpr);
c.fillStyle="#dd5555";c.textAlign="right";c.fillText(rows[ri2][1],bx+bw/2-20*dpr,ry+4*dpr)}
if(sin(tick*.08)>0){c.fillStyle="#ff5555";c.font="bold "+F(9*dpr)+"px monospace";c.fillText("[ ESC ] RESUME",bx,by+bh-10*dpr)}}}
function drawVHS(c){if(glitch){var n=ri(2,6);for(var g=0;g<n;g++){var gy=ri(0,H),gh=ri(1,8)*dpr,gx=ri(-25,25)*dpr;c.fillStyle="rgba(255,0,0,"+((.12+R()*.14).toFixed(3))+")";c.fillRect(gx,gy,W,gh);c.fillStyle="rgba(0,255,0,"+((.06+R()*.08).toFixed(3))+")";c.fillRect(-gx,gy+gh,W,gh);if(R()<.4){c.fillStyle="rgba(0,0,255,"+((.05+R()*.06).toFixed(3))+")";c.fillRect(gx*.5,gy+gh*2,W,gh*.5)}}
if(R()<.45){c.fillStyle="rgba(0,0,0,.35)";c.fillRect(0,ri(0,H),W,ri(3,22)*dpr)}
if(R()<.35){c.fillStyle="rgba("+ri(60,120)+","+ri(8,30)+","+ri(8,40)+",.18)";c.fillRect(ri(0,W*.5),ri(0,H),ri(20,140)*dpr,ri(10,60)*dpr)}
if(R()<.2){c.save();c.globalAlpha=.12;c.fillStyle="#ff0000";var stripY=ri(0,H);c.fillRect(0,stripY,W,ri(4,18)*dpr);c.restore()}}
c.fillStyle="#ff3333";c.globalAlpha=.1;c.fillRect(0,scanY-dpr,W,4*dpr);c.globalAlpha=1;
if(flash>0){c.globalAlpha=flash*.55;c.fillStyle="rgb("+F(fR)+","+F(fG)+","+F(fB)+")";c.fillRect(0,0,W,H);c.globalAlpha=1}}
function resetGame(){score=0;lives=3;level=1;powerUp=0;combo=0;comboT=0;kStreak=0;comboMilestone=0;dashCD=0;dashAct=0;slowMo=0;freeze=0;warnT=0;weaponType=0;weaponAmmo=0;ship=mkShip();
for(var i=0;i<bullets.length;i++)bullets[i].on=false;for(var i=0;i<enemies.length;i++)enemies[i].on=false;for(var i=0;i<sparks.length;i++)sparks[i].on=false;for(var i=0;i<drops.length;i++)drops[i].on=false;for(var i=0;i<eBullets.length;i++)eBullets[i].on=false;
bossOn=false;boss=null;waveNum=0;waveT=0;waveDelay=130;glitch=false;shake=0;flash=0;if(onScore)onScore(0,1,3)}
function update(){if(paused)return;if(freeze>0){freeze--;return}tick++;updGlitch();updStars();updDebris();
if(state==="play"){updShip();updBullets();updEnemies();updEB();updBoss();updDrops();updSparks();waveT++;
var alive=0;for(var i=0;i<enemies.length;i++)if(enemies[i].on)alive++;
if(waveT>=waveDelay&&alive===0&&!bossOn){waveT=0;spawnWave();if(waveNum>0&&waveNum%3===0){level++;waveDelay=mx(40,waveDelay-10);setW("▲ LEVEL "+level+" ▲",80);snd("lvl")}}}
if(state==="dead"){updSparks();if(deathTimer>0)deathTimer--}
if(state==="won"){updSparks();updStars()}}
function render(){if(!ctx)return;ctx.save();if(shake>0)ctx.translate(rng(-shake,shake)*dpr,rng(-shake,shake)*dpr);
drawBg(ctx);if(state==="play"){drawSparks(ctx);drawDrops(ctx);drawEn(ctx);drawBoss(ctx);drawBul(ctx);drawEB(ctx);drawShip(ctx);drawHUD(ctx)}
if(state==="dead"){drawSparks(ctx);ctx.fillStyle="rgba(8,2,2,.88)";ctx.fillRect(0,0,W,H)}
if(state==="won"){drawSparks(ctx);ctx.fillStyle="rgba(8,4,0,.85)";ctx.fillRect(0,0,W,H);
ctx.textAlign="center";ctx.fillStyle="#ffcc44";ctx.font="bold "+F(28*dpr)+"px monospace";ctx.fillText("▲ SIGNAL CLEARED ▲",W/2,H*.3);
ctx.font="bold "+F(42*dpr)+"px monospace";ctx.fillText(score,W/2,H*.43);
ctx.font=F(11*dpr)+"px monospace";ctx.fillStyle="#ffaa33";ctx.fillText("FINAL SCORE",W/2,H*.5);
ctx.fillStyle="#cc8822";ctx.fillText("BEST: "+best,W/2,H*.57)}
drawVHS(ctx);ctx.restore()}
function loop(ts){if(!running)return;if(!last)last=ts;dt=ts-last;last=ts;fA+=dt;var steps=0;while(fA>=FT&&steps<3){update();fA-=FT;steps++}render();raf=requestAnimationFrame(loop)}
function resize(){var p=cvs.parentElement;if(!p)return;dpr=mn(window.devicePixelRatio||1,2);var rw=p.clientWidth,rh=p.clientHeight;W=F(rw*dpr);H=F(rh*dpr);cvs.width=W;cvs.height=H;cvs.style.width=rw+"px";cvs.style.height=rh+"px";initStars();initDebris();if(ship){ship.x=cl(ship.x,ship.w/2,W-ship.w/2);ship.y=H-80*dpr;ship.w=42*dpr;ship.h=46*dpr;ship.spd=6.5*dpr}}
function saveBest(){if(best<=0)return;try{var r=indexedDB.open("vxd",1);r.onupgradeneeded=function(e){e.target.result.createObjectStore("s",{keyPath:"id"})};r.onsuccess=function(e){try{e.target.result.transaction("s","readwrite").objectStore("s").put({id:"b",v:best})}catch(x){}}}catch(e){try{localStorage.setItem("vxb",best)}catch(x){}}}
function loadBest(cb){try{var r=indexedDB.open("vxd",1);r.onupgradeneeded=function(e){e.target.result.createObjectStore("s",{keyPath:"id"})};r.onsuccess=function(e){try{var g=e.target.result.transaction("s","readonly").objectStore("s").get("b");g.onsuccess=function(){if(g.result)best=g.result.v;if(cb)cb()};g.onerror=function(){try{var v=parseInt(localStorage.getItem("vxb"));if(v>0)best=v}catch(x){};if(cb)cb()}}catch(x){if(cb)cb()}};r.onerror=function(){try{var v=parseInt(localStorage.getItem("vxb"));if(v>0)best=v}catch(x){};if(cb)cb()}}catch(e){if(cb)cb()}}
function bindKeys(){window.addEventListener("keydown",function(e){keys[e.code]=true;if(e.code==="Space")e.preventDefault();if(e.code==="CapsLock"){keys={}}});window.addEventListener("keyup",function(e){keys[e.code]=false});window.addEventListener("blur",function(){keys={}});document.addEventListener("visibilitychange",function(){if(document.hidden)keys={}})}
function bindTouch(L,R,F){function ts(el,k){if(!el)return;el.addEventListener("touchstart",function(e){e.preventDefault();touch[k]=1},{passive:false});el.addEventListener("touchend",function(e){e.preventDefault();touch[k]=0},{passive:false});el.addEventListener("touchcancel",function(){touch[k]=0})}ts(L,"l");ts(R,"r");ts(F,"f")}
return{
init:function(c,opts){cvs=c;ctx=cvs.getContext("2d",{alpha:false});opts=opts||{};initPools();resize();
var _gestureEvents=["touchstart","mousedown","keydown","pointerdown"];
function _onGesture(){unlockAudio();for(var _i=0;_i<_gestureEvents.length;_i++)document.removeEventListener(_gestureEvents[_i],_onGesture,{once:true,passive:true})}
for(var _i=0;_i<_gestureEvents.length;_i++)document.addEventListener(_gestureEvents[_i],_onGesture,{once:true,passive:true});
loadBest(function(){});bindKeys();if(opts.tL)bindTouch(opts.tL,opts.tR,opts.tF);state="menu";running=true;raf=requestAnimationFrame(loop);onDeath=opts.onDeath||null;onScore=opts.onScore||null;onPause=opts.onPause||null},
destroy:function(){running=false;if(raf)cancelAnimationFrame(raf);if(aCtx)try{aCtx.close()}catch(e){}},
score:function(){return score},best:function(){return best},state:function(){return state},paused:function(){return paused},
setMute:function(m){muted=m;if(mGain)mGain.gain.value=m?0:.72},
muted:function(){return muted},resize:resize,
setPause:function(p){if(state!=="play")return;paused=!!p;snd("pause");if(onPause)onPause(paused)},
togglePause:function(){if(state==="play"){paused=!paused;snd("pause");if(onPause)onPause(paused)}},
goMenu:function(){state="menu";paused=false},restart:function(){resetGame();state="play";paused=false},snd:snd,
resumeAudio:function(){unlockAudio();if(aCtx&&aCtx.state==="suspended")aCtx.resume().catch(function(){})}};
})();