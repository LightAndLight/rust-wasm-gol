export const vertex = `#version 300 es

in vec2 pos;

uniform vec2 resolution;

void main() {
  vec2 zero2one = pos / resolution; // pointwise division, normalise pos to between 0 and 1
  vec2 zero2two = zero2one * 2.0; // stretch pos to span between 0 and 2
  vec2 clipSpace = zero2two - 1.0; // shift pos to span between -1 and 1
  gl_Position = vec4(clipSpace.x, -clipSpace.y, 0, 1);
}
`;

export const fragment = `#version 300 es

precision highp float;

uniform vec4 color;

out vec4 outColor;

void main() {
  outColor = color;
}
`;