export class Shader {
  constructor(gl, type, src) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    }
    this.gl = gl;
    this.shader = shader;
  }
}

export class VertexShader extends Shader {
  constructor(gl, src) {
    super(gl, gl.VERTEX_SHADER, src);
  }

  assertVertexShader() { }
}

export class FragmentShader extends Shader {
  constructor(gl, src) {
    super(gl, gl.FRAGMENT_SHADER, src);
  }

  assertFragmentShader() { }
}

export class Program {
  constructor(gl, vertexShader, fragmentShader) {
    vertexShader.assertVertexShader();
    fragmentShader.assertFragmentShader();

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader.shader);
    gl.attachShader(program, fragmentShader.shader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      console.log(gl.getProgramInfoLog(program));
    }

    this.gl = gl;
    this.program = program;
  }

  use(callback) {
    this.gl.useProgram(this.program);
    callback(new UsedProgram(this.gl));
    this.gl.useProgram(null);
  }

  getAttribLocation(locationName) {
    return this.gl.getAttribLocation(this.program, locationName);
  }

  getUniformLocation(location) {
    return this.gl.getUniformLocation(this.program, location);
  }
}

export class UsedProgram {
  constructor(gl) { this.gl = gl; }

  assertUsedProgram() { }

  uniform2f(location, x, y) {
    this.gl.uniform2f(location, x, y);
  }

  uniform4f(location, x, y, z, w) {
    this.gl.uniform4f(location, x, y, z, w);
  }
}

export class VertexArrayObject {
  constructor(gl) { this.gl = gl; this.vao = gl.createVertexArray(); }
  bind(callback) {
    this.gl.bindVertexArray(this.vao);
    callback(new BoundVertexArrayObject(this.gl));
    this.gl.bindVertexArray(null);
  }
}

class BoundVertexArrayObject {
  constructor(gl) { this.gl = gl; }

  assertBoundVertexArrayObject() { }

  enableVertexAttribArray(location) {
    this.gl.enableVertexAttribArray(location);
  }

  vertexAttribPointer(buffer, location, { size, type, normalize, stride, offset }) {
    buffer.assertBoundArrayBuffer();
    this.gl.vertexAttribPointer(
      location,
      size,
      type,
      normalize,
      stride,
      offset
    )
  }

  vertexAttribDivisor(location, divisor) {
    this.gl.vertexAttribDivisor(location, divisor)
  }
}

export const drawArrays = (gl, program, vao, { primitive, offset, count }) => {
  program.assertUsedProgram();
  vao.assertBoundVertexArrayObject();
  gl.drawArrays(primitive, offset, count);
}

export const drawArraysInstanced = (gl, program, vao, { primitive, offset, count, instanceCount }) => {
  program.assertUsedProgram();
  vao.assertBoundVertexArrayObject();
  gl.drawArraysInstanced(primitive, offset, count, instanceCount)
}

export class Buffer {
  constructor(gl) { this.gl = gl; this.buffer = gl.createBuffer(); }
  bindArrayBuffer(callback) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    callback(new BoundArrayBuffer(this.gl));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}

class BoundArrayBuffer {
  constructor(gl) { this.gl = gl; this.type = gl.ARRAY_BUFFER; }
  assertBoundArrayBuffer() { }

  setData(data, info) {
    this.gl.bufferData(this.type, data, info);
  }

  bufferSubData({ dstByteOffset, srcData, srcOffset, length }) {
    this.gl.bufferSubData(this.type, dstByteOffset, srcData, srcOffset, length)
  }
}

export const clear = (gl, r, g, b, a) => {
  gl.clearColor(r, g, b, a);
  gl.clear(gl.COLOR_BUFFER_BIT);
}