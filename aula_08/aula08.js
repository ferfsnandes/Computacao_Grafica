var sceneSize = 200
let utils = new Utils({ width: sceneSize * 3, height: sceneSize * 3 });

let vertices = [];
let colors = [];

let squareVertices = [
    [-.5, -.5],     // 0
    [-.5, .5],      // 1
    [.5, -.5],      // 2
    [.5, .5],       // 3
];

let drawColors = {
    azul: [0, 0, 1],
    amarelo: [1, 0.87109375, 0],
    verde: [0, 0.609, 0.230],
    vermelho: [1, 0, 0],
    branco: [1, 1, 1],
    preto: [0, 0, 0]
};

utils.initShader({
    vertexShader: `#version 300 es
                        precision mediump float;

                        in vec2 aPosition;
                        
                        in vec3 aColor;
                        out vec4 vColor;

                        uniform float resize;
                        uniform vec3 theta;
                        uniform mat4 uViewMatrix;
                        uniform mat4 uProjectionMatrix;

                        void main(){

                            vec3 angles = radians(theta);
                            vec3 c = cos(angles);
                            vec3 s = sin(angles);

                            mat4 rx = mat4( 1.0, 0.0, 0.0, 0.0,
                                            0.0, c.x, -s.x, 0.0,
                                            0.0, s.x, c.x,  0.0,
                                            0.0, 0.0, 0.0, 1.0);

                            mat4 ry = mat4( c.y, 0.0, s.y, 0.0,
                                            0.0, 1.0, 0.0, 0.0,
                                            -s.y, 0.0, c.y, 0.0,
                                            0.0, 0.0, 0.0, 1.0);

                            mat4 rz = mat4( c.z, -s.z, 0.0, 0.0,
                                            s.z, c.z, 0.0, 0.0,
                                            0.0, 0.0, 1.0, 0.0,
                                            0.0, 0.0, 0.0, 1.0);

                            gl_PointSize = 10.0;
                            gl_Position = rx * ry * rz * vec4(aPosition.x * resize, aPosition.y * resize, .5, 1.0);
                            vColor = vec4(aColor, 1.0);
                        }`,

    fragmentShader: `#version 300 es
                        precision highp float;
                        
                        in vec4 vColor;
                        out vec4 fColor;
                        
                        void main(){
                            fColor=vColor;
                        }`
});

let rotate_x = 0, rotate_y = 0,rotate_z = 0;
let speed = 30;

render()

function render() {
    drawShape(
        [0, 0, 0.3, 50],
        "azul",
        {
            theta: [0, rotate_y, 0],
            shape: "circle",
            method: "TRIANGLE_FAN",
            clear: false
        }
    )

    drawShape(
        [0, 1, 3, 2], 
        "amarelo",
        {
            theta: [0, 0, 45 - rotate_z],
            resize: .7,
            clear: false
        }
    )

    drawShape(
        [0,1,3,2],
        "verde",
        {
            theta: [rotate_x, 0, 0],
            clear: false
        }
    )

    // window.setTimeout(() => render(), speed)
}

function drawShape(vertices_info, cor, {shape = "square", theta = [0,0,0], resize = 1, method = "TRIANGLES", clear = true}) {

    switch (shape) {
        case "square":
            makeSquare(...vertices_info, cor);
            break;
        case "circle":
            makeCircleVertices(...vertices_info, cor)
            break;
    }
    

    utils.initBuffer({ vertices });
    utils.linkBuffer({ variable: "aPosition", reading: 2 });

    utils.initBuffer({ vertices: colors });
    utils.linkBuffer({ variable: "aColor", reading: 3 });

    utils.linkUniformVariable({shaderName: "resize", value: resize, kind: "1f"})
    utils.linkUniformVariable({shaderName: "theta", value: theta, kind: "3fv"})

    utils.drawElements({ method: method, clear})
}

function makeSquare(v1, v2, v3, v4, cor) {
    clearVerticesAndColors()
    
    let triangulos = [];

    triangulos.push(v1, v2, v3);
    triangulos.push(v1, v3, v4);

    triangulos.forEach(vertice => {
        vertices.push(...squareVertices[vertice]);
        colors.push(...drawColors[cor]);
    })
}

function makeCircleVertices(centerX, centerY, radius, numVertices, color) {
    
    clearVerticesAndColors()

    for (var i = 0; i < numVertices; i++) {
        let angle = 2 * Math.PI * i / numVertices;

        let x = centerX + radius * Math.cos(angle);
        let y = centerY + radius * Math.sin(angle);

        vertices.push(x);
        vertices.push(y);

        colors.push(...drawColors[color]); 
    }
}

function clearVerticesAndColors () {
    vertices = []
    colors = []
}