var sceneSize = 200
let utils = new Utils({ width: sceneSize * 4, height: sceneSize * 3, a: .2});

let rotationCtrl = new Controls("rotation", "Horário", "Anti-Horário")
let scaleCtrl = new Controls("scale", "Aumentando", "Diminuindo", { increment: .01 })
let translationCtrl = new Controls("translation", "Pra Frente", "Pra Trás", { increment: .01 })
let speedSlider = window.document.querySelector("#spd-slider")
let speedValueEl = window.document.querySelector("#speed-value")

speedSlider.addEventListener("input", () => {
    speed = -speedSlider.value
    speedValueEl.innerText = -speedSlider.value
})

let vertices = [];
let colors = [];

let squareVertices = [
    [-.5, -.5],     // 0
    [-.5, .5],      // 1
    [.5, -.5],      // 2
    [.5, .5],       // 3
    
    [-.5, 0.0],     // 4
    [0.0, -.5],     // 5
    [ .5, 0.0],     // 6
    [0.0,  .5],     // 7

    [.25,.5],  //8
    [.25,-.5],//9
    [-.25,-.5],//10
    [-.25,.5],//11
];

let drawColors = {
    azul: [0.015625, 0.3125, 0.56640625],
    ciano: [0.26171875, 0.7421875, 0.84375],
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
                        uniform float translate;

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
                            gl_Position = rz * vec4(aPosition, .5, 1.0);
                            gl_Position.x = (gl_Position.x * resize) + translate;
                            gl_Position.y = (gl_Position.y * resize) + translate;
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

let theta = [0, 0, 0]
let size = 1;
let translate_x_y = 0;

let speed = 30;

utils.gl.lineWidth(5);

render()

function render() {

    theta[2] += rotationCtrl.currValue; 
    size += scaleCtrl.currValue;
    translate_x_y += translationCtrl.currValue;


    drawShape(
        [8, 9, 11, 10],
        "amarelo",
        {
            theta: theta,
            resize: size *.2,
            translation: translate_x_y,
            clear: false,
        }
    );
    
    drawShape(
        [0, 1, 3, 2], 
        "vermelho",
        {
            theta: theta,
            resize: size * .2,
            translation: translate_x_y,
            clear: false,
        }
    )
    drawShape(
        [10, 11, 9, 8], 
        "verde",
        {
            theta: theta,
            resize: size * .4,
            translation: translate_x_y,
            clear: false,
        }
    )


    
drawShape(
    [8, 9, 11, 10],
    "branco",
    {
        theta: theta,
        resize: size ,
        translation: translate_x_y,
        clear: false,
    }
);

drawShape(
    [10, 11, 9, 8],
    "branco",
    {
        theta: theta,
        resize: size ,
        translation: translate_x_y,
        clear: false,
    }
);

    drawShape(
        [0,1,3,2],
        "azul",
        {
            theta: theta,
            resize: size,
            translation: translate_x_y,
            clear: false
        }
    )

    window.setTimeout(() => render(), speed)
}

function drawShape(vertices_info, cor, {shape = "square", theta = [0,0,0], resize = 1, translation = 0, method = "TRIANGLES", clear = true, reading = 2}) {

    switch (shape) {
        case "square":
            makeSquare(...vertices_info, cor);
            break;

    }
    
    utils.initBuffer({ vertices });
    utils.linkBuffer({ variable: "aPosition", reading: reading });

    utils.initBuffer({ vertices: colors });
    utils.linkBuffer({ variable: "aColor", reading: 3 });

    utils.linkUniformVariable({shaderName: "resize", value: resize, kind: "1f"})
    utils.linkUniformVariable({shaderName: "theta", value: theta, kind: "3fv"})
    utils.linkUniformVariable({shaderName: "translate", value: translation, kind: "1f"})

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

function clearVerticesAndColors () {
    vertices = []
    colors = []
}