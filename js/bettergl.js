export class Program {
  constructor(gl, program) {
    this.gl = gl;
    this.program = program;
  }

  use(callback) {
    this.gl.useProgram(this.program);
    callback(new UsedProgram());
    this.gl.useProgram(null);
  }

  getAttribLocation(location) {
    return this.gl.getAttribLocation(this.program, location);
  }
}

export class UsedProgram {
  constructor() { }

  assertUsedProgram() { }
}

export class VertexArrayObject {
  constructor(gl) { this.gl = gl; this.vao = gl.createVertexArray(); }
  bind(callback) {
    this.gl.bindVertexArray(this.val);
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

  bindBufferToAttribute(buffer, location, { size, type, normalize, stride, offset }) {
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
}

export const drawArrays = (gl, program, vao, { primitive, offset, count }) => {
  program.assertUsedProgram();
  vao.assertBoundVertexArrayObject();
  gl.drawArrays(primitive, offset, count);
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
  constructor(gl, type) { this.gl = gl; this.type = type; }
  assertBoundArrayBuffer() { }

  setData(data, info) {
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, info);
  }
}

export const clear = (gl, r, g, b, a) => {
  gl.clearColor(r, g, b, a);
  gl.clear(gl.COLOR_BUFFER_BIT);
}