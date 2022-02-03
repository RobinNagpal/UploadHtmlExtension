!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).singlefileBootstrap={})}(this,(function(e){"use strict";const t="single-file-load-image",s="single-file-image-loaded",o=globalThis.browser,n=(e,t,s)=>globalThis.addEventListener(e,t,s),a=e=>globalThis.dispatchEvent(e),i=globalThis.CustomEvent,r=globalThis.document,l=globalThis.Document;let d;if(d=window._singleFile_fontFaces?window._singleFile_fontFaces:window._singleFile_fontFaces=new Map,r instanceof l&&o&&o.runtime&&o.runtime.getURL){n("single-file-new-font-face",(e=>{const t=e.detail,s=Object.assign({},t);delete s.src,d.set(JSON.stringify(s),t)})),n("single-file-delete-font",(e=>{const t=e.detail,s=Object.assign({},t);delete s.src,d.delete(JSON.stringify(s))})),n("single-file-clear-fonts",(()=>d=new Map));const e=r.createElement("script");e.src=o.runtime.getURL("/dist/web/hooks/hooks-frames-web.js"),e.async=!1,(r.documentElement||r).appendChild(e),e.remove()}const c=new RegExp("\\\\([\\da-f]{1,6}[\\x20\\t\\r\\n\\f]?|([\\x20\\t\\r\\n\\f])|.)","ig");const m="single-file-on-before-capture",u="single-file-on-after-capture",g="data-single-file-removed-content",p="data-single-file-hidden-content",f="data-single-file-kept-content",h="data-single-file-hidden-frame",E="data-single-file-preserved-space-element",b="data-single-file-shadow-root-element",y="data-single-file-image",T="data-single-file-poster",w="data-single-file-canvas",A="data-single-file-import",I="data-single-file-movable-style",N="data-single-file-input-value",v="data-single-file-lazy-loaded-src",S="data-single-file-stylesheet",R="data-single-file-disabled-noscript",C="data-single-file-async-script",_="*:not(base):not(link):not(meta):not(noscript):not(script):not(style):not(template):not(title)",F=["NOSCRIPT","DISABLED-NOSCRIPT","META","LINK","STYLE","TITLE","TEMPLATE","SOURCE","OBJECT","SCRIPT","HEAD"],P=/^'(.*?)'$/,M=/^"(.*?)"$/,O={regular:"400",normal:"400",bold:"700",bolder:"700",lighter:"100"},x="single-file-ui-element",L=(e,t,s)=>globalThis.addEventListener(e,t,s);function D(e,t,s){let o;return e.querySelectorAll("noscript:not([data-single-file-disabled-noscript])").forEach((e=>{e.setAttribute(R,e.textContent),e.textContent=""})),function(e){e.querySelectorAll("meta[http-equiv=refresh]").forEach((e=>{e.removeAttribute("http-equiv"),e.setAttribute("disabled-http-equiv","refresh")}))}(e),e.head&&e.head.querySelectorAll(_).forEach((e=>e.hidden=!0)),e.querySelectorAll("svg foreignObject").forEach((e=>{const t=e.querySelectorAll("html > head > "+_+", html > body > "+_);t.length&&(Array.from(e.childNodes).forEach((e=>e.remove())),t.forEach((t=>e.appendChild(t))))})),t&&e.documentElement?(o=k(t,e,e.documentElement,s),s.moveStylesInHead&&e.querySelectorAll("body style, body ~ style").forEach((e=>{const s=t.getComputedStyle(e);s&&V(e,s)&&(e.setAttribute(I,""),o.markedElements.push(e))}))):o={canvases:[],images:[],posters:[],usedFonts:[],shadowRoots:[],imports:[],markedElements:[]},{canvases:o.canvases,fonts:Array.from(d.values()),stylesheets:z(e),images:o.images,posters:o.posters,usedFonts:Array.from(o.usedFonts.values()),shadowRoots:o.shadowRoots,imports:o.imports,referrer:e.referrer,markedElements:o.markedElements}}function k(e,t,s,o,n={usedFonts:new Map,canvases:[],images:[],posters:[],shadowRoots:[],imports:[],markedElements:[]},a){return Array.from(s.childNodes).filter((t=>t instanceof e.HTMLElement||t instanceof e.SVGElement)).forEach((s=>{let i,r,l;if((o.removeHiddenElements||o.removeUnusedFonts||o.compressHTML)&&(l=e.getComputedStyle(s),s instanceof e.HTMLElement&&o.removeHiddenElements&&(r=(a||s.closest("html > head"))&&F.includes(s.tagName)||s.closest("details"),r||(i=a||V(s,l),i&&(s.setAttribute(p,""),n.markedElements.push(s)))),!i)){if(o.compressHTML&&l){const e=l.getPropertyValue("white-space");e&&e.startsWith("pre")&&(s.setAttribute(E,""),n.markedElements.push(s))}o.removeUnusedFonts&&(q(l,o,n.usedFonts),q(e.getComputedStyle(s,":first-letter"),o,n.usedFonts),q(e.getComputedStyle(s,":before"),o,n.usedFonts),q(e.getComputedStyle(s,":after"),o,n.usedFonts))}!function(e,t,s,o,n,a,i){if("CANVAS"==s.tagName)try{n.canvases.push({dataURI:s.toDataURL("image/png","")}),s.setAttribute(w,n.canvases.length-1),n.markedElements.push(s)}catch(e){}if("IMG"==s.tagName){const t={currentSrc:a?"data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==":o.loadDeferredImages&&s.getAttribute(v)||s.currentSrc};if(n.images.push(t),s.setAttribute(y,n.images.length-1),n.markedElements.push(s),s.removeAttribute(v),i=i||e.getComputedStyle(s)){t.size=function(e,t,s){let o=t.naturalWidth,n=t.naturalHeight;if(!o&&!n){const a=null==t.getAttribute("style");let i,r,l,d,c,m,u,g,p=!1;if("content-box"==(s=s||e.getComputedStyle(t)).getPropertyValue("box-sizing")){const e=t.style.getPropertyValue("box-sizing"),s=t.style.getPropertyPriority("box-sizing"),o=t.clientWidth;t.style.setProperty("box-sizing","border-box","important"),p=t.clientWidth!=o,e?t.style.setProperty("box-sizing",e,s):t.style.removeProperty("box-sizing")}i=W("padding-left",s),r=W("padding-right",s),l=W("padding-top",s),d=W("padding-bottom",s),p?(c=W("border-left-width",s),m=W("border-right-width",s),u=W("border-top-width",s),g=W("border-bottom-width",s)):c=m=u=g=0,o=Math.max(0,t.clientWidth-i-r-c-m),n=Math.max(0,t.clientHeight-l-d-u-g),a&&t.removeAttribute("style")}return{pxWidth:o,pxHeight:n}}(e,s,i);const o=i.getPropertyValue("box-shadow"),n=i.getPropertyValue("background-image");o&&"none"!=o||n&&"none"!=n||!(t.size.pxWidth>1||t.size.pxHeight>1)||(t.replaceable=!0,t.backgroundColor=i.getPropertyValue("background-color"),t.objectFit=i.getPropertyValue("object-fit"),t.boxSizing=i.getPropertyValue("box-sizing"),t.objectPosition=i.getPropertyValue("object-position"))}}if("VIDEO"==s.tagName&&!s.poster){const e=t.createElement("canvas"),o=e.getContext("2d");e.width=s.clientWidth,e.height=s.clientHeight;try{o.drawImage(s,0,0,e.width,e.height),n.posters.push(e.toDataURL("image/png","")),s.setAttribute(T,n.posters.length-1),n.markedElements.push(s)}catch(e){}}"IFRAME"==s.tagName&&a&&o.removeHiddenElements&&(s.setAttribute(h,""),n.markedElements.push(s));"LINK"==s.tagName&&s.import&&s.import.documentElement&&(n.imports.push({content:j(s.import)}),s.setAttribute(A,n.imports.length-1),n.markedElements.push(s));"INPUT"==s.tagName&&("password"!=s.type&&(s.setAttribute(N,s.value),n.markedElements.push(s)),"radio"!=s.type&&"checkbox"!=s.type||(s.setAttribute(N,s.checked),n.markedElements.push(s)));"TEXTAREA"==s.tagName&&(s.setAttribute(N,s.value),n.markedElements.push(s));"SELECT"==s.tagName&&s.querySelectorAll("option").forEach((e=>{e.selected&&(e.setAttribute(N,""),n.markedElements.push(e))}));"SCRIPT"==s.tagName&&(s.async&&""!=s.getAttribute("async")&&"async"!=s.getAttribute("async")&&(s.setAttribute(C,""),n.markedElements.push(s)),s.textContent=s.textContent.replace(/<\/script>/gi,"<\\/script>"))}(e,t,s,o,n,i,l);const d=!(s instanceof e.SVGElement)&&U(s);if(d&&!s.classList.contains(x)){const a={};s.setAttribute(b,n.shadowRoots.length),n.markedElements.push(s),n.shadowRoots.push(a),k(e,t,d,o,n,i),a.content=d.innerHTML,a.delegatesFocus=d.delegatesFocus,a.mode=d.mode,d.adoptedStyleSheets&&d.adoptedStyleSheets.length&&(a.adoptedStyleSheets=Array.from(d.adoptedStyleSheets).map((e=>Array.from(e.cssRules).map((e=>e.cssText)).join("\n"))))}k(e,t,s,o,n,i),o.removeHiddenElements&&a&&(r||""==s.getAttribute(f)?s.parentElement&&(s.parentElement.setAttribute(f,""),n.markedElements.push(s.parentElement)):i&&(s.setAttribute(g,""),n.markedElements.push(s)))})),n}function q(e,t,s){if(e){const o=e.getPropertyValue("font-style")||"normal";e.getPropertyValue("font-family").split(",").forEach((n=>{if(n=H(n),!t.loadedFonts||t.loadedFonts.find((e=>H(e.family)==n&&e.style==o))){const t=(a=e.getPropertyValue("font-weight"),O[a.toLowerCase().trim()]||a),i=e.getPropertyValue("font-variant")||"normal",r=[n,t,o,i];s.set(JSON.stringify(r),[n,t,o,i])}var a}))}}function U(e){const t=globalThis.chrome;if(e.openOrClosedShadowRoot)return e.openOrClosedShadowRoot;if(!(t&&t.dom&&t.dom.openOrClosedShadowRoot))return e.shadowRoot;try{return t.dom.openOrClosedShadowRoot(e)}catch(t){return e.shadowRoot}}function H(e=""){return function(e){e=e.match(P)?e.replace(P,"$1"):e.replace(M,"$1");return e.trim()}((t=e.trim(),t.replace(c,((e,t,s)=>{const o="0x"+t-65536;return o!=o||s?t:o<0?String.fromCharCode(o+65536):String.fromCharCode(o>>10|55296,1023&o|56320)})))).toLowerCase();var t}function V(e,t){let s=!1;if(t){const o=t.getPropertyValue("display"),n=t.getPropertyValue("opacity"),a=t.getPropertyValue("visibility");if(s="none"==o,!s&&("0"==n||"hidden"==a)&&e.getBoundingClientRect){const t=e.getBoundingClientRect();s=!t.width&&!t.height}}return Boolean(s)}function B(e,t){if(e.querySelectorAll("[data-single-file-disabled-noscript]").forEach((e=>{e.textContent=e.getAttribute(R),e.removeAttribute(R)})),e.querySelectorAll("meta[disabled-http-equiv]").forEach((e=>{e.setAttribute("http-equiv",e.getAttribute("disabled-http-equiv")),e.removeAttribute("disabled-http-equiv")})),e.head&&e.head.querySelectorAll("*:not(base):not(link):not(meta):not(noscript):not(script):not(style):not(template):not(title)").forEach((e=>e.removeAttribute("hidden"))),!t){const s=[g,h,p,E,y,T,w,N,b,A,S,C];t=e.querySelectorAll(s.map((e=>"["+e+"]")).join(","))}t.forEach((e=>{e.removeAttribute(g),e.removeAttribute(p),e.removeAttribute(f),e.removeAttribute(h),e.removeAttribute(E),e.removeAttribute(y),e.removeAttribute(T),e.removeAttribute(w),e.removeAttribute(N),e.removeAttribute(b),e.removeAttribute(A),e.removeAttribute(S),e.removeAttribute(C),e.removeAttribute(I)}))}function z(e){if(e){const t=[];return e.querySelectorAll("style").forEach(((s,o)=>{try{const n=e.createElement("style");n.textContent=s.textContent,e.body.appendChild(n);const a=n.sheet;n.remove(),a&&a.cssRules.length==s.sheet.cssRules.length||(s.setAttribute(S,o),t[o]=Array.from(s.sheet.cssRules).map((e=>e.cssText)).join("\n"))}catch(e){}})),t}}function W(e,t){if(t.getPropertyValue(e).endsWith("px"))return parseFloat(t.getPropertyValue(e))}function j(e){const t=e.doctype;let s="";return t&&(s="<!DOCTYPE "+t.nodeName,t.publicId?(s+=' PUBLIC "'+t.publicId+'"',t.systemId&&(s+=' "'+t.systemId+'"')):t.systemId&&(s+=' SYSTEM "'+t.systemId+'"'),t.internalSubset&&(s+=" ["+t.internalSubset+"]"),s+="> "),s+e.documentElement.outerHTML}const J=v,G=x,Y="attributes",K=globalThis.browser,$=globalThis.document,Q=globalThis.MutationObserver,X=(e,t,s)=>globalThis.addEventListener(e,t,s),Z=(e,t,s)=>globalThis.removeEventListener(e,t,s),ee=new Map;let te;async function se(e){if($.documentElement){ee.clear();const o=Math.max($.documentElement.scrollHeight-1.5*$.documentElement.clientHeight,0),n=Math.max($.documentElement.scrollWidth-1.5*$.documentElement.clientWidth,0);if(globalThis.scrollY<=o&&globalThis.scrollX<=n)return function(e){return te=0,new Promise((async o=>{let n;const r=new Set,l=new Q((async t=>{if((t=t.filter((e=>e.type==Y))).length){t.filter((e=>{if("src"==e.attributeName&&(e.target.setAttribute(J,e.target.src),e.target.addEventListener("load",c)),"src"==e.attributeName||"srcset"==e.attributeName||"SOURCE"==e.target.tagName)return!e.target.classList||!e.target.classList.contains(G)})).length&&(n=!0,await ne(l,e,g),r.size||await oe(l,e,g))}}));async function d(t){await ie("idleTimeout",(async()=>{n?te<10&&(te++,le("idleTimeout"),await d(Math.max(500,t/2))):(le("loadTimeout"),le("maxTimeout"),ae(l,e,g))}),t)}function c(e){const t=e.target;t.removeAttribute(J),t.removeEventListener("load",c)}async function m(t){n=!0,await ne(l,e,g),await oe(l,e,g),t.detail&&r.add(t.detail)}async function u(t){await ne(l,e,g),await oe(l,e,g),r.delete(t.detail),r.size||await oe(l,e,g)}function g(e){l.disconnect(),Z(t,m),Z(s,u),o(e)}await d(2*e.loadDeferredImagesMaxIdleTime),await ne(l,e,g),l.observe($,{subtree:!0,childList:!0,attributes:!0}),X(t,m),X(s,u),function(e){e.loadDeferredImagesBlockCookies&&a(new i("single-file-block-cookies-start")),e.loadDeferredImagesBlockStorage&&a(new i("single-file-block-storage-start")),e.loadDeferredImagesKeepZoomLevel?a(new i("single-file-load-deferred-images-keep-zoom-level-start")):a(new i("single-file-load-deferred-images-start"))}(e)}))}(e)}}async function oe(e,t,s){await ie("loadTimeout",(()=>ae(e,t,s)),t.loadDeferredImagesMaxIdleTime)}async function ne(e,t,s){await ie("maxTimeout",(async()=>{await le("loadTimeout"),await ae(e,t,s)}),10*t.loadDeferredImagesMaxIdleTime)}async function ae(e,t,s){await le("idleTimeout"),function(e){e.loadDeferredImagesBlockCookies&&a(new i("single-file-block-cookies-end")),e.loadDeferredImagesBlockStorage&&a(new i("single-file-block-storage-end")),e.loadDeferredImagesKeepZoomLevel?a(new i("single-file-load-deferred-images-keep-zoom-level-end")):a(new i("single-file-load-deferred-images-end"))}(t),await ie("endTimeout",(async()=>{await le("maxTimeout"),s()}),t.loadDeferredImagesMaxIdleTime/2),e.disconnect()}async function ie(e,t,s){if(K&&K.runtime&&K.runtime.sendMessage){if(!ee.get(e)||!ee.get(e).pending){const o={callback:t,pending:!0};ee.set(e,o);try{await K.runtime.sendMessage({method:"singlefile.lazyTimeout.setTimeout",type:e,delay:s})}catch(o){re(e,t,s)}o.pending=!1}}else re(e,t,s)}function re(e,t,s){const o=ee.get(e);o&&globalThis.clearTimeout(o),ee.set(e,t),globalThis.setTimeout(t,s)}async function le(e){if(K&&K.runtime&&K.runtime.sendMessage)try{await K.runtime.sendMessage({method:"singlefile.lazyTimeout.clearTimeout",type:e})}catch(t){de(e)}else de(e)}function de(e){const t=ee.get(e);ee.delete(e),t&&globalThis.clearTimeout(t)}K&&K.runtime&&K.runtime.onMessage&&K.runtime.onMessage.addListener&&K.runtime.onMessage.addListener((e=>{if("singlefile.lazyTimeout.onTimeout"==e.method){const t=ee.get(e.type);if(t){ee.delete(e.type);try{t.callback()}catch(t){de(e.type)}}}}));const ce={ON_BEFORE_CAPTURE_EVENT_NAME:m,ON_AFTER_CAPTURE_EVENT_NAME:u,WIN_ID_ATTRIBUTE_NAME:"data-single-file-win-id",preProcessDoc:D,serialize:j,postProcessDoc:B,getShadowRoot:U},me="__frameTree__::",ue='iframe, frame, object[type="text/html"][data]',ge="singlefile.frameTree.initRequest",pe="singlefile.frameTree.ackInitRequest",fe="singlefile.frameTree.cleanupRequest",he="singlefile.frameTree.initResponse",Ee=5e3,be=".",ye=globalThis.window==globalThis.top,Te=globalThis.browser,we=globalThis.top,Ae=globalThis.MessageChannel,Ie=globalThis.document,Ne=new Map;let ve;var Se,Re,Ce;function _e(){return globalThis.crypto.getRandomValues(new Uint32Array(32)).join("")}async function Fe(e){const t=e.sessionId,s=globalThis._singleFile_waitForUserScript;ye||(ve=globalThis.frameId=e.windowId),Oe(Ie,e.options,ve,t),ye||(e.options.userScriptEnabled&&s&&await s(ce.ON_BEFORE_CAPTURE_EVENT_NAME),ke({frames:[Ue(Ie,globalThis,ve,e.options)],sessionId:t,requestedFrameId:Ie.documentElement.dataset.requestedFrameId&&ve}),e.options.userScriptEnabled&&s&&await s(ce.ON_AFTER_CAPTURE_EVENT_NAME),delete Ie.documentElement.dataset.requestedFrameId)}function Pe(e){const t=e.sessionId;De(He(Ie),e.windowId,t)}function Me(e){e.frames.forEach((t=>xe("responseTimeouts",e.sessionId,t.windowId)));const t=Ne.get(e.sessionId);if(t){e.requestedFrameId&&(t.requestedFrameId=e.requestedFrameId),e.frames.forEach((e=>{let s=t.frames.find((t=>e.windowId==t.windowId));s||(s={windowId:e.windowId},t.frames.push(s)),s.processed||(s.content=e.content,s.baseURI=e.baseURI,s.title=e.title,s.canvases=e.canvases,s.fonts=e.fonts,s.stylesheets=e.stylesheets,s.images=e.images,s.posters=e.posters,s.usedFonts=e.usedFonts,s.shadowRoots=e.shadowRoots,s.imports=e.imports,s.processed=e.processed)}));t.frames.filter((e=>!e.processed)).length||(t.frames=t.frames.sort(((e,t)=>t.windowId.split(be).length-e.windowId.split(be).length)),t.resolve&&(t.requestedFrameId&&t.frames.forEach((e=>{e.windowId==t.requestedFrameId&&(e.requestedFrame=!0)})),t.resolve(t.frames)))}}function Oe(e,t,s,o){const n=He(e);!function(e,t,s,o,n){const a=[];let i;Ne.get(n)?i=Ne.get(n).requestTimeouts:(i={},Ne.set(n,{requestTimeouts:i}));t.forEach(((e,t)=>{const s=o+be+t;e.setAttribute(ce.WIN_ID_ATTRIBUTE_NAME,s),a.push({windowId:s})})),ke({frames:a,sessionId:n,requestedFrameId:e.documentElement.dataset.requestedFrameId&&o}),t.forEach(((e,t)=>{const a=o+be+t;try{qe(e.contentWindow,{method:ge,windowId:a,sessionId:n,options:s})}catch(e){}i[a]=globalThis.setTimeout((()=>ke({frames:[{windowId:a,processed:!0}],sessionId:n})),Ee)})),delete e.documentElement.dataset.requestedFrameId}(e,n,t,s,o),n.length&&function(e,t,s,o,n){const a=[];t.forEach(((e,t)=>{const i=o+be+t;let r;try{r=e.contentDocument}catch(e){}if(r)try{const t=e.contentWindow;t.stop(),xe("requestTimeouts",n,i),Oe(r,s,i,n),a.push(Ue(r,t,i,s))}catch(e){a.push({windowId:i,processed:!0})}})),ke({frames:a,sessionId:n,requestedFrameId:e.documentElement.dataset.requestedFrameId&&o}),delete e.documentElement.dataset.requestedFrameId}(e,n,t,s,o)}function xe(e,t,s){const o=Ne.get(t);if(o&&o[e]){const t=o[e][s];t&&(globalThis.clearTimeout(t),delete o[e][s])}}function Le(e,t){const s=Ne.get(e);s&&s.responseTimeouts&&(s.responseTimeouts[t]=globalThis.setTimeout((()=>ke({frames:[{windowId:t,processed:!0}],sessionId:e})),1e4))}function De(e,t,s){e.forEach(((e,o)=>{const n=t+be+o;e.removeAttribute(ce.WIN_ID_ATTRIBUTE_NAME);try{qe(e.contentWindow,{method:fe,windowId:n,sessionId:s})}catch(e){}})),e.forEach(((e,o)=>{const n=t+be+o;let a;try{a=e.contentDocument}catch(e){}if(a)try{De(He(a),n,s)}catch(e){}}))}function ke(e){e.method=he;try{we.singlefile.processors.frameTree.initResponse(e)}catch(t){qe(we,e,!0)}}function qe(e,t,s){if(e==we&&Te&&Te.runtime&&Te.runtime.sendMessage)Te.runtime.sendMessage(t);else if(s){const s=new Ae;e.postMessage(me+JSON.stringify({method:t.method,sessionId:t.sessionId}),"*",[s.port2]),s.port1.postMessage(t)}else e.postMessage(me+JSON.stringify(t),"*")}function Ue(e,t,s,o){const n=ce.preProcessDoc(e,t,o),a=ce.serialize(e);ce.postProcessDoc(e,n.markedElements);return{windowId:s,content:a,baseURI:e.baseURI.split("#")[0],title:e.title,canvases:n.canvases,fonts:n.fonts,stylesheets:n.stylesheets,images:n.images,posters:n.posters,usedFonts:n.usedFonts,shadowRoots:n.shadowRoots,imports:n.imports,processed:!0}}function He(e){let t=Array.from(e.querySelectorAll(ue));return e.querySelectorAll("*").forEach((e=>{const s=ce.getShadowRoot(e);s&&(t=t.concat(...s.querySelectorAll(ue)))})),t}ye&&(ve="0",Te&&Te.runtime&&Te.runtime.onMessage&&Te.runtime.onMessage.addListener&&Te.runtime.onMessage.addListener((e=>e.method==he?(Me(e),Promise.resolve({})):e.method==pe?(xe("requestTimeouts",e.sessionId,e.windowId),Le(e.sessionId,e.windowId),Promise.resolve({})):void 0))),Se="message",Re=async e=>{if("string"==typeof e.data&&e.data.startsWith(me)){e.preventDefault(),e.stopPropagation();const t=JSON.parse(e.data.substring(me.length));t.method==ge?(e.source&&qe(e.source,{method:pe,windowId:t.windowId,sessionId:t.sessionId}),ye||(globalThis.stop(),t.options.loadDeferredImages&&se(t.options),await Fe(t))):t.method==pe?(xe("requestTimeouts",t.sessionId,t.windowId),Le(t.sessionId,t.windowId)):t.method==fe?Pe(t):t.method==he&&Ne.get(t.sessionId)&&(e.ports[0].onmessage=e=>Me(e.data))}},Ce=!0,globalThis.addEventListener(Se,Re,Ce);var Ve=Object.freeze({__proto__:null,getAsync:function(e){const t=_e();return e=JSON.parse(JSON.stringify(e)),new Promise((s=>{Ne.set(t,{frames:[],requestTimeouts:{},responseTimeouts:{},resolve:e=>{e.sessionId=t,s(e)}}),Fe({windowId:ve,sessionId:t,options:e})}))},getSync:function(e){const t=_e();e=JSON.parse(JSON.stringify(e)),Ne.set(t,{frames:[],requestTimeouts:{},responseTimeouts:{}}),function(e){const t=e.sessionId,s=globalThis._singleFile_waitForUserScript;ye||(ve=globalThis.frameId=e.windowId);Oe(Ie,e.options,ve,t),ye||(e.options.userScriptEnabled&&s&&s(ce.ON_BEFORE_CAPTURE_EVENT_NAME),ke({frames:[Ue(Ie,globalThis,ve,e.options)],sessionId:t,requestedFrameId:Ie.documentElement.dataset.requestedFrameId&&ve}),e.options.userScriptEnabled&&s&&s(ce.ON_AFTER_CAPTURE_EVENT_NAME),delete Ie.documentElement.dataset.requestedFrameId)}({windowId:ve,sessionId:t,options:e});const s=Ne.get(t).frames;return s.sessionId=t,s},cleanup:function(e){Ne.delete(e),Pe({windowId:ve,sessionId:e,options:{sessionId:e}})},initResponse:Me,TIMEOUT_INIT_REQUEST_MESSAGE:Ee});const Be=["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"],ze=[{tagName:"head",accept:e=>!e.childNodes.length||1==e.childNodes[0].nodeType},{tagName:"body",accept:e=>!e.childNodes.length}],We=[{tagName:"html",accept:e=>!e||8!=e.nodeType},{tagName:"head",accept:e=>!e||8!=e.nodeType&&(3!=e.nodeType||!Ge(e.textContent))},{tagName:"body",accept:e=>!e||8!=e.nodeType},{tagName:"li",accept:(e,t)=>!e&&t.parentElement&&("UL"==t.parentElement.tagName||"OL"==t.parentElement.tagName)||e&&["LI"].includes(e.tagName)},{tagName:"dt",accept:e=>!e||["DT","DD"].includes(e.tagName)},{tagName:"p",accept:e=>e&&["ADDRESS","ARTICLE","ASIDE","BLOCKQUOTE","DETAILS","DIV","DL","FIELDSET","FIGCAPTION","FIGURE","FOOTER","FORM","H1","H2","H3","H4","H5","H6","HEADER","HR","MAIN","NAV","OL","P","PRE","SECTION","TABLE","UL"].includes(e.tagName)},{tagName:"dd",accept:e=>!e||["DT","DD"].includes(e.tagName)},{tagName:"rt",accept:e=>!e||["RT","RP"].includes(e.tagName)},{tagName:"rp",accept:e=>!e||["RT","RP"].includes(e.tagName)},{tagName:"optgroup",accept:e=>!e||["OPTGROUP"].includes(e.tagName)},{tagName:"option",accept:e=>!e||["OPTION","OPTGROUP"].includes(e.tagName)},{tagName:"colgroup",accept:e=>!e||8!=e.nodeType&&(3!=e.nodeType||!Ge(e.textContent))},{tagName:"caption",accept:e=>!e||8!=e.nodeType&&(3!=e.nodeType||!Ge(e.textContent))},{tagName:"thead",accept:e=>!e||["TBODY","TFOOT"].includes(e.tagName)},{tagName:"tbody",accept:e=>!e||["TBODY","TFOOT"].includes(e.tagName)},{tagName:"tfoot",accept:e=>!e},{tagName:"tr",accept:e=>!e||["TR"].includes(e.tagName)},{tagName:"td",accept:e=>!e||["TD","TH"].includes(e.tagName)},{tagName:"th",accept:e=>!e||["TD","TH"].includes(e.tagName)}],je=["style","script","xmp","iframe","noembed","noframes","plaintext","noscript"];function Je(e,t,s){return 3==e.nodeType?function(e){const t=e.parentNode;let s;t&&1==t.nodeType&&(s=t.tagName.toLowerCase());return!s||je.includes(s)?"script"==s?e.textContent.replace(/<\//gi,"<\\/").replace(/\/>/gi,"\\/>"):e.textContent:e.textContent.replace(/&/g,"&amp;").replace(/\u00a0/g,"&nbsp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}(e):8==e.nodeType?"\x3c!--"+e.textContent+"--\x3e":1==e.nodeType?function(e,t,s){const o=e.tagName.toLowerCase(),n=t&&ze.find((t=>o==t.tagName&&t.accept(e)));let a="";n&&!e.attributes.length||(a="<"+o,Array.from(e.attributes).forEach((s=>a+=function(e,t,s){const o=e.name;let n="";if(!o.match(/["'>/=]/)){let a,i=e.value;s&&"class"==o&&(i=Array.from(t.classList).map((e=>e.trim())).join(" ")),i=i.replace(/&/g,"&amp;").replace(/\u00a0/g,"&nbsp;"),i.includes('"')&&(i.includes("'")||!s?i=i.replace(/"/g,"&quot;"):a=!0);const r=!s||!i.match(/^[^ \t\n\f\r'"`=<>]+$/);n+=" ",e.namespace?"http://www.w3.org/XML/1998/namespace"==e.namespaceURI?n+="xml:"+o:"http://www.w3.org/2000/xmlns/"==e.namespaceURI?("xmlns"!==o&&(n+="xmlns:"),n+=o):"http://www.w3.org/1999/xlink"==e.namespaceURI?n+="xlink:"+o:n+=o:n+=o,""!=i&&(n+="=",r&&(n+=a?"'":'"'),n+=i,r&&(n+=a?"'":'"'))}return n}(s,e,t))),a+=">");"TEMPLATE"!=e.tagName||e.childNodes.length?Array.from(e.childNodes).forEach((e=>a+=Je(e,t,s||"svg"==o))):a+=e.innerHTML;const i=t&&We.find((t=>o==t.tagName&&t.accept(e.nextSibling,e)));(s||!i&&!Be.includes(o))&&(a+="</"+o+">");return a}(e,t,s):void 0}function Ge(e){return Boolean(e.match(/^[ \t\n\f\r]/))}const Ye={frameTree:Ve},Ke={COMMENT_HEADER:"Page saved with SingleFile",COMMENT_HEADER_LEGACY:"Archive processed by SingleFile",ON_BEFORE_CAPTURE_EVENT_NAME:m,ON_AFTER_CAPTURE_EVENT_NAME:u,preProcessDoc:D,postProcessDoc:B,serialize:(e,t)=>function(e,t){const s=e.doctype;let o="";return s&&(o="<!DOCTYPE "+s.nodeName,s.publicId?(o+=' PUBLIC "'+s.publicId+'"',s.systemId&&(o+=' "'+s.systemId+'"')):s.systemId&&(o+=' SYSTEM "'+s.systemId+'"'),s.internalSubset&&(o+=" ["+s.internalSubset+"]"),o+="> "),o+Je(e.documentElement,t)}(e,t),getShadowRoot:U};L("single-file-user-script-init",(()=>globalThis._singleFile_waitForUserScript=async e=>{const t=new CustomEvent(e+"-request",{cancelable:!0}),s=new Promise((t=>L(e+"-response",t)));(e=>{globalThis.dispatchEvent(e)})(t),t.defaultPrevented&&await s})),e.helper=Ke,e.processors=Ye,Object.defineProperty(e,"__esModule",{value:!0})}));
