let utils = new Utils(window.innerWidth, window.innerHeight, 0.1, 0.2, 0.3, 0.4);
let gl = utils.gl;
let vertices = [-1, -1, 0, 1, 1, -1]

utils.initBuffer(vertices)

var vertexShader = `#version 300 es
precision mediump float;

in vec2 aPosition;

void main(){
gl_PointSize = 10.0;
gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision highp float;
out vec4 fColor;
void main(){
   fColor=vec4(1.0, 0.0, 0.0, 1.0);
}`;

let program = utils.initShader(vertexShader, fragmentShader);

utils.linkBuffer()

utils.drawElements(vertices.length / 2)