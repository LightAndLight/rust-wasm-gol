(self.webpackChunkrust_wasm_gol=self.webpackChunkrust_wasm_gol||[]).push([[770],{770:(t,e,r)=>{"use strict";r.d(e,{BL:()=>f,Qq:()=>y,bL:()=>m,q3:()=>v,h4:()=>k,ug:()=>x,KP:()=>A,h9:()=>D,Dz:()=>T,kF:()=>E,IZ:()=>j,Or:()=>q});var n=r(676);t=r.hmd(t);let o=new("undefined"==typeof TextDecoder?(0,t.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});o.decode();let i=null;function c(){return null!==i&&i.buffer===n.memory.buffer||(i=new Uint8Array(n.memory.buffer)),i}function l(t,e){return o.decode(c().subarray(t,t+e))}const u=new Array(32).fill(void 0);u.push(void 0,null,!0,!1);let _=u.length;function s(t){_===u.length&&u.push(u.length+1);const e=_;return _=u[e],u[e]=t,e}function d(t){return u[t]}function f(t){n.start(t)}let a=null;function w(){return null!==a&&a.buffer===n.memory.buffer||(a=new Int32Array(n.memory.buffer)),a}let h=0,g=new("undefined"==typeof TextEncoder?(0,t.require)("util").TextEncoder:TextEncoder)("utf-8");const p="function"==typeof g.encodeInto?function(t,e){return g.encodeInto(t,e)}:function(t,e){const r=g.encode(t);return e.set(r),{read:t.length,written:r.length}};function b(t,e,r){if(void 0===r){const r=g.encode(t),n=e(r.length);return c().subarray(n,n+r.length).set(r),h=r.length,n}let n=t.length,o=e(n);const i=c();let l=0;for(;l<n;l++){const e=t.charCodeAt(l);if(e>127)break;i[o+l]=e}if(l!==n){0!==l&&(t=t.slice(l)),o=r(o,n,n=l+3*t.length);const e=c().subarray(o+l,o+n);l+=p(t,e).written}return h=l,o}function y(t){var e=b(t,n.__wbindgen_malloc,n.__wbindgen_realloc),r=h;n.greet(e,r)}const m=Object.freeze({Dead:0,0:"Dead",Alive:1,1:"Alive"});class v{static __wrap(t){const e=Object.create(v.prototype);return e.ptr=t,e}__destroy_into_raw(){const t=this.ptr;return this.ptr=0,t}free(){const t=this.__destroy_into_raw();n.__wbg_world_free(t)}clear(){n.world_clear(this.ptr)}width(){return n.world_width(this.ptr)>>>0}height(){return n.world_height(this.ptr)>>>0}set_width(t){n.world_set_width(this.ptr,t)}set_height(t){n.world_set_height(this.ptr,t)}data(){return n.world_data(this.ptr)}tick_js(){n.world_tick_js(this.ptr)}static new(){var t=n.world_new();return v.__wrap(t)}render(){try{const r=n.__wbindgen_add_to_stack_pointer(-16);n.world_render(r,this.ptr);var t=w()[r/4+0],e=w()[r/4+1];return l(t,e)}finally{n.__wbindgen_add_to_stack_pointer(16),n.__wbindgen_free(t,e)}}toggle_cell(t,e){n.world_toggle_cell(this.ptr,t,e)}}const k=function(t,e){return s(l(t,e))},x=function(t){!function(t){const e=d(t);(function(t){t<36||(u[t]=_,_=t)})(t)}(t)},A=function(t,e){alert(l(t,e))},D=function(){return s(new Error)},T=function(t,e){var r=b(d(e).stack,n.__wbindgen_malloc,n.__wbindgen_realloc),o=h;w()[t/4+1]=o,w()[t/4+0]=r},E=function(t,e){try{console.error(l(t,e))}finally{n.__wbindgen_free(t,e)}},j=function(t){console.log(d(t))},q=function(t,e){throw new Error(l(t,e))}},676:(t,e,r)=>{"use strict";var n=r.w[t.id];for(var o in r.r(e),n)o&&(e[o]=n[o]);r(770),n[""]()}}]);