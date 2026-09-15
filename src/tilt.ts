// Perspective-warps a canvas with WebGL (Canvas 2D has no 3D transforms).
// Returns a canvas whose size is the projected bounds, centred on the original centre.

const VERT = `
attribute vec2 a_pos;
uniform mat3 u_rot;
uniform vec2 u_size;
uniform vec2 u_out;
uniform float u_dist;
varying vec2 v_uv;
void main() {
  vec3 p = u_rot * vec3(a_pos * u_size, 0.0);
  float w = (u_dist - p.z) / u_dist;
  gl_Position = vec4(p.x * 2.0 / u_out.x, -p.y * 2.0 / u_out.y, 0.0, w);
  v_uv = a_pos + 0.5;
}`

const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
varying vec2 v_uv;
void main() { gl_FragColor = texture2D(u_tex, v_uv); }`

let state: {
  canvas: HTMLCanvasElement
  gl: WebGLRenderingContext
  loc: Record<string, WebGLUniformLocation | null>
} | null = null

function init() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: true })
  if (!gl) return null
  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!
    gl.shaderSource(s, src)
    gl.compileShader(s)
    return s
  }
  const prog = gl.createProgram()!
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  gl.useProgram(prog)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'a_pos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const loc = Object.fromEntries(['u_rot', 'u_size', 'u_out', 'u_dist'].map((n) => [n, gl.getUniformLocation(prog, n)]))
  return { canvas, gl, loc }
}

function rotation(tiltX: number, tiltY: number) {
  const ax = (tiltX * Math.PI) / 180
  const ay = (tiltY * Math.PI) / 180
  const [cx, sx, cy, sy] = [Math.cos(ax), Math.sin(ax), Math.cos(ay), Math.sin(ay)]
  // R = Rx * Ry, row-major
  return [
    [cy, 0, sy],
    [sx * sy, cx, -sx * cy],
    [-cx * sy, sx, cx * cy],
  ]
}

export function tilt(src: HTMLCanvasElement, tiltX: number, tiltY: number): HTMLCanvasElement | null {
  state ??= init()
  if (!state) return null
  const { canvas, gl, loc } = state
  const w = src.width
  const h = src.height
  const dist = Math.max(w, h) * 2.2
  const R = rotation(tiltX, tiltY)

  let maxX = 0
  let maxY = 0
  for (const [x, y] of [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]]) {
    const px = R[0][0] * x + R[0][1] * y
    const py = R[1][0] * x + R[1][1] * y
    const pz = R[2][0] * x + R[2][1] * y
    const s = dist / (dist - pz)
    maxX = Math.max(maxX, Math.abs(px * s))
    maxY = Math.max(maxY, Math.abs(py * s))
  }
  const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number
  if (w > max || h > max) return null
  canvas.width = Math.min(max, Math.ceil(maxX * 2) + 2)
  canvas.height = Math.min(max, Math.ceil(maxY * 2) + 2)

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src)
  // column-major for GLSL
  gl.uniformMatrix3fv(loc.u_rot, false, [R[0][0], R[1][0], R[2][0], R[0][1], R[1][1], R[2][1], R[0][2], R[1][2], R[2][2]])
  gl.uniform2f(loc.u_size, w, h)
  gl.uniform2f(loc.u_out, canvas.width, canvas.height)
  gl.uniform1f(loc.u_dist, dist)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  return canvas
}
