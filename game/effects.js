"use strict";
(function () {
    var root = document.getElementById("root"), gc = document.getElementById("gc");
    if (!root || !gc) return;
    var nC = document.createElement("canvas"); nC.width = 128; nC.height = 128;
    nC.style.cssText = "position:absolute;inset:0;z-index:8;pointer-events:none;opacity:.28;mix-blend-mode:overlay;width:100%;height:100%;image-rendering:pixelated";
    root.appendChild(nC);
    var nX = nC.getContext("2d", { alpha: false }), nI = nX.createImageData(128, 128), nP = nI.data;
    var scanH = document.createElement("div");
    scanH.style.cssText = "position:absolute;left:0;right:0;height:2px;z-index:14;pointer-events:none;background:linear-gradient(90deg,transparent,rgba(255,200,180,.12),rgba(255,60,60,.08),transparent);opacity:.5;top:0";
    root.appendChild(scanH);
    var tk = 0, scanPos = 0, rootH = root.offsetHeight || 600;
    window.addEventListener('resize', function () { rootH = root.offsetHeight || 600; }, { passive: true });
    function efx() {
        tk++;
        scanPos = (scanPos + 2.8) % rootH; scanH.style.top = scanPos + "px";
        if (tk % 3 === 0) { var sz = 128, len = sz * sz * 4; for (var ni = 0; ni < len; ni += 4) { var v = (Math.random() * 35) | 0; nP[ni] = v + ((Math.random() * 8) | 0); nP[ni + 1] = v; nP[ni + 2] = v; nP[ni + 3] = 255 } nX.putImageData(nI, 0, 0) }
        var st = typeof VXDOOM !== "undefined" ? VXDOOM.state() : "menu", isP = st === "play";
        if (isP && tk % 7 === 0) {
            if (Math.random() < .06) { root.style.transform = "translateX(" + (Math.random() * 6 - 3).toFixed(1) + "px)"; setTimeout(function () { root.style.transform = "" }, 12 + Math.random() * 15) }
            if (Math.random() < .025) { root.style.filter = "brightness(1.3) contrast(1.5) saturate(1.8)"; setTimeout(function () { root.style.filter = "" }, 10 + Math.random() * 12) }
            if (Math.random() < .02) { gc.style.opacity = "0.5"; setTimeout(function () { gc.style.opacity = "" }, 8) }
            if (Math.random() < .03) { gc.style.transform = "translateY(" + (Math.random() * 5 - 2.5).toFixed(1) + "px)"; setTimeout(function () { gc.style.transform = "" }, 14) }
        }
        requestAnimationFrame(efx)
    }
    requestAnimationFrame(efx);
    var sc = document.getElementById("scanlines"); if (sc) { var sP = 0, sdTk = 0; (function sd() { requestAnimationFrame(sd); if (++sdTk % 2) return; sP += .012; sc.style.backgroundSize = "100% " + (3 + Math.sin(sP) * .5).toFixed(2) + "px"; sc.style.opacity = (.35 + Math.sin(sP * .7) * .08).toFixed(2) })() }
    var vig = document.getElementById("vignette"); if (vig) { var vP = 0; setInterval(function () { vP += .028; vig.style.background = "radial-gradient(ellipse at center,transparent " + (25 + Math.sin(vP) * 5 | 0) + "%,rgba(0,0,0,.85) 100%)" }, 100) }
    var rgb = document.getElementById("crt-rgb"); if (rgb) setInterval(function () { rgb.style.opacity = (.35 + Math.random() * .15).toFixed(2) }, 120);
    var dm = document.getElementById("dimmer"); if (dm) { var dP = 0; setInterval(function () { dP += .025; dm.style.opacity = (.06 + Math.sin(dP) * .03).toFixed(3) }, 140) }
    var chars = "\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3";
    var mg = document.getElementById("mg");
    setInterval(function () {
        if (typeof VXDOOM === "undefined" || VXDOOM.state() !== "menu" || !mg) return;
        if (mg.children.length > 40) return;
        if (Math.random() < .22) { var ch = document.createElement("span"); ch.textContent = chars[Math.random() * chars.length | 0]; ch.style.cssText = "position:absolute;left:" + (Math.random() * 100 | 0) + "%;top:-12px;font-family:'DotGothic16',sans-serif;font-size:" + (5 + Math.random() * 5 | 0) + "px;color:rgba(255,50,50," + (0.04 + Math.random() * .06).toFixed(2) + ");pointer-events:none;z-index:0;transition:top 5s linear,opacity 2s"; mg.appendChild(ch); requestAnimationFrame(function () { ch.style.top = "108%"; ch.style.opacity = "0" }); setTimeout(function () { if (ch.parentNode) ch.parentNode.removeChild(ch) }, 6000) }
    }, 350);
    var vhsB = document.getElementById("vhs-bleed"); if (vhsB) { var bP = 0; setInterval(function () { bP += .018; vhsB.style.opacity = (.25 + Math.sin(bP) * .12).toFixed(2) }, 200) }
    var tl = document.getElementById("tearline"); if (tl) { setInterval(function () { if (Math.random() < .35) { tl.style.height = (1 + Math.random() * 4 | 0) + "px"; tl.style.opacity = (.3 + Math.random() * .3).toFixed(2) } }, 500) }
    var strobe = document.getElementById("strobe");
    if (strobe) { setInterval(function () { var st2 = typeof VXDOOM !== "undefined" ? VXDOOM.state() : "menu"; if (st2 === "play" && Math.random() < .025) { strobe.style.opacity = (.05 + Math.random() * .06).toFixed(2); setTimeout(function () { strobe.style.opacity = "0" }, 35) } }, 900) }
})();