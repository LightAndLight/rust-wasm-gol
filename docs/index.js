(()=>{"use strict";var t,e,n,r,o,i,a,s,c,u,l,f,p,d,h,b,g,v,m,y,w,_={771:(t,e,n)=>{var r,o=function(){function t(){this.fps=document.getElementById("fps"),this.frames=[],this.lastFrameTimeStamp=performance.now()}return t.prototype.render=function(){var t=performance.now(),e=t-this.lastFrameTimeStamp;this.lastFrameTimeStamp=t;var n=1/e*1e3;this.frames.push(n),this.frames.length>100&&this.frames.shift();for(var r=1/0,o=-1/0,i=0,a=0;a<this.frames.length;a++)i+=this.frames[a],r=Math.min(this.frames[a],r),o=Math.max(this.frames[a],o);var s=i/this.frames.length;this.fps.textContent=("\nFrames per Second:\n         latest = "+Math.round(n)+"\navg of last 100 = "+Math.round(s)+"\nmin of last 100 = "+Math.round(r)+"\nmax of last 100 = "+Math.round(o)+"\n").trim()},t}(),i=(r=function(t,e){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(t,e)},function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}),a=function(){return(a=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var o in e=arguments[n])Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}).apply(this,arguments)},s=function(){function t(){}return t.GLSL_VERSION="300 es",t}(),c=function(t){function e(e,n){var r=t.call(this)||this;return r.deps=e,r.src=n,r}return i(e,t),e.prototype.read=function(){return{deps:this.deps,srcs:[this.src]}},e}(s);function u(t){return Object.values(t).flatMap((function(t){var e=t.read(),n=e.deps,r=e.srcs,o=u(n);return o.push.apply(o,r),o}))}var l=function(t){function e(e){var n=t.call(this)||this;return n.version=s.GLSL_VERSION,n.srcs=e,n}return i(e,t),e.prototype.read=function(){var t={},e=[];return this.srcs.forEach((function(n){var r=n.read(),o=r.deps,i=r.srcs;t=a(a({},t),o),e.push.apply(e,i)})),{deps:t,srcs:e}},e.prototype.generate=function(){var t=this.read(),e=t.deps,n=t.srcs;return"#version "+this.version+"\n\n"+u(e).join("\n")+"\n\n"+n.join("\n")},e}(s),f=new c({},"void screen2clip(in vec2 pos, in vec2 resolution, out vec2 clipSpace) {\n  vec2 zero2one = pos / resolution; // pointwise division, normalise pos to between 0 and 1\n  vec2 zero2two = zero2one * 2.0; // stretch pos to span between 0 and 2\n  clipSpace = (zero2two - 1.0) * vec2(1, -1); // shift pos to span between -1 and 1, but flip y-axis\n}"),p=new c({screen2clip:f},"in vec2 pos;\nin vec2 offset;\n\nuniform vec2 resolution;\n\nvoid main() {\n  vec2 clipSpace;\n  screen2clip(pos + offset, resolution, clipSpace);\n  gl_Position = vec4(clipSpace, 0, 1);\n}"),d=new c({},"precision highp float;\n\nuniform vec4 color;\n\nout vec4 outColor;\n\nvoid main() {\n  outColor = color;\n}"),h=new c({screen2clip:f},"in vec2 pos;\nin vec2 offset;\nin vec3 color;\n\nuniform vec2 resolution;\n\nout vec4 fragColor;\n\nvoid main() {\n  vec2 clipSpace;\n  screen2clip(pos + offset, resolution, clipSpace);\n  fragColor = vec4(color, 1);\n  gl_Position = vec4(clipSpace, 0, 1);\n}"),b=new c({},"precision highp float;\n\nin vec4 fragColor;\n\nout vec4 outColor;\n\nvoid main() {\n  outColor = fragColor;\n}"),g=function(){var t=function(e,n){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])})(e,n)};return function(e,n){if("function"!=typeof n&&null!==n)throw new TypeError("Class extends value "+String(n)+" is not a constructor or null");function r(){this.constructor=e}t(e,n),e.prototype=null===n?Object.create(n):(r.prototype=n.prototype,new r)}}(),v=function(){function t(t,e){this.gl=t,this.shader=e}return t.create=function(e,n,r){var o=e.createShader(n);if(e.shaderSource(o,r),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS))return new t(e,o);throw e.deleteShader(o),new Error(e.getShaderInfoLog(o))},t}(),m=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return g(e,t),e.new=function(e,n){return t.create.call(this,e,e.VERTEX_SHADER,n)},e}(v),y=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return g(e,t),e.new=function(e,n){return t.create.call(this,e,e.FRAGMENT_SHADER,n)},e}(v),w=function(){function t(t,e){this.gl=t,this.program=e}return t.new=function(e,n,r){var o=e.createProgram();if(e.attachShader(o,n.shader),e.attachShader(o,r.shader),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS))return new t(e,o);throw new Error(e.getProgramInfoLog(o))},t.prototype.use=function(t){this.gl.useProgram(this.program),t(new _(this.gl)),this.gl.useProgram(null)},t.prototype.getAttribLocation=function(t){return this.gl.getAttribLocation(this.program,t)},t.prototype.getUniformLocation=function(t){var e=this.gl.getUniformLocation(this.program,t);if(null===e)throw new Error("location "+t+" does not exist");return e},t}(),_=function(){function t(t){this.gl=t}return t.prototype.uniform2f=function(t,e,n){this.gl.uniform2f(t,e,n)},t.prototype.uniform4f=function(t,e,n,r,o){this.gl.uniform4f(t,e,n,r,o)},t}(),A=function(){function t(t){this.gl=t,this.vao=t.createVertexArray()}return t.prototype.bind=function(t){this.gl.bindVertexArray(this.vao),t(new x(this.gl)),this.gl.bindVertexArray(null)},t}(),x=function(){function t(t){this.gl=t}return t.prototype.enableVertexAttribArray=function(t){this.gl.enableVertexAttribArray(t)},t.prototype.vertexAttribPointer=function(t,e,n){this.gl.vertexAttribPointer(e,n.size,n.type,n.normalize,n.stride,n.offset)},t.prototype.vertexAttribDivisor=function(t,e){this.gl.vertexAttribDivisor(t,e)},t}(),S=function(t,e,n,r){t.drawArraysInstanced(r.primitive,r.offset,r.count,r.instanceCount)},E=function(){function t(t){this.gl=t,this.buffer=t.createBuffer()}return t.prototype.bindArrayBuffer=function(t){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.buffer),t(new T(this.gl)),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null)},t}(),T=function(){function t(t){this.gl=t,this.type=t.ARRAY_BUFFER}return t.prototype.setData=function(t,e){this.gl.bufferData(this.type,t,e)},t.prototype.bufferSubData=function(t){this.gl.bufferSubData(this.type,t.dstByteOffset,t.srcData,t.srcOffset,t.length)},t}(),P=new o;!function(){var t,e,r,o;t=this,e=void 0,o=function(){var t,e,r,o,i,a,s,c,u,f,g,v,_,x,T,O,L,C,F,D,R,j,B,I,k,z,M,V,W,U,N,G,Y,K,$,q,H,X,Z,J;return function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function s(i){return function(s){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(t){i=[6,t],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,s])}}}(this,(function(Q){switch(Q.label){case 0:return[4,n.e(801).then(n.bind(n,801))];case 1:return t=Q.sent(),e=t.start,r=t.Cell,o=t.World,[4,n.e(770).then(n.bind(n,676))];case 2:return i=Q.sent().memory,e(!1),a={r:.8,g:.8,b:.8},s={r:0,g:0,b:0},c={r:1,g:1,b:1},u=o.new(),f=u.width(),g=u.height(),v=document.getElementById("gol-canvas"),_=window.devicePixelRatio||1,T=(6*f+1)*(x=_),O=(6*g+1)*x,(L=v.getContext("webgl2"))||console.log("failed to get webgl2 context"),v.style.width=T/x+"px",v.style.height=O/x+"px",L.canvas.width=T,L.canvas.height=O,L.viewport(0,0,T,O),C=w.new(L,m.new(L,new l([p]).generate()),y.new(L,new l([d]).generate())),F=C.getAttribLocation("pos"),D=C.getAttribLocation("offset"),R=C.getUniformLocation("resolution"),j=C.getUniformLocation("color"),(B=new A(L)).bind((function(t){t.enableVertexAttribArray(F),t.enableVertexAttribArray(D),new E(L).bindArrayBuffer((function(e){e.setData(new Float32Array([0,0,0,1*x,T,0,T,1*x]),L.STATIC_DRAW),t.vertexAttribPointer(e,F,{size:2,type:L.FLOAT,normalize:!1,stride:0,offset:0})})),new E(L).bindArrayBuffer((function(e){for(var n=[],r=0;r<O;r+=6*x)n.push(0,r);console.assert(n.length/2===g+1,n.length/2),e.setData(new Float32Array(n),L.STATIC_DRAW),t.vertexAttribPointer(e,D,{size:2,type:L.FLOAT,normalize:!1,stride:0,offset:0}),t.vertexAttribDivisor(D,1)}))})),(I=new A(L)).bind((function(t){t.enableVertexAttribArray(F),t.enableVertexAttribArray(D),new E(L).bindArrayBuffer((function(e){e.setData(new Float32Array([0,0,1*x,0,0,O,1*x,O]),L.STATIC_DRAW),t.vertexAttribPointer(e,F,{size:2,type:L.FLOAT,normalize:!1,stride:0,offset:0})})),new E(L).bindArrayBuffer((function(e){for(var n=[],r=0;r<T;r+=6*x)n.push(r,0);console.assert(n.length/2===f+1,n.length/2),e.setData(new Float32Array(n),L.STATIC_DRAW),t.vertexAttribPointer(e,D,{size:2,type:L.FLOAT,normalize:!1,stride:0,offset:0}),t.vertexAttribDivisor(D,1)}))})),k=w.new(L,m.new(L,new l([h]).generate()),y.new(L,new l([b]).generate())),z=k.getUniformLocation("resolution"),M=new A(L),V=new E(L),M.bind((function(t){var e=k.getAttribLocation("pos");t.enableVertexAttribArray(e),new E(L).bindArrayBuffer((function(n){n.setData(new Float32Array([0,0,0,5*x,5*x,0,5*x,5*x]),L.STATIC_DRAW),t.vertexAttribPointer(n,e,{size:2,type:L.FLOAT,normalize:!1,stride:0,offset:0})}));var n=k.getAttribLocation("offset");t.enableVertexAttribArray(n),t.vertexAttribDivisor(n,1),new E(L).bindArrayBuffer((function(e){for(var r=[],o=1*x;o<O;o+=6*x)for(var i=1*x;i<T;i+=6*x)r.push(i,o);console.assert(r.length/2==f*g,r.length/2),e.setData(new Float32Array(r),L.STATIC_DRAW),t.vertexAttribPointer(e,n,{size:2,type:L.FLOAT,normalize:!1,stride:0,offset:0})}));var r=k.getAttribLocation("color");t.enableVertexAttribArray(r),t.vertexAttribDivisor(r,1),V.bindArrayBuffer((function(e){e.setData(new Float32Array(f*g*3),L.DYNAMIC_DRAW),t.vertexAttribPointer(e,r,{size:3,type:L.FLOAT,normalize:!1,stride:0,offset:0})}))})),W=function(){console.time("draw grid"),C.use((function(t){t.uniform2f(R,T,O),t.uniform4f(j,a.r,a.g,a.b,1),B.bind((function(t){S(L,0,0,{primitive:L.TRIANGLE_STRIP,offset:0,count:4,instanceCount:g+1})})),I.bind((function(t){S(L,0,0,{primitive:L.TRIANGLE_STRIP,offset:0,count:4,instanceCount:f+1})}))})),console.timeEnd("draw grid")},U=function(){var t=new Uint8Array(i.buffer,u.data(),f*g);console.time("calculate colours");for(var e=0;e<t.length;e++){var n=3*e;t[e]===r.Alive?(Y[n]=s.r,Y[n+1]=s.g,Y[n+2]=s.b):(Y[n]=c.r,Y[n+1]=c.g,Y[n+2]=c.b)}console.timeEnd("calculate colours"),console.time("upload colours"),V.bindArrayBuffer((function(t){t.bufferSubData({dstByteOffset:0,srcData:Y,srcOffset:0,length:Y.length})})),console.timeEnd("upload colours"),console.time("draw cells"),k.use((function(t){t.uniform2f(z,T,O),M.bind((function(t){S(L,0,0,{primitive:L.TRIANGLE_STRIP,offset:0,count:4,instanceCount:f*g})}))})),console.timeEnd("draw cells")},N=function(){!function(t,e,n,r,o){t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT)}(L),W(),U()},v.addEventListener("click",(function(t){var e=v.getBoundingClientRect(),n=t.clientX-e.x,r=t.clientY-e.y,o=Math.floor(n/6),i=Math.floor(r/6);u.toggle_cell(o,i),N()})),G=null,Y=new Float32Array(f*g*3),K=function(){P.render(),N(),console.time("tick"),u.tick_js(),console.timeEnd("tick"),G=requestAnimationFrame(K)},$=function(){return null===G},q=document.getElementById("play-pause"),H=function(){q.textContent="⏸",K()},X=function(){q.textContent="▶",null!==G&&(cancelAnimationFrame(G),G=null,N())},q.addEventListener("click",(function(t){$()?H():X()})),Z=document.getElementById("reset"),J=function(){u.clear()},Z.addEventListener("click",(function(t){J(),$()&&N()})),H(),[2]}}))},new((r=void 0)||(r=Promise))((function(n,i){function a(t){try{c(o.next(t))}catch(t){i(t)}}function s(t){try{c(o.throw(t))}catch(t){i(t)}}function c(t){var e;t.done?n(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(a,s)}c((o=o.apply(t,e||[])).next())}))}()}},A={};function x(t){var e=A[t];if(void 0!==e)return e.exports;var n=A[t]={id:t,loaded:!1,exports:{}};return _[t](n,n.exports,x),n.loaded=!0,n.exports}x.m=_,x.c=A,x.d=(t,e)=>{for(var n in e)x.o(e,n)&&!x.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},x.f={},x.e=t=>Promise.all(Object.keys(x.f).reduce(((e,n)=>(x.f[n](t,e),e)),[])),x.u=t=>t+".index.js",x.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),x.hmd=t=>((t=Object.create(t)).children||(t.children=[]),Object.defineProperty(t,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+t.id)}}),t),x.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),t={},e="rust-wasm-gol:",x.l=(n,r,o,i)=>{if(t[n])t[n].push(r);else{var a,s;if(void 0!==o)for(var c=document.getElementsByTagName("script"),u=0;u<c.length;u++){var l=c[u];if(l.getAttribute("src")==n||l.getAttribute("data-webpack")==e+o){a=l;break}}a||(s=!0,(a=document.createElement("script")).charset="utf-8",a.timeout=120,x.nc&&a.setAttribute("nonce",x.nc),a.setAttribute("data-webpack",e+o),a.src=n),t[n]=[r];var f=(e,r)=>{a.onerror=a.onload=null,clearTimeout(p);var o=t[n];if(delete t[n],a.parentNode&&a.parentNode.removeChild(a),o&&o.forEach((t=>t(r))),e)return e(r)},p=setTimeout(f.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=f.bind(null,a.onerror),a.onload=f.bind(null,a.onload),s&&document.head.appendChild(a)}},x.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},(()=>{var t;x.g.importScripts&&(t=x.g.location+"");var e=x.g.document;if(!t&&e&&(e.currentScript&&(t=e.currentScript.src),!t)){var n=e.getElementsByTagName("script");n.length&&(t=n[n.length-1].src)}if(!t)throw new Error("Automatic publicPath is not supported in this browser");t=t.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),x.p=t})(),(()=>{var t={826:0};x.f.j=(e,n)=>{var r=x.o(t,e)?t[e]:void 0;if(0!==r)if(r)n.push(r[2]);else{var o=new Promise(((n,o)=>r=t[e]=[n,o]));n.push(r[2]=o);var i=x.p+x.u(e),a=new Error;x.l(i,(n=>{if(x.o(t,e)&&(0!==(r=t[e])&&(t[e]=void 0),r)){var o=n&&("load"===n.type?"missing":n.type),i=n&&n.target&&n.target.src;a.message="Loading chunk "+e+" failed.\n("+o+": "+i+")",a.name="ChunkLoadError",a.type=o,a.request=i,r[1](a)}}),"chunk-"+e,e)}};var e=(e,n)=>{var r,o,[i,a,s]=n,c=0;for(r in a)x.o(a,r)&&(x.m[r]=a[r]);for(s&&s(x),e&&e(n);c<i.length;c++)o=i[c],x.o(t,o)&&t[o]&&t[o][0](),t[i[c]]=0},n=self.webpackChunkrust_wasm_gol=self.webpackChunkrust_wasm_gol||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))})(),m={},y={676:function(){return{"./rust_wasm_gol_bg.js":{__wbindgen_string_new:function(t,e){return void 0===n&&(n=x.c[770].exports),n.h4(t,e)},__wbindgen_object_drop_ref:function(t){return void 0===r&&(r=x.c[770].exports),r.ug(t)},__wbg_alert_e0645be5a2264a76:function(t,e){return void 0===o&&(o=x.c[770].exports),o.KP(t,e)},__wbg_new_59cb74e423758ede:function(){return void 0===i&&(i=x.c[770].exports),i.h9()},__wbg_stack_558ba5917b466edd:function(t,e){return void 0===a&&(a=x.c[770].exports),a.Dz(t,e)},__wbg_error_4bb6c2a97407129a:function(t,e){return void 0===s&&(s=x.c[770].exports),s.kF(t,e)},__wbg_log_386a8115a84a780d:function(t){return void 0===c&&(c=x.c[770].exports),c.IZ(t)},__wbindgen_throw:function(t,e){return void 0===u&&(u=x.c[770].exports),u.Or(t,e)}}}},676:function(){return{"./rust_wasm_gol_bg.js":{__wbindgen_string_new:function(t,e){return void 0===l&&(l=x.c[770].exports),l.h4(t,e)},__wbindgen_object_drop_ref:function(t){return void 0===f&&(f=x.c[770].exports),f.ug(t)},__wbg_alert_e0645be5a2264a76:function(t,e){return void 0===p&&(p=x.c[770].exports),p.KP(t,e)},__wbg_new_59cb74e423758ede:function(){return void 0===d&&(d=x.c[770].exports),d.h9()},__wbg_stack_558ba5917b466edd:function(t,e){return void 0===h&&(h=x.c[770].exports),h.Dz(t,e)},__wbg_error_4bb6c2a97407129a:function(t,e){return void 0===b&&(b=x.c[770].exports),b.kF(t,e)},__wbg_log_386a8115a84a780d:function(t){return void 0===g&&(g=x.c[770].exports),g.IZ(t)},__wbindgen_throw:function(t,e){return void 0===v&&(v=x.c[770].exports),v.Or(t,e)}}}}},w={770:[676],801:[676]},x.w={},x.f.wasm=function(t,e){(w[t]||[]).forEach((function(n,r){var o=m[n];if(o)e.push(o);else{var i,a=y[n](),s=fetch(x.p+""+{770:{676:"89d59a2d120327e09595"},801:{676:"89d59a2d120327e09595"}}[t][n]+".module.wasm");i=a instanceof Promise&&"function"==typeof WebAssembly.compileStreaming?Promise.all([WebAssembly.compileStreaming(s),a]).then((function(t){return WebAssembly.instantiate(t[0],t[1])})):"function"==typeof WebAssembly.instantiateStreaming?WebAssembly.instantiateStreaming(s,a):s.then((function(t){return t.arrayBuffer()})).then((function(t){return WebAssembly.instantiate(t,a)})),e.push(m[n]=i.then((function(t){return x.w[n]=(t.instance||t).exports})))}}))},x(771)})();