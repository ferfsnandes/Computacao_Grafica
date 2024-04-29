let utils = new Utils({ width: window.innerWidth, height: window.innerHeight });

let vertices = [];
let colors = [];

let cubeVertices = [
    [-.5, -.5,  .5],
    [-.5,  .5,  .5],
    [-.5,  .5, -.5],
    [-.5, -.5, -.5],
    [ .5, -.5,  .5],
    [ .5,  .5,  .5],
    [ .5,  .5, -.5],
    [ .5, -.5, -.5]
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


makeFace(1, 0, 3, 2)
makeFace(2, 3, 4, 6)
makeFace(3, 0, 4, 7)
makeFace(4, 0, 1, 5)
makeFace(5, 1, 2, 6)
makeFace(6, 7, 4, 5)

console.log(colors)

let theta = [0, 0, 20]

let transform_x = 3, transform_y = 1, transform_z = 2;

let speed = 120;

utils.initShader();

utils.initBuffer({vertices});

utils.linkBuffer({variable: "aPosition", reading: 3});

utils.initBuffer({vertices: colors});

utils.linkBuffer({variable: "aColor", reading: 3});

function render() {
    
    
    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

    utils.linkUniformVariable({shaderName: "theta", value: theta, kind: "3fv"});

    utils.drawElements({method: "TRIANGLES"})

    window.setTimeout(render, speed);
}

render();