var utils = new Utils();


// Colocaremos aqui os dado que passaremos para a GPU
var vertices = []
var colors = []
var normals = [] // Precisamos agora do vetor normal de cada face para começar a computar.

// Colocaremos todas as coordenadas do cubo
var cubeVertices = [
    [-0.5, -0.5, 0.5],
    [-0.5, 0.5, 0.5],
    [0.5, 0.5, 0.5],
    [0.5, -0.5, 0.5],
    [-0.5, -0.5, -0.5],
    [-0.5, 0.5, -0.5],
    [0.5, 0.5, -0.5],
    [0.5, -0.5, -0.5]
]

let textureCoordinates = [
    // 0
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,


    //  1
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

var cubeColors = [
    [0.0, 0.0, 0.0],   // preto
    [1.0, 0.0, 0.0],   // vermelho
    [1.0, 1.0, 0.0],   // amarelo
    [0.0, 1.0, 0.0],   // verde
    [0.0, 0.0, 1.0],   // azul
    [1.0, 0.0, 1.0],   // rosa
    [0.0, 1.0, 1.0],   // ciano
    [1.0, 1.0, 1.0]    // branco
]

let faceTextureCoordinates = [
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], // Face 0
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], // Face 1
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], // Face 2
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], // Face 3
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0], // Face 4
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0]  // Face 5
];


function computeProdutoVetorial(A, B, C) {
    // Extrair coordenadas dos pontos
    const Ax = A[0], Ay = A[1], Az = A[2];
    const Bx = B[0], By = B[1], Bz = B[2];
    const Cx = C[0], Cy = C[1], Cz = C[2];

    // Formar vetores AB e AC
    const ABx = Bx - Ax;
    const ABy = By - Ay;
    const ABz = Bz - Az;
    const ACx = Cx - Ax;
    const ACy = Cy - Ay;
    const ACz = Cz - Az;

    // Calcular o produto vetorial de AB e AC
    const i = ABy * ACz - ABz * ACy;
    const j = ABz * ACx - ABx * ACz;
    const k = ABx * ACy - ABy * ACx;

    // Retornar o vetor resultante
    return [i, j, k];
}

let texture1 = initAndActivateTexture("texturas/Kendrick.jpg", 0); // Textura 0
let texture2 = initAndActivateTexture("texturas/LikeThat.jpg", 1); // Textura 1
let texture3 = initAndActivateTexture("texturas/Euphoria.jpg", 2); // Textura 2
let texture4 = initAndActivateTexture("texturas/6_16inLA.jpg", 3); // Textura 3
let texture5 = initAndActivateTexture("texturas/MeetTheGrahams.jpg", 4); // Textura 4
let texture6 = initAndActivateTexture("texturas/NotLikeUs.jpg", 5); // Textura 5

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
    }
    img.src = src;
    return texture;
}

function makeFace(v1, v2, v3, v4, faceIndex) {
    var normal = computeProdutoVetorial(
        cubeVertices[v1],
        cubeVertices[v2],
        cubeVertices[v3]
    );

    var triangulos = [v1, v2, v3, v1, v3, v4];
    var faceTexCoords = faceTextureCoordinates[faceIndex];

    for (var i = 0; i < triangulos.length; i++) {
        var vertexIndex = triangulos[i];
        vertices.push(cubeVertices[vertexIndex][0]);
        vertices.push(cubeVertices[vertexIndex][1]);
        vertices.push(cubeVertices[vertexIndex][2]);

        colors.push(cubeColors[vertexIndex][0]);
        colors.push(cubeColors[vertexIndex][1]);
        colors.push(cubeColors[vertexIndex][2]);

        normals.push(normal[0]);
        normals.push(normal[1]);
        normals.push(normal[2]);

        // Adicionar coordenadas de textura
        textureCoordinates.push(faceTexCoords[(i % 6) * 2]);
        textureCoordinates.push(faceTexCoords[(i % 6) * 2 + 1]);
    }
}

// Abaixo tomamos o cuidade de sempre gerar uma face começando com um
// dos vértices. Isso permite dar à face a cor do vértice.
makeFace(1, 0, 3, 2, 0);
makeFace(2, 3, 7, 6, 1);
makeFace(3, 0, 4, 7, 2);
makeFace(6, 5, 1, 2, 3);
makeFace(4, 5, 6, 7, 4);
makeFace(5, 4, 0, 1, 5);

// Criamos agora as variáveis aPosition e aColor para recebermos tanto
// a posição quanto as cores de cada vértice.
utils.initShader({
    vertexShader: `#version 300 es
precision mediump float;

in vec3 aPosition;
in vec3 aNormal;
in vec3 aColor;


uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

uniform float uPitch;
uniform float uYaw;

uniform vec3 theta;  // Ângulos de rotação para x, y, z
uniform vec3 uTranslation;  // Vetor de translação
uniform float uScale;  // Fator de escala

uniform vec3 uLightPosition;  // Posição da fonte de luz Spotlight
uniform vec3 uLightDirection;  // Direção da luz Spotlight
uniform float uCutOff;  // Ângulo de corte do cone de luz
uniform float uOuterCutOff;  // Ângulo externo do cone de luz para suavizar as bordas
uniform vec3 uAmbientLight;  // Luz ambiente
uniform vec3 uLightColor;  // Cor da luz

out vec3 vNormal;  // Normal para cálculo no fragment shader
out vec3 vLightDir;  // Direção da luz para cálculo no fragment shader
out vec3 vViewPosition;  // Posição do ponto de vista para cálculo no fragment shader
out vec4 vColor;  // Cor para interpolação

in vec2 texCoords;
out vec2 textureCoords;

void main() {
    // Cálculo das matrizes de rotação baseadas em ângulos theta
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

    // Matriz de escala
    mat4 scaleMatrix = mat4(
        uScale, 0.0,    0.0,    0.0,
        0.0,    uScale, 0.0,    0.0,
        0.0,    0.0,    uScale, 0.0,
        0.0,    0.0,    0.0,    1.0
    );

    // Matriz de translação
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
   
    vec4 transformedPosition = modelMatrix * vec4(aPosition, 1.0);

    gl_Position = transformedPosition;

    // Passa as normais transformadas e outros dados para o fragment shader
    vNormal = normalize(mat3(transpose(inverse(modelMatrix))) * aNormal);
    vLightDir = normalize(uLightPosition - vec3(transformedPosition));
    vViewPosition = vec3(transformedPosition);
    vColor = vec4(aColor, 1.0);  // Passa a cor original para interpolação
    textureCoords = texCoords;
}
`,
    fragmentShader: `#version 300 es
    precision mediump float;
    
    in vec2 textureCoords;
    in vec4 vColor;  // Cor vinda do vertex shader
    in vec3 vNormal; // Normal transformada vinda do vertex shader
    in vec3 vLightDir; // Direção da luz vinda do vertex shader
    in vec3 vViewPosition; // Posição do vértice vinda do vertex shader
    
    out vec4 fColor;
    
    uniform vec3 uLightPosition; // Posição da fonte de luz Spotlight
    uniform vec3 uLightDirection; // Direção da luz Spotlight
    uniform vec3 uLightColor; // Cor da luz
    uniform vec3 uAmbientLight; // Luz ambiente
    uniform float uCutOff; // Ângulo de corte do cone de luz
    uniform float uOuterCutOff; // Ângulo externo para suavização na borda do cone
    uniform sampler2D uSampler;
    
    void main() {
        // Calcula componente ambiente
        vec3 ambient = uAmbientLight * vColor.rgb;
    
        // Calcula componente difusa
        vec3 norm = normalize(vNormal);
        vec3 lightDir = normalize(vLightDir);
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = uLightColor * diff * vColor.rgb;
    
        // Calcula a atenuação do Spotlight
        float theta = dot(lightDir, normalize(-uLightDirection));
        float epsilon = uCutOff - uOuterCutOff;
        float intensity = clamp((theta - uOuterCutOff) / epsilon, 0.0, 1.0);
        if (theta > uCutOff)
            intensity = 0.0;
    
        // Combina os componentes de iluminação
        vec3 lighting = (ambient + diffuse * intensity);
        fColor = texture(uSampler, textureCoords);
    }
    
`
});

utils.initBuffer({ vertices });
utils.linkBuffer({ reading: 3 });


utils.initBuffer({ vertices: colors });
utils.linkBuffer({ variable: "aColor", reading: 3 });

utils.initBuffer({ vertices: colors });
utils.linkBuffer({ variable: "aColor", reading: 3 });

utils.initBuffer({ vertices: textureCoordinates });
utils.linkBuffer({ variable: "texCoords", reading: 2 });


utils.initBuffer({ vertices: normals });
utils.linkBuffer({ variable: "aNormal", reading: 3 });


var theta = [0.0, 0.0, 0.0]; 

var rotation_x = 0.0;
var rotation_y = 0.0;
var rotation_z = 0.0;


var translation = [0.0, 0.0, 0.0];

var translation_x = 0.0;
var translation_y = 0.0;
var translation_z = 0.0;



var uScale = 1;
var scale = 0;


var speed = 100;

document.getElementById("slider").onchange = function (event) {
    speed = 100 - event.target.value;
};


document.getElementById("RotationX").onclick = function (event) {
    rotation_x = -rotation_x;
};

document.getElementById("RotationStartX").onclick = function (event) {
    rotation_x = 10;
};

document.getElementById("RotationStopX").onclick = function (event) {
    rotation_x = 0;
};



document.getElementById("RotationY").onclick = function (event) {
    rotation_y = -rotation_y;
};

document.getElementById("RotationStartY").onclick = function (event) {
    rotation_y = 10;
};

document.getElementById("RotationStopY").onclick = function (event) {
    rotation_y = 0;
};



document.getElementById("RotationZ").onclick = function (event) {
    rotation_z = -rotation_z;
};

document.getElementById("RotationStartZ").onclick = function (event) {
    rotation_z = 10;
};

document.getElementById("RotationStopZ").onclick = function (event) {
    rotation_z = 0;
};

document.getElementById("ScaleDirection").onclick = function (event) {
    scale = -scale;
};

document.getElementById("ScaleStart").onclick = function (event) {
    scale = 0.01;
};

document.getElementById("ScaleStop").onclick = function (event) {
    scale = 0;
};


document.getElementById("TranslationX").onclick = function (event) {
    translation_x = -translation_x;
};

document.getElementById("TranslationStartX").onclick = function (event) {
    translation_x = 0.01;
};

document.getElementById("TranslationStopX").onclick = function (event) {
    translation_x = 0;
};



document.getElementById("TranslationY").onclick = function (event) {
    translation_y = -translation_y;
};

document.getElementById("TranslationStartY").onclick = function (event) {
    translation_y = 0.01;
};

document.getElementById("TranslationStopY").onclick = function (event) {
    translation_y = 0;
};


document.getElementById("TranslationZ").onclick = function (event) {
    translation_z = -translation_z;
};

document.getElementById("TranslationStartZ").onclick = function (event) {
    translation_z = 0.01;
};

document.getElementById("TranslationStopZ").onclick = function (event) {
    translation_z = 0;
};


var uAmbientLight = [0.2, 0.2, 0.2]; // Luz ambiente fraca
var uLightColor = [1.0, 1.0, 1.0]; // Luz  branca
var uLightPosition = [1.0, 1.0, -2.0]; // Posição da luz


var uLightDirection = [-uLightPosition[0], -uLightPosition[1], -uLightPosition[2]];


function normalizeVector(vec) {
    var len = Math.sqrt(vec[0] * vec[0] + vec[1] * vec[1] + vec[2] * vec[2]);
    vec[0] /= len;
    vec[1] /= len;
    vec[2] /= len;
}
normalizeVector(uLightDirection);  // Normalizar o vetor de direção


var uCutOff = Math.cos(0);
var uOuterCutOff = Math.cos(Math.PI / 20);


utils.linkUniformVariable({ shaderName: "uAmbientLight", value: uAmbientLight, kind: "3fv" });
utils.linkUniformVariable({ shaderName: "uLightColor", value: uLightColor, kind: "3fv" });
utils.linkUniformVariable({ shaderName: "uLightPosition", value: uLightPosition, kind: "3fv" });

utils.linkUniformVariable({ shaderName: "uLightDirection", value: uLightDirection, kind: "3fv" });
utils.linkUniformVariable({ shaderName: "uCutOff", value: uCutOff, kind: "1f" });
utils.linkUniformVariable({ shaderName: "uOuterCutOff", value: uOuterCutOff, kind: "1f" });


var cameraPosition = { x: 0, y: 0, z: 5 };
var cameraRotation = { pitch: 0, yaw: 0 }; // Pitch Horizontal X, Yaw Vertical Y

document.addEventListener('keydown', function (event) {
    var tSpeed = 0.2; // Velocidade de movimento da câmera
    var rSpeed = 3; // Velocidade de rotação da câmera.
    switch (event.key) {
        case 'w':

            cameraPosition.z -= tSpeed
            break;
        case 'a':

            cameraPosition.x -= tSpeed
            break;
        case 's':

            cameraPosition.z += tSpeed
            break;
        case 'd':

            cameraPosition.x += tSpeed
            break;
        case ' ':
            cameraPosition.y += tSpeed
            break;
        case 'Shift':

            cameraPosition.y -= tSpeed
            break;
        case 'ArrowUp':
            cameraRotation.pitch -= rSpeed
            break;
        case 'ArrowDown':
            cameraRotation.pitch += rSpeed
            break;
        case 'ArrowRight':
            cameraRotation.yaw += rSpeed
            break;
        case 'ArrowLeft':
 
            cameraRotation.yaw -= rSpeed
            break;
    }
    updateViewMatrix();
});

function updateViewMatrix() {
    viewMatrix = mat4.create(); // Cria uma nova matriz 4x4
    var up = vec3.fromValues(0, 1, 0); // Direção 'up' do mundo, geralmente o eixo Y
    var target = vec3.fromValues(cameraPosition.x, cameraPosition.y, cameraPosition.z - 1);
    mat4.lookAt(viewMatrix, [cameraPosition.x, cameraPosition.y, cameraPosition.z], target, up);

    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrix, kind: "4fv"});
    utils.linkUniformVariable({ shaderName: "uPitch", value: cameraRotation.pitch, kind: "1f" })
    utils.linkUniformVariable({ shaderName: "uYaw", value: cameraRotation.yaw, kind: "1f" })
}


var projectionPerspectiveMatrix = mat4.create();

let thetaFOV = Math.PI * .3 //fieldOfViewRadians
let viewPortFOV = 1

mat4.perspective(projectionPerspectiveMatrix,
    thetaFOV,
    viewPortFOV,
    0.1,
    100.0
)

utils.linkUniformMatrix({ shaderName: "uProjectionMatrix", value: projectionPerspectiveMatrix, kind: "4fv" })

var viewMatrix = mat4.create();

mat4.lookAt(
    viewMatrix, 
    [cameraPosition.x, cameraPosition.y, cameraPosition.z], 
    [0, 0, 0], 
    [0, 1, 0]
);


utils.linkUniformMatrix({shaderName: "uViewMatrix", value: viewMatrix, kind: "4fv"})


function render() {

    theta[0] += rotation_x;
    theta[1] += rotation_y;
    theta[2] += rotation_z;

    translation[0] += translation_x;
    translation[1] += translation_y;
    translation[2] += translation_z;

    uScale += scale;


    utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });

    utils.linkUniformVariable({ shaderName: "uTranslation", value: translation, kind: "3fv" });

    utils.linkUniformVariable({ shaderName: "uScale", value: uScale, kind: "1f" });

    utils.drawElements({ method: "TRIANGLES" });

    setTimeout(
        render, speed
    );
}
render();