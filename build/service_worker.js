!function(){var e={7994:function(e,t,o){"use strict";o.r(t),o.d(t,{wordsDB:function(){return n}});const r="F_WORD_TB",n={set:async e=>{let t=(await chrome.storage.sync.get(r))[r]||[];console.log(t);return t.some((t=>t.word===e.word))?(console.log("is in"),t=t.map((t=>(t.word===e.word&&(t={...t,...e},console.log(t)),t)))):t.unshift(e),await chrome.storage.sync.set({F_WORD_TB:t}),t},get:async e=>{const t=(await chrome.storage.sync.get(r))[r];return e?t.filter((t=>Object.keys(e).every((o=>e[o]===t[o])))):t},delete:async e=>{let t=(await chrome.storage.sync.get(r))[r];return t=t.filter((t=>t.word!==e.word)),await chrome.storage.sync.set({F_WORD_TB:t}),t}}}},t={};function o(r){var n=t[r];if(void 0!==n)return n.exports;var c=t[r]={exports:{}};return e[r](c,c.exports,o),c.exports}o.d=function(e,t){for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){const{wordsDB:e}=o(7994);chrome.runtime.onMessage.addListener(((t,o,r)=>{console.log("BG GET==>",t);const{type:n,data:c}=t;switch(n){case"INIT":(async function(){const t=await e.get();return console.log(t,"init"),t})().then((e=>{r(e)}));break;case"GET_CONFIG":r("123 send");break;case"ADD_WORD":!function(t){let o={id:(new Date).getTime(),word:t};e.set(o),chrome.storage.sync.set({currentWord:{word:t}})}(c);break;case"ADD_MEANING":!async function(t){const o=(await chrome.storage.sync.get(["currentWord"])).currentWord;console.log(o),o.meaning=t,e.set(o),chrome.storage.sync.set({currentWord:o})}(c);break;case"EDIT_MEANING":!async function(t){e.set(t)}(c);break;case"DELETE_WORD":!async function(t){e.delete(t)}(c);break;case"SEARCH_WORD":!async function(e){const t=await async function(){let[e]=await chrome.tabs.query({active:!0,currentWindow:!0});return e.id}();console.log("search",e),chrome.scripting.excuteScript({target:{tabId:t},func:e=>{const t=new CustomEvent("search-word",{url:e});window.dispatchEvent(t),chrome.runtime.getPackageDirectoryEntry((e=>{console.log("dir",e)}))},args:[e]})}(c);break;default:console.log("unknown type")}return!0}))}()}();