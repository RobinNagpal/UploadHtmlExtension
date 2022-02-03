!function(){"use strict";const t=33554432;async function e(e,o){if(o.includeInfobar&&await infobar.includeScript(e),o.includeBOM&&(e.content="\ufeff"+e.content),o.backgroundSave||o.openEditor||o.saveToGDrive||o.saveToGitHub||o.saveWithCompanion){for(let n=0;n*t<e.content.length;n++){const r={method:"downloads.download",taskId:o.taskId,confirmFilename:o.confirmFilename,filenameConflictAction:o.filenameConflictAction,filename:e.filename,saveToClipboard:o.saveToClipboard,saveToGDrive:o.saveToGDrive,saveToGitHub:o.saveToGitHub,githubToken:o.githubToken,githubUser:o.githubUser,githubRepository:o.githubRepository,githubBranch:o.githubBranch,saveWithCompanion:o.saveWithCompanion,forceWebAuthFlow:o.forceWebAuthFlow,extractAuthCode:o.extractAuthCode,filenameReplacementCharacter:o.filenameReplacementCharacter,openEditor:o.openEditor,openSavedPage:o.openSavedPage,compressHTML:o.compressHTML,backgroundSave:o.backgroundSave,bookmarkId:o.bookmarkId,replaceBookmarkURL:o.replaceBookmarkURL,applySystemTheme:o.applySystemTheme,defaultEditorMode:o.defaultEditorMode,includeInfobar:o.includeInfobar,warnUnsavedPage:o.warnUnsavedPage};r.truncated=e.content.length>t,r.truncated?(r.finished=(n+1)*t>e.content.length,r.content=e.content.substring(n*t,(n+1)*t)):r.content=e.content,await browser.runtime.sendMessage(r)}!o.openEditor&&o.saveToClipboard&&n(e)}else o.saveToClipboard?n(e):await async function(t){if(t.filename&&t.filename.length){const e=document.createElement("a");e.download=t.filename,e.href=URL.createObjectURL(new Blob([t.content],{type:"text/html"})),e.dispatchEvent(new MouseEvent("click")),URL.revokeObjectURL(e.href)}return new Promise((t=>setTimeout(t,1)))}(e),o.openSavedPage&&open(URL.createObjectURL(new Blob([e.content],{type:"text/html"}))),browser.runtime.sendMessage({method:"ui.processEnd"});await browser.runtime.sendMessage({method:"downloads.end",taskId:o.taskId,hash:e.hash,woleetKey:o.woleetKey})}function n(t){const e="copy";function n(e){e.clipboardData.setData("text/html",t.content),e.clipboardData.setData("text/plain",t.content),e.preventDefault()}document.addEventListener(e,n),document.execCommand(e),document.removeEventListener(e,n)}const o="single-file-response-fetch",r=(t,e)=>window.fetch(t,e);async function a(t){const e=await browser.runtime.sendMessage(t);if(!e||e.error)throw new Error(e&&e.error&&e.error.toString());return e}function i(t){return new Promise(((e,n)=>{var r,a,i,s;r=new CustomEvent("single-file-request-fetch",{detail:t}),window.dispatchEvent(r),a=o,i=function r(a){var i,s,l;a.detail?a.detail.url==t&&(i=o,s=r,l=!1,window.removeEventListener(i,s,l),a.detail.response?e({status:a.detail.status,headers:new Map(a.detail.headers),arrayBuffer:async()=>a.detail.response}):n(a.detail.error)):n()},s=!1,window.addEventListener(a,i,s)}))}browser.runtime.onMessage.addListener((t=>{if("singlefile.fetchFrame"==t.method&&window.frameId&&window.frameId==t.frameId)return async function(t){try{let e=await r(t.url,{cache:"force-cache",headers:t.headers});return 401!=e.status&&403!=e.status&&404!=e.status||(e=await Promise.race([i(t.url),new Promise(((t,e)=>setTimeout((()=>e()),5e3)))])),{status:e.status,headers:[...e.headers],array:Array.from(new Uint8Array(await e.arrayBuffer()))}}catch(t){return{error:t&&t.toString()}}}(t)}));const s=globalThis.singlefile,l=globalThis.singlefileBootstrap,c=s.helper.SELECTED_CONTENT_ATTRIBUTE_NAME,d="singlefile-mask",p="singlefile-mask-content",u="singlefile-progress-bar",m="singlefile-progress-bar-content",f="single-file-selection-zone",h="singlefile-logs-window",g="singlefile-logs",y="singlefile-logs-line",E="singlefile-logs-line-text",A="singlefile-logs-line-icon",b=s.helper.SINGLE_FILE_UI_ELEMENT_CLASS;let w,v,C,S;const x=new Set(Array.from(getComputedStyle(document.documentElement)));let I,L;function T(t,e){return prompt(t,e)}function k(t){if(w=l.messages.logPanelDeferredImages.message,v=l.messages.logPanelFrameContents.message,C=l.messages.logPanelStep.message,S=l.messages.logPanelWidth.message,!document.querySelector(d)&&(t.logsEnabled&&(q(),document.body.appendChild(L)),t.shadowEnabled)){const e=function(){try{let t=document.querySelector(d);if(!t){t=_(d,document.body);const e=t.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent="\n\t\t\t\t@keyframes single-file-progress { \n\t\t\t\t\t0% { \n\t\t\t\t\t\tleft: -50px;\n\t\t\t\t\t} \n\t\t\t\t\t100% { \n\t\t\t\t\t\tleft: 0;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\t.singlefile-progress-bar {\n\t\t\t\t\tposition: fixed;\n\t\t\t\t\ttop: 0;\n\t\t\t\t\tleft: 0;\n\t\t\t\t\twidth: 0;\n\t\t\t\t\theight: 8px;\n\t\t\t\t\tz-index: 2147483646;\n\t\t\t\t\topacity: .5;\n\t\t\t\t\toverflow: hidden;\t\t\t\t\t\n\t\t\t\t\ttransition: width 200ms ease-in-out;\n\t\t\t\t}\n\t\t\t\t.singlefile-progress-bar-content {\n\t\t\t\t\tposition: absolute;\n\t\t\t\t\tleft: 0;\n\t\t\t\t\tanimation: single-file-progress 3s linear infinite reverse;\n\t\t\t\t\tbackground: \n\t\t\t\t\t\twhite \n\t\t\t\t\t\tlinear-gradient(-45deg, rgba(0, 0, 0, 0.075) 25%, \n\t\t\t\t\t\t\ttransparent 25%, \n\t\t\t\t\t\t\ttransparent 50%, \n\t\t\t\t\t\t\trgba(0, 0, 0, 0.075) 50%, \n\t\t\t\t\t\t\trgba(0, 0, 0, 0.075) 75%, \n\t\t\t\t\t\t\ttransparent 75%, transparent)\n\t\t\t\t\t\trepeat scroll 0% 0% / 50px 50px padding-box border-box;\n\t\t\t\t\twidth: calc(100% + 50px);\n\t\t\t\t\theight: 100%;\t\t\t\t\t\n\t\t\t\t}\n\t\t\t\t.singlefile-mask-content {\n\t\t\t\t\tposition: fixed;\n\t\t\t\t\ttop: 0;\n\t\t\t\t\tleft: 0;\n\t\t\t\t\twidth: 100%;\n\t\t\t\t\theight: 100%;\n\t\t\t\t\tz-index: 2147483646;\n\t\t\t\t\topacity: 0;\n\t\t\t\t\tbackground-color: black;\n\t\t\t\t\ttransition: opacity 250ms;\n\t\t\t\t}\n\t\t\t",e.appendChild(n);let o=document.createElement("div");o.classList.add(p),e.appendChild(o),t.offsetWidth,o.style.setProperty("opacity",.3),t.offsetWidth}return t}catch(t){}}();t.progressBarEnabled&&function(t){try{if(!t.shadowRoot.querySelector("."+u)){let e=document.createElement("div");e.classList.add(u),t.shadowRoot.appendChild(e);const n=document.createElement("div");n.classList.add(m),e.appendChild(n)}}catch(t){}}(e)}}function P(){const t=document.querySelector(d);t&&t.remove(),L.remove(),q()}function R(t,e,n){n.shadowEnabled&&n.progressBarEnabled&&function(t,e){try{const n=document.querySelector(d);if(n){const o=n.shadowRoot.querySelector("."+u);if(o&&e){const n=Math.floor(t/e*100)+"%";o.style.getPropertyValue("width")!=n&&(o.style.setProperty("width",n),o.offsetWidth)}}}catch(t){}}(t,e)}function N(){let t;const e=[],n=getSelection();for(let o=0;o<n.rangeCount;o++){let r=n.getRangeAt(o);if(r&&r.commonAncestorContainer){const n=document.createTreeWalker(r.commonAncestorContainer);let o=!1,a=!1;for(;!a;)(o||n.currentNode==r.startContainer||n.currentNode==r.endContainer)&&(o=!0,r.startContainer==r.endContainer&&r.startOffset==r.endOffset||(t=!0,"A"==n.currentNode.tagName&&n.currentNode.href&&e.push(n.currentNode.href))),n.currentNode==r.endContainer?a=!0:n.nextNode();t&&n.currentNode==r.endContainer&&n.currentNode.querySelectorAll&&n.currentNode.querySelectorAll("*").forEach((t=>{"A"==t.tagName&&t.href&&e.push(n.currentNode.href)}))}}return Array.from(new Set(e))}async function D(t){let e=B();return e||t?e:(e=await new Promise((t=>{let e=[];function n(t){e=[],s(),t.preventDefault()}function o(t){const e=function(t){let e,n=t.target,o=n.getBoundingClientRect();for(e=F("floor",n,t.clientX-o.left,W(n,"left")),e==n&&(e=F("ceil",n,o.left+o.width-t.clientX,W(n,"right"))),e==n&&(e=F("floor",n,t.clientY-o.top,W(n,"top"))),e==n&&(e=F("ceil",n,o.top+o.height-t.clientY,W(n,"bottom"))),n=e;n&&n.clientWidth<=8&&n.clientHeight<=8;)n=n.parentElement;return n}(t);var n;e&&(I=e,n=e,requestAnimationFrame((()=>{const t=M(),e=n.getBoundingClientRect(),o=document.scrollingElement||document.documentElement;t.style.setProperty("top",o.scrollTop+e.top-10+"px"),t.style.setProperty("left",o.scrollLeft+e.left-10+"px"),t.style.setProperty("width",e.width+20+"px"),t.style.setProperty("height",e.height+20+"px")})))}function r(t){t.preventDefault(),t.stopPropagation(),0==t.button?s(I,t.ctrlKey):i()}function a(t){"Escape"==t.key&&i()}function i(){e.length&&getSelection().removeAllRanges(),e=[],c()}function s(t,e){if(t){e||d();const n=document.createRange();n.selectNodeContents(t),l(),getSelection().addRange(n),p(),e||c()}else c()}function l(){const t=getSelection();for(let e=t.rangeCount-1;e>=0;e--){const n=t.getRangeAt(e);n.startOffset==n.endOffset&&(t.removeRange(n),e--)}}function c(){M().remove(),removeEventListener("mousemove",o,!0),removeEventListener("click",r,!0),removeEventListener("keyup",a,!0),I=null,t(Boolean(e.length)),setTimeout((()=>document.removeEventListener("contextmenu",n,!0)),0)}function d(){getSelection().removeAllRanges(),e.forEach((t=>getSelection().addRange(t)))}function p(){e=[];for(let t=0;t<getSelection().rangeCount;t++){const n=getSelection().getRangeAt(t);e.push(n)}}addEventListener("mousemove",o,!0),addEventListener("click",r,!0),addEventListener("keyup",a,!0),document.addEventListener("contextmenu",n,!0),getSelection().removeAllRanges()})),e?B():void 0)}function B(){const t=getSelection();let e;for(let n=0;n<t.rangeCount;n++){let o=t.getRangeAt(n);if(o&&o.commonAncestorContainer){const t=document.createTreeWalker(o.commonAncestorContainer);let n=!1,r=!1;for(;!r;)(n||t.currentNode==o.startContainer||t.currentNode==o.endContainer)&&(n=!0,o.startContainer==o.endContainer&&o.startOffset==o.endOffset||(e=!0,O(t.currentNode))),e&&t.currentNode==o.startContainer&&U(t.currentNode),t.currentNode==o.endContainer?r=!0:t.nextNode();e&&t.currentNode==o.endContainer&&t.currentNode.querySelectorAll&&t.currentNode.querySelectorAll("*").forEach((t=>O(t)))}}return e}function O(t){(t.nodeType==Node.ELEMENT_NODE?t:t.parentElement).setAttribute(c,"")}function U(t){t.parentElement&&(O(t),U(t.parentElement))}function M(){let t=document.querySelector(f);return t||(t=_(f,document.body),t.style.setProperty("box-sizing","border-box","important"),t.style.setProperty("background-color","#3ea9d7","important"),t.style.setProperty("border","10px solid #0b4892","important"),t.style.setProperty("border-radius","2px","important"),t.style.setProperty("opacity",".25","important"),t.style.setProperty("pointer-events","none","important"),t.style.setProperty("position","absolute","important"),t.style.setProperty("transition","all 100ms","important"),t.style.setProperty("cursor","pointer","important"),t.style.setProperty("z-index","2147483647","important"),t.style.removeProperty("border-inline-end"),t.style.removeProperty("border-inline-start"),t.style.removeProperty("inline-size"),t.style.removeProperty("block-size"),t.style.removeProperty("inset-block-start"),t.style.removeProperty("inset-inline-end"),t.style.removeProperty("inset-block-end"),t.style.removeProperty("inset-inline-start")),t}function q(){try{if(L=document.querySelector(h),!L){L=_(h);const t=L.attachShadow({mode:"open"}),e=document.createElement("style");e.textContent=`\n\t\t\t\t@keyframes single-file-pulse { \n\t\t\t\t\t0% { \n\t\t\t\t\t\topacity: .25;\n\t\t\t\t\t} \n\t\t\t\t\t100% { \n\t\t\t\t\t\topacity: 1;\n\t\t\t\t\t} \n\t\t\t\t}\n\t\t\t\t.singlefile-logs {\n\t\t\t\t\tposition: fixed;\n\t\t\t\t\tbottom: 24px;\n\t\t\t\t\tleft: 8px;\n\t\t\t\t\tz-index: 2147483647;\n\t\t\t\t\topacity: 0.9;\n\t\t\t\t\tpadding: 4px;\n\t\t\t\t\tbackground-color: white;\n\t\t\t\t\tmin-width: ${S}px;\n\t\t\t\t\tmin-height: 16px;\n\t\t\t\t\ttransition: height 100ms;\n\t\t\t\t}\n\t\t\t\t.singlefile-logs-line {\n\t\t\t\t\tdisplay: flex;\n\t\t\t\t\tjustify-content: space-between;\n\t\t\t\t\tpadding: 2px;\n\t\t\t\t\tfont-family: arial, sans-serif;\n\t\t\t\t\tcolor: black;\n\t\t\t\t\tbackground-color: white;\n\t\t\t\t}\n\t\t\t\t.singlefile-logs-line-text {\n\t\t\t\t\tfont-size: 13px;\n\t\t\t\t\topacity: 1;\n\t\t\t\t\ttransition: opacity 200ms;\n\t\t\t\t}\n\t\t\t\t.singlefile-logs-line-icon {\n\t\t\t\t\tfont-size: 11px;\n\t\t\t\t\tmin-width: 15px;\n\t\t\t\t\ttext-align: center;\n\t\t\t\t\tposition: relative;\n\t\t\t\t\ttop: 1px;\n\t\t\t\t}\n\t\t\t`,t.appendChild(e);const n=document.createElement("div");n.classList.add(g),t.appendChild(n)}}catch(t){}}function H(t,e,n,o){try{if(o.logsEnabled){const o=L.shadowRoot.querySelector(".singlefile-logs");let r=o.querySelector("[data-id='"+t+"']");if(!r){r=document.createElement("div"),r.classList.add(y),o.appendChild(r),r.setAttribute("data-id",t);const n=document.createElement("div");n.classList.add(E),r.appendChild(n),n.textContent=e;const a=document.createElement("div");a.classList.add(A),r.appendChild(a)}!function(t,e,n){const o=t.childNodes[0],r=t.childNodes[1];o.textContent=e,r.style.setProperty("color","✓"==n?"#055000":"black"),"✓"==n?(o.style.setProperty("opacity",".5"),r.style.setProperty("opacity",".5"),r.style.setProperty("animation","none")):r.style.setProperty("animation","1s ease-in-out 0s infinite alternate none running single-file-pulse");r.textContent=n}(r,e,n)}}catch(t){}}function W(t,e){let n,o=t,r=[];do{const t=o.getBoundingClientRect();if(o.parentElement){const a=o.parentElement.getBoundingClientRect();n=Math.abs(a[e]-t[e])<=8,n&&(o.parentElement.clientWidth>8&&o.parentElement.clientHeight>8&&(o.parentElement.clientWidth-o.clientWidth>8||o.parentElement.clientHeight-o.clientHeight>8)&&r.push(o.parentElement),o=o.parentElement)}else n=!1}while(n&&o);return r}function F(t,e,n,o){return Math[t](n/8)<=o.length&&(e=o[o.length-Math[t](n/8)-1]),e}function _(t,e){const n=document.createElement(t);return n.className=b,e&&e.appendChild(n),x.forEach((t=>n.style.setProperty(t,"initial","important"))),n}const G=globalThis.singlefile,z=G.helper.SINGLE_FILE_UI_ELEMENT_CLASS,X="singlefile-error-bar",Q=new Set(Array.from(getComputedStyle(document.documentElement)));let Z;function j(t,e){try{if(console.error("SingleFile Lite",t,e),Z=document.querySelector(X),!Z){Z=function(t,e){const n=document.createElement(t);n.className=z,e&&e.appendChild(n);return Q.forEach((t=>n.style.setProperty(t,"initial","important"))),n}(X);const n=Z.attachShadow({mode:"open"}),o=document.createElement("style");o.textContent="\n\t\t\t\t.container {\n\t\t\t\t\tbackground-color: #ff6c00;\n\t\t\t\t\tcolor: white;\n\t\t\t\t\tdisplay: flex;\n\t\t\t\t\tposition: fixed;\n\t\t\t\t\ttop: 0px;\n\t\t\t\t\tleft: 0px;\n\t\t\t\t\tright: 0px;\n\t\t\t\t\theight: auto;\n\t\t\t\t\twidth: auto;\n\t\t\t\t\tmin-height: 24px;\n\t\t\t\t\tmin-width: 24px;\t\t\t\t\t\n\t\t\t\t\tz-index: 2147483647;\n\t\t\t\t\tmargin: 0;\n\t\t\t\t\tpadding: 2px;\n\t\t\t\t\tfont-family: Arial;\n\t\t\t\t}\n\t\t\t\t.text {\n\t\t\t\t\tflex: 1;\n\t\t\t\t\tpadding-top: 4px;\n\t\t\t\t\tpadding-bottom: 4px;\n\t\t\t\t\tpadding-left: 8px;\t\t\t\t\t\n\t\t\t\t}\n\t\t\t\t.close-button {\n\t\t\t\t\topacity: .7;\n\t\t\t\t\tpadding-top: 4px;\n\t\t\t\t\tpadding-left: 8px;\n\t\t\t\t\tpadding-right: 8px;\n\t\t\t\t\tcursor: pointer;\n\t\t\t\t\ttransition: opacity 250ms;\n\t\t\t\t\theight: 16px;\n\t\t\t\t}\n\t\t\t\ta {\n\t\t\t\t\tcolor: #303036;\n\t\t\t\t}\n\t\t\t\t.close-button:hover {\n\t\t\t\t\topacity: 1;\n\t\t\t\t}\n\t\t\t",n.appendChild(o);const r=document.createElement("div");r.className="container";const a=document.createElement("span");a.classList.add("text");const i=t.split("__DOC_LINK__");if(a.textContent="SingleFile Lite error: "+i[0],e&&2==i.length){const t=document.createElement("a");t.textContent=e,t.href=e,t.target="_blank",a.appendChild(t),a.appendChild(document.createTextNode(i[1]))}r.appendChild(a);const s=document.createElement("img");s.classList.add("close-button"),r.appendChild(s),n.appendChild(r),s.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABhmlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mSlUqHewg4hChOogFURFHqWIRLJS2QqsOJpf+CE0akhQXR8G14ODPYtXBxVlXB1dBEPwBcXNzUnSREr9LCi1ivOO4h/e+9+XuO0Col5lqdowDqmYZqXhMzOZWxMAruhGiOYohiZl6Ir2Qgef4uoeP73dRnuVd9+foVfImA3wi8SzTDYt4nXh609I57xOHWUlSiM+Jxwy6IPEj12WX3zgXHRZ4ZtjIpOaIw8RisY3lNmYlQyWeIo4oqkb5QtZlhfMWZ7VcZc178hcG89pymuu0BhHHIhJIQoSMKjZQhoUo7RopJlJ0HvPwDzj+JLlkcm2AkWMeFaiQHD/4H/zurVmYnHCTgjGg88W2P4aBwC7QqNn297FtN04A/zNwpbX8lTow80l6raVFjoDQNnBx3dLkPeByB+h/0iVDciQ/LaFQAN7P6JtyQN8t0LPq9q15jtMHIEO9WroBDg6BkSJlr3m8u6u9b//WNPv3A6mTcr3f/E/sAAAABmJLR0QAigCKAIrj2uckAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5QkPDysvCdPVuwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAELSURBVHja7ZpLFsIwDAPj3v/OsGHDe1BIa8tKO7Mnlkw+dpoxAAAAAGCfx4ur6Yx/B337UUS4mp/VuWUEcjSfOgO+BXCZCWe0hSqQo/npBLglIUNLdAV2MH84Ad1JyIwdLkK6YoabIHWscBWmihHuAqvHtv+XqmdXOK9TxdKy3axUm2vZkXXGgPJksTuz1bVFeeU2Y6ijsLIpXbtKa1kDs2ews69o7+A+ihJ2lvI+/lcS1G21zUVG18XKNm4OS4BNkGOQQohSmGaIdpgLESvzyiRwKepsXjE2H0ZWMF8Zi4+jK5mviM0DiRXNZ2rhkdTK5jO0xermz2o8dCnq+FS2XNNVH0sDAAAA3JYnre9cH8BZmhEAAAAASUVORK5CYII=",s.onclick=t=>{0===t.button&&Z.remove()},document.body.appendChild(Z)}}catch(t){}}const V=globalThis.singlefile,K=globalThis.singlefileBootstrap,J="moz-extension:";let Y,$;V.init({fetch:async function(t,e={}){try{let n=await r(t,{cache:"force-cache",headers:e.headers});return 401!=n.status&&403!=n.status&&404!=n.status||(n=await i(t)),n}catch(n){const o=await a({method:"singlefile.fetch",url:t,headers:e.headers});return{status:o.status,headers:{get:t=>o.headers&&o.headers[t]},arrayBuffer:async()=>new Uint8Array(o.array).buffer}}},frameFetch:async function(t,e){const n=await a({method:"singlefile.fetchFrame",url:t,frameId:e.frameId,headers:e.headers});return{status:n.status,headers:new Map(n.headers),arrayBuffer:async()=>new Uint8Array(n.array).buffer}}}),browser.runtime.onMessage.addListener((t=>{if("content.save"==t.method||"content.cancelSave"==t.method||"content.getSelectedLinks"==t.method||"content.error"==t.method)return async function(t){if(!location.href.startsWith(J)){if("content.save"==t.method)return await async function(t){const n=t.options;let o;(n.selected||n.optionallySelected)&&(o=await D(n.optionallySelected));if(!($||K&&K.pageInfo.processing)){if(n.updatedResources=K?K.pageInfo.updatedResources:{},n.visitDate=K?K.pageInfo.visitDate:new Date,Object.keys(n.updatedResources).forEach((t=>n.updatedResources[t].retrieved=!1)),n.optionallySelected&&o&&(n.selected=!0),!n.selected||o){K&&(K.pageInfo.processing=!0);try{const t=await async function(t){const e=V.processors.frameTree;let n;V.helper.initDoc(document),k(t),Y=new V.SingleFile(t);const o=[];if(t.insertCanonicalLink=!0,!t.saveRawPage){if(!t.removeFrames&&e&&globalThis.frames&&globalThis.frames.length){let n;n=t.loadDeferredImages?new Promise((n=>setTimeout((()=>n(e.getAsync(t))),t.loadDeferredImagesMaxIdleTime-e.TIMEOUT_INIT_REQUEST_MESSAGE))):e.getAsync(t),function(t){H("load-frames",v,"…",t)}(t),n.then((()=>{Y.cancelled||function(t){H("load-frames",v,"✓",t)}(t)})),o.push(n)}if(t.loadDeferredImages){const e=V.processors.lazy.process(t);!function(t){H("load-deferred-images",w,"…",t)}(t),e.then((()=>{Y.cancelled||function(t){H("load-deferred-images",w,"✓",t)}(t)})),o.push(e)}}let r=0,a=0;t.onprogress=e=>{Y.cancelled||(e.type==e.RESOURCES_INITIALIZED&&(a=e.detail.max,t.loadDeferredImages&&V.processors.lazy.resetZoomLevel(t)),e.type==e.RESOURCES_INITIALIZED||e.type==e.RESOURCE_LOADED?(e.type==e.RESOURCE_LOADED&&r++,browser.runtime.sendMessage({method:"ui.processProgress",index:r,maxIndex:a}),R(r,a,t)):e.detail.frame||e.type==e.PAGE_LOADING||e.type==e.PAGE_LOADED||(e.type==e.STAGE_STARTED?e.detail.step<3&&function(t,e){H("step-"+t,`${C} ${t+1} / 3`,"…",e)}(e.detail.step,t):e.type==e.STAGE_ENDED?e.detail.step<3&&function(t,e){H("step-"+t,`${C} ${t+1} / 3`,"✓",e)}(e.detail.step,t):(e.type==e.STAGE_TASK_STARTED||e.type==e.STAGE_TASK_ENDED)&&(e.detail.step,e.detail.task)))},[t.frames]=await new Promise((t=>{const e=Promise.all(o),n=Y.cancel.bind(Y);Y.cancel=function(){n(),t([[]])},e.then((()=>t(e)))})),n=t.frames&&t.frames.sessionId;const i=t.frames&&t.frames.find((t=>t.requestedFrame));t.win=globalThis,i?(t.content=i.content,t.url=i.baseURI,t.canvases=i.canvases,t.fonts=i.fonts,t.stylesheets=i.stylesheets,t.images=i.images,t.posters=i.posters,t.usedFonts=i.usedFonts,t.shadowRoots=i.shadowRoots,t.imports=i.imports):t.doc=document;Y.cancelled||await Y.run();n&&e.cleanup(n);let s;Y.cancelled||(t.confirmInfobarContent&&(t.infobarContent=T("Infobar content",t.infobarContent)||""),s=await Y.getPageData(),(t.selected||t.optionallySelected)&&document.querySelectorAll("["+c+"]").forEach((t=>t.removeAttribute(c))),P(),t.displayStats&&(console.log("SingleFile Lite stats"),console.table(s.stats)));return s}(n);t&&((!n.backgroundSave&&!n.saveToClipboard||n.saveToGDrive||n.saveToGitHub||n.saveWithCompanion)&&n.confirmFilename&&(t.filename=T("Save as",t.filename)||t.filename),await e(t,n))}catch(t){Y.cancelled||(console.error(t),browser.runtime.sendMessage({method:"ui.processError",error:t}))}}else browser.runtime.sendMessage({method:"ui.processCancelled"});$=!1,K&&(K.pageInfo.processing=!1)}}(t),{};if("content.cancelSave"==t.method)return Y&&(Y.cancel(),P(),browser.runtime.sendMessage({method:"ui.processCancelled"})),t.options.loadDeferredImages&&V.processors.lazy.resetZoomLevel(t.options),{};if("content.getSelectedLinks"==t.method)return{urls:N()};"content.error"==t.method&&j(t.error,t.link)}}(t)}))}();
