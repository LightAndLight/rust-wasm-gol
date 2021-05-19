export class Shader {
  gl: WebGL2RenderingContext;
  shader: WebGLShader;

  constructor(gl: WebGL2RenderingContext, shader: WebGLShader) {
    this.gl = gl;
    this.shader = shader;
  }

  static create(gl: WebGL2RenderingContext, type: GLint, src: string): Shader {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
      gl.deleteShader(shader);
      throw new Error(gl.getShaderInfoLog(shader)!);
    } else {
      return new Shader(gl, shader);
    }
  }
}

export class VertexShader extends Shader {
  public static new(gl: WebGL2RenderingContext, src: string): VertexShader {
    return super.create(gl, gl.VERTEX_SHADER, src);
  }
}

export class FragmentShader extends Shader {
  public static new(gl: WebGL2RenderingContext, src: string): FragmentShader {
    return super.create(gl, gl.FRAGMENT_SHADER, src);
  }
}

export class Program {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;

  constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
    this.gl = gl;
    this.program = program;
  }

  public static new(gl: WebGL2RenderingContext, vertexShader: VertexShader, fragmentShader: FragmentShader): Program {
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader.shader);
    gl.attachShader(program, fragmentShader.shader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
      throw new Error(gl.getProgramInfoLog(program)!);
    } else {
      return new Program(gl, program);
    }
  }

  use(callback: (currentProgram: UsedProgram) => void): void {
    this.gl.useProgram(this.program);
    callback(new UsedProgram(this.gl));
    this.gl.useProgram(null);
  }

  getAttribLocation(location: string): GLint {
    return this.gl.getAttribLocation(this.program, location);
  }

  getUniformLocation(location: string): WebGLUniformLocation {
    const mLocation = this.gl.getUniformLocation(this.program, location);
    if (mLocation === null) {
      throw new Error(`location ${location} does not exist`)
    } else {
      return mLocation
    }
  }
}

export class UsedProgram {
  gl: WebGL2RenderingContext;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  uniform2f(location: WebGLUniformLocation, x: number, y: number): void {
    this.gl.uniform2f(location, x, y);
  }

  uniform4f(location: WebGLUniformLocation, x: number, y: number, z: number, w: number): void {
    this.gl.uniform4f(location, x, y, z, w);
  }
}

export class VertexArrayObject {
  gl: WebGL2RenderingContext;
  vao: WebGLVertexArrayObject;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.vao = gl.createVertexArray()!;
  }

  bind(callback: (boundVertexArray: BoundVertexArrayObject) => void): void {
    this.gl.bindVertexArray(this.vao);
    callback(new BoundVertexArrayObject(this.gl));
    this.gl.bindVertexArray(null);
  }
}

class BoundVertexArrayObject {
  gl: WebGL2RenderingContext;
  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  enableVertexAttribArray(location: GLint): void {
    this.gl.enableVertexAttribArray(location);
  }

  vertexAttribPointer(
    _: BoundArrayBuffer,
    location: GLint,
    config: {
      size: number,
      type: number,
      normalize: boolean,
      stride: number,
      offset: number
    }): void {
    this.gl.vertexAttribPointer(
      location,
      config.size,
      config.type,
      config.normalize,
      config.stride,
      config.offset
    )
  }

  vertexAttribDivisor(location: GLint, divisor: number): void {
    this.gl.vertexAttribDivisor(location, divisor)
  }
}

export const drawArrays = (
  gl: WebGL2RenderingContext,
  _program: UsedProgram,
  _vao: BoundVertexArrayObject,
  config: {
    primitive: GLint,
    offset: number,
    count: number
  }): void => {
  gl.drawArrays(config.primitive, config.offset, config.count);
}

export const drawArraysInstanced = (
  gl: WebGL2RenderingContext,
  _program: UsedProgram,
  _vao: BoundVertexArrayObject,
  config: {
    primitive: GLint,
    offset: number,
    count: number,
    instanceCount: number
  }) => {
  gl.drawArraysInstanced(config.primitive, config.offset, config.count, config.instanceCount)
}

export class Buffer {
  gl: WebGL2RenderingContext;
  buffer: WebGLBuffer;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.buffer = gl.createBuffer()!;
  }

  bindArrayBuffer(callback: (boundArrayBuffer: BoundArrayBuffer) => void): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    callback(new BoundArrayBuffer(this.gl));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}

class BoundArrayBuffer {
  gl: WebGL2RenderingContext;
  type: GLint;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.type = gl.ARRAY_BUFFER;
  }

  setData(data: ArrayBufferView, info: GLint) {
    this.gl.bufferData(this.type, data, info);
  }

  bufferSubData(config: { dstByteOffset: number, srcData: ArrayBufferView, srcOffset: number, length: number }) {
    this.gl.bufferSubData(this.type, config.dstByteOffset, config.srcData, config.srcOffset, config.length)
  }
}

export const clear = (gl: WebGL2RenderingContext, r: number, g: number, b: number, a: number) => {
  gl.clearColor(r, g, b, a);
  gl.clear(gl.COLOR_BUFFER_BIT);
}