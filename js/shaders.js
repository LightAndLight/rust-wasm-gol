export const vertex = `#version 300 es

in vec4 pos;

void main() {
  gl_Position = pos;
}
`;

export const fragment = `#version 300 es

precision highp float;

out vec4 color;

void main() {
  color = vec4(1, 0, 0, 1);
}
`;