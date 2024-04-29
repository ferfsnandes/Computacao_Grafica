/*
  Passo 0:  Inicializando o Canvas e o context.
 */
var canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const maxX = canvas.width, maxY = canvas.height;

var gl = canvas.getContext('webgl2');
console.log(gl);

gl.clearColor(0.1, 0.2, 0.3, 0.4);

gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);


/*
  Passo 2: Criando o código dos shaders que serão executados
  na GPU.
*/

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
uniform float redColor;
uniform float greenColor;
void main(){
   fColor=vec4(redColor, greenColor, 0.0, 1.0);
}`;

/*
  Passo 3: Compilando os códigos e enviando para a GPU. Essa parte do
  código é sempre igual para todos os programas que criaremos.
 */

var vertShdr = gl.createShader(gl.VERTEX_SHADER);
var fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(vertShdr, vertexShader);
gl.shaderSource(fragShdr, fragmentShader);
gl.compileShader(vertShdr);
gl.compileShader(fragShdr);

if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
  var msg = "Vertex shader failed to compile.  The error log is:"
    + "<pre>" + gl.getShaderInfoLog(vertShdr) + "</pre>";
  alert(msg);
}

if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
  var msg = "Fragment shader failed to compile.  The error log is:"
    + "<pre>" + gl.getShaderInfoLog(fragShdr) + "</pre>";
  alert(msg);
}

var program = gl.createProgram();
gl.attachShader(program, vertShdr);
gl.attachShader(program, fragShdr);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  var msg = "Shader program failed to link.  The error log is:"
    + "<pre>" + gl.getProgramInfoLog(program) + "</pre>";
  alert(msg);
}
console.log(program);



function render(...vertices) {
  /*
    Passo 1: Enviando os dados para a GPU
  */

  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),
    gl.STATIC_DRAW);

  /*
    Passo 4: precisamos linkar as variáveis criadas nos shaders com os
    dados que enviamos à GPU para que o programa consiga usar o que foi
    enviado.
  */

  gl.useProgram(program);
  var positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  var redColorLoc = gl.getUniformLocation(program, 'redColor');
  gl.uniform1f(redColorLoc, redColor);

  var greenColorLoc = gl.getUniformLocation(program, 'greenColor');
  gl.uniform1f(greenColorLoc, greenColor);
  /*
    Passo 5: finalmente, agora que está tudo pronto, podemos fazer uma
    chamada para realmente colocar os gráficos na tela.
   */
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
var mouseMove, mouseDown, isDown = false, redColor, greenColor;

function convertCoord(x, y) {
  const newX = ((x / maxX) * 2) - 1
  const newY = -(((y / maxY) * 2) - 1)

  return [newX, newY]
}

canvas.addEventListener("mousedown", (ev) => {
  isDown = true;

  mouseDown = {
    x: ev.offsetX,
    y: ev.offsetY
  }

})

canvas.addEventListener("mouseup", () => {
  isDown = false;
})

canvas.addEventListener("mousemove", (ev) => {
  if (isDown) {
    mouseMove = {
      x: ev.offsetX,
      y: ev.offsetY
    }
    redColor = Math.abs(mouseDown.x - mouseMove.x)/canvas.width
    greenColor = Math.abs(mouseDown.y - mouseMove.y)/canvas.height
    render(...convertCoord(mouseDown.x, mouseDown.y), ...convertCoord(mouseDown.x, mouseMove.y), ...convertCoord(mouseMove.x, mouseMove.y), ...convertCoord(mouseDown.x, mouseDown.y), ...convertCoord(mouseMove.x, mouseDown.y), ...convertCoord(mouseMove.x, mouseMove.y))
  }

})