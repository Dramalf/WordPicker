!function(){var e={4758:function(e,n,o){"use strict";o.r(n)}},n={};function o(t){var i=n[t];if(void 0!==i)return i.exports;var r=n[t]={exports:{}};return e[t](r,r.exports,o),r.exports}o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){o(4758);let e={},n=!1,t="",i=[],r="";const d=document.createElement("input");d.id="meaning-input",d.placeholder="回车添加，esc退出";const a=["background:#f8ebd840","padding:3px","font-weight:700","color:#6b5152","border-radius:4px 0 0 4px"].join(";"),s=["background:#ead0d180","font-weight:700","padding:3px","color:#7a7281","border-radius:0 4px 4px 0"].join(";"),c=["background:#ead0d180","font-weight:700","padding:3px","color:#7a7281","border-radius:4px"].join(";");function l(o){const l=o.key.toLowerCase();if("tab"===l&&(d.style.marginBottom?d.style.marginBottom="":d.style.marginBottom="0"),n)if("enter"===l){if("meaning"===t)f("ADD_MEANING",d.value),u();else if("words"===t)f("ADD_WORD",d.value),u();else if("review"===t){let e=Math.round(Math.random()*(i.length-1));console.log("%c%s",c,r.word),r=i[e],console.log("%c%s%c%s",a,r.meaning,s,r.word.substring(0,3)),d.value=""}}else"escape"===l&&u();else{e[l]=!0;const n=window.getSelection().toString();e.a&&e.f?n?f("ADD_WORD",n):g("words"):e.e&&e.f?n?f("ADD_MEANING",n):g("meaning"):e.s&&e.f?window.open("https://dictionary.cambridge.org/dictionary/english-chinese-simplified/"+n||""):e.r&&e.f&&async function(){i=await f("GET_ALL_WORDS");let e=Math.round(Math.random()*(i.length-1));r=i[e],g("review"),console.log("%c%s%c%s",a,r.meaning,s,r.word.substring(0,3))}()}setTimeout((()=>{e={}}),100)}function u(){d.parentNode.removeChild(d),d.value=null,n=!1}function g(e){document.body.appendChild(d),d.focus(),n=!0,t=e}function f(e){let n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return chrome.runtime.sendMessage({type:e,data:n})}document.addEventListener("keydown",l),window.addEventListener("search-word",(e=>{let{url:n}=e;window.open(n)}))}()}();