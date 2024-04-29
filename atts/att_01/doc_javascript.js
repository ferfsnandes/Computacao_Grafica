let canvas1 = window.document.querySelector("#canvas1");
let canvas2 = window.document.querySelector("#canvas2");

canvas1.width = window.innerWidth - 20
canvas1.height = (window.innerHeight / 2) - 40

canvas2.width = window.innerWidth - 20
canvas2.height = (window.innerHeight / 2) - 40

let maxX = 50, maxY = 50;

let gl_01 = canvas1.getContext("webgl2");
let gl_02 = canvas2.getContext("webgl2")

plotaReta(bresenham(0,0, 50, 15), gl_01)
plotaReta(dda(0,0, 50, 15), gl_02)

function plotaReta(vertices, gl) {
    gl.clearColor(.4, .4, .4, 1)

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

    let bufferId = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    let vertexShader = `#version 300 es
precision mediump float;
in vec2 aPosition;
void main()
{
    gl_PointSize = 10.0;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

    let fragmentShader = `#version 300 es
precision highp float;
out vec4 fColor;
void main() {
    fColor = vec4(1.0, 0.0, 0.0, 1.0); // r,g,b,a
}
`
    console.log(vertexShader);
    console.log(fragmentShader);


    var vertShdr = gl.createShader(gl.VERTEX_SHADER);
    var fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertShdr, vertexShader);
    gl.shaderSource(fragShdr, fragmentShader);
    gl.compileShader(vertShdr);
    gl.compileShader(fragShdr);

    console.log(gl);

    if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
        var msg = "Vertex shader failed to compile. The error log is: "
    + "<pre>" + gl.getShaderInfoLog(vertShdr) + "</pre>";
        alert(msg);
    }
    if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
        var msg = "Fragment shader failed to compile. The error log is: "
    + "<pre>" + gl.getShaderInfoLog(fragShdr) + "</pre>";
        alert(msg);
    }

    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    gl.useProgram(program);
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link. The error log is:"
+ "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
    }
    console.log(program);
    //console.log(gl.getProgramParameter(program, gl.LINK_STATUS));

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    gl.drawArrays(gl.POINTS, 0, Math.floor(vertices.length/2))
}

function convertCoord(x, y) {
    const newX = ((x / maxX) * 2) - 1
    const newY = ((y / maxY) * 2) - 1

    return [newX, newY]
}

function bresenham(x1, y1, x2, y2) {
    let vertices = []

    let x = x1, y = y1;

    let deltaX = Math.abs(x2-x1), deltaY = Math.abs(y2-y1);

    let s1 = Math.sign(x2-x1), s2 = Math.sign(y2-y1)

    let interchange = false;

    if (deltaY > deltaX) {
        let aux = deltaX
        deltaX = deltaY
        deltaY = aux
        interchange = true
    }

    let e = 2 * (deltaY - deltaX)

    for(let i = 1; i <= deltaX; i++) {
        vertices.push(...convertCoord(x, y)); 
        while (e > 0){
            interchange ? x += s1 : y += s2
            e -= (2 * deltaX)    
        }
        interchange ? y += s2 : x += s1
        e += 2 * deltaY
    }
    return vertices
}


function dda(x1, y1, x2, y2) {
    let pontos = []

    let Length;

    if (Math.abs(x2 - x1) >= Math.abs(y2 - y1)) {
        Length = Math.abs(x2 - x1)
    } else {
        Length = Math.abs(y2 - y1)
    }

    let x = x1 + .5, y = y1 + .5;
    
    let deltaX = Math.abs(x2 - x1) / Length, deltaY = Math.abs(y2 - y1) / Length;

    let i = 1;

    while(i <= Length) {
        pontos.push(...convertCoord(Math.floor(x), Math.floor(y)))
        x += deltaX;
        y += deltaY;
        i++;
    }
    return pontos
}

