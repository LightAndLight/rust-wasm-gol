(self.webpackChunkrust_wasm_gol=self.webpackChunkrust_wasm_gol||[]).push([[801,770],{801:(e,t,r)=>{"use strict";r.r(t),r.d(t,{Cell:()=>n.bL,World:()=>n.q3,__wbg_alert_e0645be5a2264a76:()=>n.KP,__wbg_error_4bb6c2a97407129a:()=>n.kF,__wbg_log_386a8115a84a780d:()=>n.IZ,__wbg_new_59cb74e423758ede:()=>n.h9,__wbg_stack_558ba5917b466edd:()=>n.Dz,__wbindgen_object_drop_ref:()=>n.ug,__wbindgen_string_new:()=>n.h4,__wbindgen_throw:()=>n.Or,greet:()=>n.Qq,start:()=>n.BL});var n=r(770)},770:(e,t,r)=>{"use strict";r.d(t,{BL:()=>a,Qq:()=>y,bL:()=>k,q3:()=>m,h4:()=>v,ug:()=>D,KP:()=>q,h9:()=>x,Dz:()=>A,kF:()=>T,IZ:()=>j,Or:()=>E});var n=r(676);e=r.hmd(e);let o=new("undefined"==typeof TextDecoder?(0,e.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});o.decode();let _=null;function i(){return null!==_&&_.buffer===n.memory.buffer||(_=new Uint8Array(n.memory.buffer)),_}function c(e,t){return o.decode(i().subarray(e,e+t))}const l=new Array(32).fill(void 0);l.push(void 0,null,!0,!1);let u=l.length;function d(e){u===l.length&&l.push(l.length+1);const t=u;return u=l[t],l[t]=e,t}function s(e){return l[e]}function a(e){n.start(e)}let f=null;function w(){return null!==f&&f.buffer===n.memory.buffer||(f=new Int32Array(n.memory.buffer)),f}let h=0,g=new("undefined"==typeof TextEncoder?(0,e.require)("util").TextEncoder:TextEncoder)("utf-8");const b="function"==typeof g.encodeInto?function(e,t){return g.encodeInto(e,t)}:function(e,t){const r=g.encode(e);return t.set(r),{read:e.length,written:r.length}};function p(e,t,r){if(void 0===r){const r=g.encode(e),n=t(r.length);return i().subarray(n,n+r.length).set(r),h=r.length,n}let n=e.length,o=t(n);const _=i();let c=0;for(;c<n;c++){const t=e.charCodeAt(c);if(t>127)break;_[o+c]=t}if(c!==n){0!==c&&(e=e.slice(c)),o=r(o,n,n=c+3*e.length);const t=i().subarray(o+c,o+n);c+=b(e,t).written}return h=c,o}function y(e){var t=p(e,n.__wbindgen_malloc,n.__wbindgen_realloc),r=h;n.greet(t,r)}const k=Object.freeze({Dead:0,0:"Dead",Alive:1,1:"Alive"});class m{static __wrap(e){const t=Object.create(m.prototype);return t.ptr=e,t}__destroy_into_raw(){const e=this.ptr;return this.ptr=0,e}free(){const e=this.__destroy_into_raw();n.__wbg_world_free(e)}clear(){n.world_clear(this.ptr)}width(){return n.world_width(this.ptr)>>>0}height(){return n.world_height(this.ptr)>>>0}set_width(e){n.world_set_width(this.ptr,e)}set_height(e){n.world_set_height(this.ptr,e)}data(){return n.world_data(this.ptr)}tick_js(){n.world_tick_js(this.ptr)}static new(){var e=n.world_new();return m.__wrap(e)}render(){try{const r=n.__wbindgen_add_to_stack_pointer(-16);n.world_render(r,this.ptr);var e=w()[r/4+0],t=w()[r/4+1];return c(e,t)}finally{n.__wbindgen_add_to_stack_pointer(16),n.__wbindgen_free(e,t)}}toggle_cell(e,t){n.world_toggle_cell(this.ptr,e,t)}}const v=function(e,t){return d(c(e,t))},D=function(e){!function(e){const t=s(e);(function(e){e<36||(l[e]=u,u=e)})(e)}(e)},q=function(e,t){alert(c(e,t))},x=function(){return d(new Error)},A=function(e,t){var r=p(s(t).stack,n.__wbindgen_malloc,n.__wbindgen_realloc),o=h;w()[e/4+1]=o,w()[e/4+0]=r},T=function(e,t){try{console.error(c(e,t))}finally{n.__wbindgen_free(e,t)}},j=function(e){console.log(s(e))},E=function(e,t){throw new Error(c(e,t))}},676:(e,t,r)=>{"use strict";var n=r.w[e.id];for(var o in r.r(t),n)o&&(t[o]=n[o]);r(770),n[""]()}}]);