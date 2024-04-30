
var sceneSize = 430
let utils = new Utils({ width: sceneSize * 3, height: sceneSize * 2 });

let vertices = [];
let colors = [];

let cubeVertices = [
    [-.5, -.5, .5],
    [-.5, .5, .5],
    [-.5, .5, -.5],
    [-.5, -.5, -.5],
    [.5, -.5, .5],
    [.5, .5, .5],
    [.5, .5, -.5],
    [.5, -.5, -.5]
];

let cubeColors = [];

for (let x = -.5; x <= .5; x++) {
    for (let y = -.5; y <= .5; y++) {
        for (let z = -.5; z <= .5; z++) {
            // cubeVertices.push([x, y, z]);
            cubeColors.push([
                x + .5,
                y + .5,
                z + .5
            ]);
        }
    }
}

function makeFace(v1, v2, v3, v4) {
    // Guarda 6 coordenadas (2 Triângulos)
    let triangulos = [];

    triangulos.push(v1, v2, v3);
    triangulos.push(v1, v3, v4);

    triangulos.forEach(vertice => {
        vertices.push(...cubeVertices[vertice]);
        colors.push(...cubeColors[v1]);
    })
}

makeFace(0, 1, 2, 3)
makeFace(2, 6, 7, 3)
makeFace(3, 7, 4, 0)
makeFace(4, 5, 1, 0)
makeFace(5, 6, 2, 1)
makeFace(6, 5, 4, 7)


console.log(colors)

let theta = [0, 0, 0]

let transform_x = 1, transform_y = 1, transform_z = 0;

let speed = 30;

utils.initShader();

utils.initBuffer({ vertices });

utils.linkBuffer({ variable: "aPosition", reading: 3 });

var projectionOrthoMatrix = mat4.create();

var size = 1; // Metade da largura/altura total desejada
var centerX = 0; // Posição X central da janela de projeção
var centerY = 0; // Posição Y central da janela de projeção

mat4.ortho(projectionOrthoMatrix,
    centerX - size, // esquerda
    centerX + size, // direta
    centerY - size, // baixo
    centerY + size, // cima
    0.1, // Quão perto objetos podem estar da câmera
    // antes de serem recortados
    100.0); // Quão longe objetos podem estar da câmera antes
// de serem recortados

utils.linkUniformMatrix({
    shaderName: "uProjectionMatrix",
    value: projectionOrthoMatrix,
    kind: "4fv"
});

var viewMatrixFront = mat4.create();

mat4.lookAt(viewMatrixFront, [0, 0, 5], [0, 0, 0], [0, 1, 0]);
var viewMatrixTop = mat4.create();
mat4.lookAt(viewMatrixTop, [0, 5, 0], [0, 0, 0], [0, 0, -1]);
var viewMatrixSide = mat4.create();
mat4.lookAt(viewMatrixSide, [-5, 0, 0], [0, 0, 0], [0, 1, 0]);
var viewMatrixFrontSide = mat4.create();
mat4.lookAt(viewMatrixFrontSide, [-5, 0, 5], [0, 0, 0], [0, 1, 0]);
var viewMatrixIsometric = mat4.create();
mat4.lookAt(viewMatrixIsometric, [-5, 5, 5], [0, 0, 0], [0, 1, 0]);
var viewMatrixIsometric2 = mat4.create();
mat4.lookAt(viewMatrixIsometric2, [5, -5, 5], [0, 0, 0], [0, 1, 0]);
// novos viewports
var viewMatrixAdcional1 = mat4.create();
mat4.lookAt(viewMatrixAdcional1, [5, 5, 5], [0, 0, 0], [0, 1, 0]);
var viewMatrixAdcional2 = mat4.create();
mat4.lookAt(viewMatrixAdcional2, [-5, -5, 5], [0, 0, 0], [0, 1, 0]);


let { gl } = utils;
let textura1 = gl.createTexture();

var texture1 = new Image();
texture1.onload = function () {
    // Configuraremos a textura1 aqui.
    gl.bindTexture(gl.TEXTURE_2D, textura1)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture1)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
}
texture1.src = 'texturas/TheCollegeDropout.jpg';

let texture2 = gl.createTexture();

var textura2 = new Image();
textura2.onload = function () {
    // Configuraremos a textura1 aqui.
    gl.bindTexture(gl.TEXTURE_2D, texture2)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura2)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
}
textura2.src = 'texturas/LateRegistration.jpg';

let texture3 = gl.createTexture();

var textura3 = new Image();
textura3.onload = function () {
    // Configuraremos a textura1 aqui.
    gl.bindTexture(gl.TEXTURE_2D, texture3)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura3)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
}
textura3.src = 'texturas/Graduation.jpg';

let texture4 = gl.createTexture();

var textura4 = new Image();
textura4.onload = function () {
    // Configuraremos a textura1 aqui.
    gl.bindTexture(gl.TEXTURE_2D, texture4)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura4)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
}
textura4.src = 'texturas/MBDTF.jpg';

let texture5 = gl.createTexture();

var textura5 = new Image();
textura5.onload = function () {
    // Configuraremos a textura1 aqui.
    gl.bindTexture(gl.TEXTURE_2D, texture5)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura5)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
}
textura5.src = 'texturas/TheLifeOfPablo.jpg';

let texture6 = gl.createTexture();

var textura6 = new Image();
textura6.onload = function () {
    // Configuraremos a textura1 aqui.
    gl.bindTexture(gl.TEXTURE_2D, texture6)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textura6)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
}
textura6.src = 'texturas/Vultures.jpg';

let textureCoordinates = [
    // 0
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // 1
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // 2
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // 3
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // 4
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // 5
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
]

utils.initBuffer({ vertices: textureCoordinates })
utils.linkBuffer({ reading: 2, variable: "texCoords" })


function render() {
    // Atualizar e vincular as texturas
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textura1)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, texture2)
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, texture3)
    gl.activeTexture(gl.TEXTURE3)
    gl.bindTexture(gl.TEXTURE_2D, texture4)
    gl.activeTexture(gl.TEXTURE4)
    gl.bindTexture(gl.TEXTURE_2D, texture5)
    gl.activeTexture(gl.TEXTURE5)
    gl.bindTexture(gl.TEXTURE_2D, texture6)

    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

    utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });

    utils.linkUniformVariable({ shaderName: "uSampler", value: 0, kind: "1i" })
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixFront, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: 0, y: sceneSize, width: sceneSize, height: sceneSize } });

    utils.linkUniformVariable({ shaderName: "uSampler", value: 1, kind: "1i" })
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixTop, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize, y: sceneSize, width: sceneSize, height: sceneSize } });


    utils.linkUniformVariable({ shaderName: "uSampler", value: 2, kind: "1i" })
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixSide, kind: "4fv" });
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixFrontSide, kind: "4fv" });
    let viewport3X = sceneSize;
    let viewport3Y = 0;
    let viewport3Width = sceneSize;
    let viewport3Height = sceneSize;
    utils.drawScene({ method: "TRIANGLES", viewport: { x: viewport3X, y: viewport3Y, width: viewport3Width, height: viewport3Height } });

    utils.linkUniformVariable({ shaderName: "uSampler", value: 3, kind: "1i" })
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixIsometric, kind: "4fv" });
    let viewport4X = 0;
    let viewport4Y = 0;
    let viewport4Width = sceneSize;
    let viewport4Height = sceneSize;
    utils.drawScene({ method: "TRIANGLES", viewport: { x: viewport4X, y: viewport4Y, width: viewport4Width, height: viewport4Height } });

    utils.linkUniformVariable({ shaderName: "uSampler", value: 4, kind: "1i" })
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixAdcional1, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: 2 * sceneSize, y: 0, width: sceneSize, height: sceneSize } });


    utils.linkUniformVariable({ shaderName: "uSampler", value: 5, kind: "1i" })
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixAdcional2, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: 2 * sceneSize, y: sceneSize, width: sceneSize, height: sceneSize } });

    window.setTimeout(render, speed);
}

render();
