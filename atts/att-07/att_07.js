var utils = new Utils();

// Colocaremos aqui os dado que passaremos para a GPU
var vertices = [];
var colors = [];
var texCoords = [];

// Coordenadas dos vértices do cubo
var cubeVertices = [
    [-0.5, -0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
    [-0.5, -0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, -0.5, -0.5]
];

// Coordenadas de textura para cada face
var faceTexCoords = [
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]
];

var cubeColors = [
    [0.0, 0.0, 0.0],   // preto
    [1.0, 0.0, 0.0],   // vermelho
    [1.0, 1.0, 0.0],   // amarelo
    [0.0, 1.0, 0.0],   // verde
    [0.0, 0.0, 1.0],   // azul
    [1.0, 0.0, 1.0],   // rosa
    [0.0, 1.0, 1.0],   // ciano
    [1.0, 1.0, 1.0]    // branco
];

// Inicializa e ativa a textura
function initAndActivateTexture(src, textureUnit) {
    let gl = utils.gl;
    let texture = gl.createTexture();
    let img = new Image();
    img.onload = function () {
        gl.activeTexture(gl[`TEXTURE${textureUnit}`]);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    };
    img.src = src;
    return texture;
}

// Carregar texturas
let texture1 = initAndActivateTexture("texturas/Kendrick.jpg", 0); 
let texture2 = initAndActivateTexture("texturas/LikeThat.jpg", 1);
let texture3 = initAndActivateTexture("texturas/Euphoria.jpg", 2);
let texture4 = initAndActivateTexture("texturas/6_16inLA.jpg", 3);
let texture5 = initAndActivateTexture("texturas/MeetTheGrahams.jpg", 4);
let texture6 = initAndActivateTexture("texturas/NotLikeUs.jpg", 5);

// Função para criar uma face do cubo
function makeFace(v1, v2, v3, v4, texIndex) {
    let indices = [v1, v2, v3, v1, v3, v4];
    let texCoordsForFace = faceTexCoords[texIndex];

    for (let i = 0; i < indices.length; i++) {
        vertices.push(...cubeVertices[indices[i]]);
        colors.push(...cubeColors[indices[i]]);
        texCoords.push(texCoordsForFace[i * 2], texCoordsForFace[i * 2 + 1]);
    }
}

// Criar todas as faces do cubo
makeFace(1, 0, 3, 2, 0); // Frente
makeFace(2, 3, 7, 6, 1); // Direita
makeFace(3, 0, 4, 7, 2); // Baixo
makeFace(6, 5, 1, 2, 3); // Cima
makeFace(4, 5, 6, 7, 4); // Trás
makeFace(5, 4, 0, 1, 5); // Esquerda

// Inicializar shaders
utils.initShader({
    vertexShader: `#version 300 es
    precision mediump float;

    in vec3 aPosition;
    in vec3 aColor;
    in vec2 aTexCoord;

    uniform mat4 uViewMatrix;
    uniform mat4 uProjectionMatrix;

    uniform float uPitch;
    uniform float uYaw;

    uniform vec3 theta;  // Ângulos de rotação para x, y, z
    uniform vec3 uTranslation;  // Vetor de translação
    uniform float uScale;  // Fator de escala

    out vec4 vColor;  // Cor para interpolação
    out vec2 vTexCoord; // Coordenadas de textura para interpolação

    void main() {
        vec3 c = cos(radians(theta));
        vec3 s = sin(radians(theta));

        mat4 rx = mat4(1.0,  0.0,  0.0, 0.0,
                    0.0,  c.x,  s.x, 0.0,
                    0.0, -s.x,  c.x, 0.0,
                    0.0,  0.0,  0.0, 1.0);

        mat4 ry = mat4(c.y, 0.0, -s.y, 0.0,
                    0.0, 1.0,  0.0, 0.0,
                    s.y, 0.0,  c.y, 0.0,
                    0.0, 0.0,  0.0, 1.0);

        mat4 rz = mat4(c.z, s.z, 0.0, 0.0,
                    -s.z,  c.z, 0.0, 0.0,
                    0.0,  0.0, 1.0, 0.0,
                    0.0,  0.0, 0.0, 1.0);

        mat4 scaleMatrix = mat4(
            uScale, 0.0,    0.0,    0.0,
            0.0,    uScale, 0.0,    0.0,
            0.0,    0.0,    uScale, 0.0,
            0.0,    0.0,    0.0,    1.0
        );

        mat4 translationMatrix = mat4(
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            uTranslation.x, uTranslation.y, uTranslation.z, 1.0
        );

        mat4 crx = mat4(1.0,  0.0,  0.0, 0.0,
                        0.0,  cos(radians(uPitch)),  sin(radians(uPitch)), 0.0,
                        0.0, -sin(radians(uPitch)),  cos(radians(uPitch)), 0.0,
                        0.0,  0.0,  0.0, 1.0);

        mat4 cry = mat4(cos(radians(uYaw)), 0.0, -sin(radians(uYaw)), 0.0,
                        0.0, 1.0,  0.0, 0.0,
                        sin(radians(uYaw)), 0.0,  cos(radians(uYaw)), 0.0,
                        0.0, 0.0,  0.0, 1.0);

        mat4 modelMatrix = uProjectionMatrix * cry * crx * uViewMatrix * translationMatrix * scaleMatrix * rz * ry * rx;

        gl_Position = modelMatrix * vec4(aPosition, 1.0);
        vColor = vec4(aColor, 1.0);
        vTexCoord = aTexCoord;
    }
    `,
    fragmentShader: `#version 300 es
    precision mediump float;

    in vec4 vColor;
    in vec2 vTexCoord;

    out vec4 fragColor;

    uniform sampler2D uTexture;

    void main() {
        fragColor = texture(uTexture, vTexCoord);
    }
    `
}, vertices, colors, texCoords);

// Definir matrizes de visualização e projeção
var viewMatrix = mat4.create();
var projectionMatrix = mat4.create();

mat4.perspective(projectionMatrix, 45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100.0);
mat4.lookAt(viewMatrix, [0, 0, 3], [0, 0, 0], [0, 1, 0]);

// Função para atualizar e renderizar a cena
function render() {
    var gl = utils.gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    utils.setUniforms({
        uViewMatrix: viewMatrix,
        uProjectionMatrix: projectionMatrix,
        uPitch: pitch,
        uYaw: yaw,
        theta: [angleX, angleY, angleZ],
        uTranslation: [translationX, translationY, translationZ],
        uScale: scale,
        uTexture: 0 // Apenas uma textura ativa por enquanto
    });

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3);

    requestAnimationFrame(render);
}

// Configurações de rotação, translação e escala
var angleX = 0;
var angleY = 0;
var angleZ = 0;

var translationX = 0;
var translationY = 0;
var translationZ = 0;

var scale = 1;

var pitch = 0;
var yaw = 0;

// Configurar o canvas e o contexto WebGL
var canvas = document.getElementById('canvas');
var gl = canvas.getContext('webgl2');

if (!gl) {
    console.error("WebGL 2 not available");
}

// Inicializar a cena
utils.initGL(gl);
utils.gl = gl;

// Ativar o teste de profundidade
gl.enable(gl.DEPTH_TEST);

// Configurar a cor de fundo
gl.clearColor(0.0, 0.0, 0.0, 1.0);

// Iniciar a renderização
requestAnimationFrame(render);

// Event listeners para interações do usuário
window.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'ArrowUp':
            translationY += 0.1;
            break;
        case 'ArrowDown':
            translationY -= 0.1;
            break;
        case 'ArrowLeft':
            translationX -= 0.1;
            break;
        case 'ArrowRight':
            translationX += 0.1;
            break;
        case 'w':
            angleX += 5;
            break;
        case 's':
            angleX -= 5;
            break;
        case 'a':
            angleY -= 5;
            break;
        case 'd':
            angleY += 5;
            break;
        case 'q':
            angleZ -= 5;
            break;
        case 'e':
            angleZ += 5;
            break;
        case '+':
            scale += 0.1;
            break;
        case '-':
            scale -= 0.1;
            break;
        case 'i':
            pitch += 5;
            break;
        case 'k':
            pitch -= 5;
            break;
        case 'j':
            yaw -= 5;
            break;
        case 'l':
            yaw += 5;
            break;
    }
});
