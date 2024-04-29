var sceneSize = 200
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

let speed = 10;

utils.initShader();

utils.initBuffer({ vertices });

utils.linkBuffer({ variable: "aPosition", reading: 3 });

utils.initBuffer({ vertices: colors });

utils.linkBuffer({ variable: "aColor", reading: 3 });

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

function render() {


    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

    utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });

    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixFront, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: 0, y: sceneSize, width: sceneSize, height: sceneSize } });

    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixTop, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize, y: sceneSize, width: sceneSize, height: sceneSize } });
    
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixSide, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize * 2, y: sceneSize, width: sceneSize, height: sceneSize } });
    
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixFrontSide, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: 0, y: 0, width: sceneSize, height: sceneSize } });

    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixIsometric, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize, y: 0, width: sceneSize, height: sceneSize } });
    
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixIsometric2, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize * 2, y: 0, width: sceneSize, height: sceneSize } });

    window.setTimeout(render, speed);
}

render();