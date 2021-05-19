export abstract class ShaderSource {
  static GLSL_VERSION = "300 es";

  abstract read(): { deps: Record<string, ShaderPart>, srcs: string[] }
}

export class ShaderPart extends ShaderSource {
  deps: Record<string, ShaderPart>;
  src: string;

  constructor(deps: Record<string, ShaderPart>, src: string) {
    super();
    this.deps = deps;
    this.src = src;
  }

  read(): { deps: Record<string, ShaderPart>, srcs: string[] } {
    return { deps: this.deps, srcs: [this.src] };
  }
}

function generateDeps(deps: Record<string, ShaderPart>): string[] {
  return Object.values(deps).flatMap(dep => {
    const { deps: depDeps, srcs: depSrcs } = dep.read();
    var generated = generateDeps(depDeps);
    generated.push(...depSrcs);
    return generated;
  });
}

export class ShaderProgram extends ShaderSource {
  version: string
  srcs: ShaderPart[]

  constructor(srcs: ShaderPart[]) {
    super();
    this.version = ShaderSource.GLSL_VERSION;
    this.srcs = srcs;
  }

  read(): { deps: Record<string, ShaderPart>, srcs: string[] } {
    var deps: Record<string, ShaderPart> = {};
    var srcs: string[] = [];
    this.srcs.forEach(src => {
      const { deps: srcDeps, srcs: srcCode } = src.read();
      deps = { ...deps, ...srcDeps };
      srcs.push(...srcCode);
    });
    return { deps, srcs };
  }

  generate(): string {
    const { deps, srcs } = this.read();
    return `#version ${this.version}\n\n${generateDeps(deps).join("\n")}\n\n${srcs.join("\n")}`;
  }
}

const screen2clip = new ShaderPart(
  {},
  `void screen2clip(in vec2 pos, in vec2 resolution, out vec2 clipSpace) {
  vec2 zero2one = pos / resolution; // pointwise division, normalise pos to between 0 and 1
  vec2 zero2two = zero2one * 2.0; // stretch pos to span between 0 and 2
  clipSpace = (zero2two - 1.0) * vec2(1, -1); // shift pos to span between -1 and 1, but flip y-axis
}`
);

export const gridVertex = new ShaderPart(
  {
    screen2clip
  },
  `in vec2 pos;
in vec2 offset;

uniform vec2 resolution;

void main() {
  vec2 clipSpace;
  screen2clip(pos + offset, resolution, clipSpace);
  gl_Position = vec4(clipSpace, 0, 1);
}`
);

export const gridFragment = new ShaderPart(
  {},
  `precision highp float;

uniform vec4 color;

out vec4 outColor;

void main() {
  outColor = color;
}`);

export const cellVertex = new ShaderPart(
  {
    screen2clip
  },
  `in vec2 pos;
in vec2 offset;
in vec3 colour;

uniform vec2 resolution;

out vec4 fragColour;

void main() {
  vec2 clipSpace;
  screen2clip(pos + offset, resolution, clipSpace);
  fragColour = vec4(colour, 1);
  gl_Position = vec4(clipSpace, 0, 1);
}`
);

export const cellFragment = new ShaderPart(
  {},
  `precision highp float;

in vec4 fragColour;

out vec4 outColor;

void main() {
  outColor = fragColour;
}`);