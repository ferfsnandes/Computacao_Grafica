var sceneSize = 430
let utils = new Utils({ width: sceneSize * 3, height: sceneSize * 2, a: 0.0});

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

let textureCoordinates = [
    // Front face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Top face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Side face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Back face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    // Bottom face
    0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0, 0.0, 1.0
];


function makeFace(v1, v2, v3, v4) {
    let triangulos = [];

    triangulos.push(v1, v2, v3);
    triangulos.push(v1, v3, v4);

    triangulos.forEach(vertice => { vertices.push(...cubeVertices[vertice]) })
}

makeFace(0, 1, 2, 3)
makeFace(2, 6, 7, 3)
makeFace(3, 7, 4, 0)
makeFace(4, 5, 1, 0)
makeFace(5, 6, 2, 1)
makeFace(6, 5, 4, 7)



utils.initShader({
    vertexShader: `#version 300 es
                    precision mediump float;
                    
                    in vec3 aPosition;
                    uniform vec3 theta;
                    uniform mat4 uViewMatrix; // Matriz da câmera
                    uniform mat4 uProjectionMatrix; // Matriz de projeção
                    uniform mat4 uProjectionMatrixPersp; // Matriz da perspectiva

                    in vec2 texCoords;
                    out vec2 textureCoords;

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

                        gl_Position = uProjectionMatrix * uViewMatrix * rz * ry * rx *
                        vec4(aPosition, 1.0);
                        textureCoords = texCoords;
                    }`,
    fragmentShader: `#version 300 es
                    precision highp float;

                    in vec2 textureCoords;
                    uniform sampler2D uSampler;

                    out vec4 fColor;

                    void main(){
                        fColor = texture(uSampler, textureCoords);
                    }`
                    
});

utils.initBuffer({ vertices });
utils.linkBuffer({ variable: "aPosition", reading: 3 });
utils.initBuffer({ vertices: textureCoordinates });
utils.linkBuffer({ variable: "texCoords", reading: 2 });

switch ("ortho") {
    case "ortho":
        let projectionOrthoMatrix = mat4.create();

        let size = 1; 
        let centerX = 0; 
        let centerY = 0; 
        
        mat4.ortho(projectionOrthoMatrix,
            centerX - size, // esquerda
            centerX + size, // direta
            centerY - size, // baixo
            centerY + size, // cima
            0.1, // Quão perto objetos podem estar da câmera antes de serem recortados
            100.0); // Quão longe objetos podem estar da câmera antes de serem recortados
        
        utils.linkUniformMatrix({
            shaderName: "uProjectionMatrix",
            value: projectionOrthoMatrix,
            kind: "4fv"
        });

        break;
    case "persp":
        var projectionPerspMatrix = mat4.create();
        let thetaFOV = Math.PI * .3 //fieldOfViewRadians
        let viewPortFOV = 1

        mat4.perspective(projectionPerspMatrix,
            thetaFOV,
            viewPortFOV,
            0.1,
            100.0
        )

        utils.linkUniformMatrix({ shaderName: "uProjectionMatrix", value: projectionPerspMatrix, kind: "4fv" })

        break;
}

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

let textures = [
    startupTexture('texturas/TheCollegeDropout.jpg'),      
    startupTexture('texturas/LateRegistration.jpg'),             
    startupTexture('texturas/Graduation.jpg'),            
    startupTexture('texturas/MBDTF.jpg'),    
    startupTexture('texturas/TheLifeOfPablo.jpg'),  
    startupTexture('texturas/Vultures.jpg')         
];

activateTextures(textures)

let theta = [0, 0, 0]

let transform_x = 1, transform_y = 1, transform_z = 1;

let speed = 15;

render();

function render() {
    theta[0] += transform_x;
    theta[1] += transform_y;
    theta[2] += transform_z;

    utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" });
    
    utils.linkUniformVariable({shaderName:"uSampler", value:0, kind:"1i"})
    
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixFront, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: 0, y: 0, width: sceneSize, height: sceneSize } });

    utils.linkUniformVariable({shaderName:"uSampler", value:1, kind:"1i"})

    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixTop, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize, y: 0, width: sceneSize, height: sceneSize } });

    utils.linkUniformVariable({shaderName:"uSampler", value:2, kind:"1i"})

    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixSide, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize * 2, y: 0, width: sceneSize, height: sceneSize } });

    utils.linkUniformVariable({shaderName:"uSampler", value:3, kind:"1i"});
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixFrontSide, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: 0, y: sceneSize, width: sceneSize, height: sceneSize } });
    
    utils.linkUniformVariable({shaderName:"uSampler", value:4, kind:"1i"})
    
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixIsometric, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize, y: sceneSize, width: sceneSize, height: sceneSize } });
    
    utils.linkUniformVariable({shaderName:"uSampler", value:5, kind:"1i"})
    
    utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrixIsometric2, kind: "4fv" });
    utils.drawScene({ method: "TRIANGLES", viewport: { x: sceneSize * 2, y: sceneSize, width: sceneSize, height: sceneSize } });

    window.setTimeout(render, speed);
}

function activateTextures(textures) {
    let gl = utils.gl;  
    textures.forEach((tex, idx) => {
        gl.activeTexture(gl[`TEXTURE${idx}`])
        gl.bindTexture(gl.TEXTURE_2D, tex)
    })
}

function startupTexture(src) {
    let gl = utils.gl;
    let texture = gl.createTexture();
    var img = new Image();
    img.onload = function () {
      
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    }
    img.src = src;
    return texture;
}