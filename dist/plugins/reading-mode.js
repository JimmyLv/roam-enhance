!function(){"use strict";function e(e,t=""){let n=0;function o(e){var i;try{e()}catch(e){console.log("error",e),n<5&&setTimeout((()=>o(++n)),3e3),n>5&&(null===(i=window.roam42)||void 0===i||i.help.displayMessage(`${t}加载失败`,2e3))}}setTimeout((()=>o(e)),3e3)}var t,n;t="reading-mode",n=()=>{(e=>{let t=document.getElementById(e);t&&t.remove();const n=document.createElement("template");n.innerHTML='<span id="id" title="当前:编辑模式" class="bp3-button bp3-minimal bp3-icon-edit pointer bp3-small"></span>',n.content.firstChild.onclick=()=>{const n=t.classList;if(n.contains("bp3-icon-edit")){n.remove("bp3-icon-edit"),n.add("bp3-icon-disable"),t.title="当前:阅读模式(禁用编辑)";const o=document.createElement("style");o.id=e+"-css",o.innerText='.rm-block__input{pointer-events: none;}.rm-block-main {cursor: not-allowed;}.bp3-tag,.bp3-small,.bp3-popover-wrapper,.rm-paren,.block__input img {pointer-events: auto;cursor: pointer;}.rm-page-ref[data-tag^="."]{display:none !important;}',document.getElementsByTagName("head")[0].appendChild(o),window.roam42.help.displayMessage("切换至阅读模式",2e3)}else n.add("bp3-icon-edit"),n.remove("bp3-icon-disable"),document.getElementById(e+"-css").remove(),window.roam42.help.displayMessage("切换至编辑模式",2e3)},t=n.content.firstChild;const o=document.querySelector(".rm-topbar"),i=document.querySelector(".rm-topbar .bp3-popover-wrapper");o.insertBefore(t,i)})("reading-mode")},window.roamEnhance.loaded.add(t),e(n,t)}();
