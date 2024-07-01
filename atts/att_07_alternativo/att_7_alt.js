
    
    var sceneSize = 200
    let utils = new Utils({ width: sceneSize * 4, height: sceneSize * 3, a: .2 });
    
    
    let rotationXCtrl = new Controls("rotation-x", "Baixo", "Cima")
    let rotationYCtrl = new Controls("rotation-y", "Direita", "Esquerda")
    let rotationZCtrl = new Controls("rotation-z", "Horário", "Anti-Horário")
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
        // 0
        0.0, 0.0, 1.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0, 0.0, 1.0,
    ]
    
    
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
    
    
                            in vec3 aPosition;
                           
                            in vec3 aColor;
                            out vec4 vColor;
    
    
                            uniform float uPitch;
                            uniform float uYaw;
    
    
                            uniform float resize;
                            uniform vec3 theta;
                            uniform float translate;
                       
                            uniform mat4 uViewMatrix;
                            uniform mat4 uProjectionMatrix;
    
    
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
    
    
                                mat4 crx = mat4(1.0,  0.0,  0.0, 0.0,
                                                0.0,  cos(radians(uPitch)),  sin(radians(uPitch)), 0.0,
                                                0.0, -sin(radians(uPitch)),  cos(radians(uPitch)), 0.0,
                                                0.0,  0.0,  0.0, 1.0);
    
    
                                mat4 cry = mat4(cos(radians(uYaw)), 0.0, -sin(radians(uYaw)), 0.0,
                                                0.0, 1.0,  0.0, 0.0,
                                                sin(radians(uYaw)), 0.0,  cos(radians(uYaw)), 0.0,
                                                0.0, 0.0,  0.0, 1.0);
    
    
                                gl_PointSize = 10.0;
                                gl_Position = uProjectionMatrix * uViewMatrix * rx * ry * rz * vec4(aPosition, 1.0);
                                gl_Position.x = (gl_Position.x * resize) + translate;
                                gl_Position.y = (gl_Position.y * resize) + translate;
                                vColor = vec4(aColor, 1.0);
                                textureCoords = texCoords;
                            }`,
    
    
                            fragmentShader : `#version 300 es
                            precision highp float;
                            
                            in vec2 textureCoords;
                            
                            uniform sampler2D uSampler;
                            uniform vec2 uTextureSize;
                            
                            uniform float uKernel[9];
                            
                            out vec4 fColor;
                            
                            void main(){
                                vec2 onePixel = vec2(1.0, 1.0) / uTextureSize;
                            
                                vec4 soma = texture(uSampler, textureCoords + onePixel * vec2(-1,-1)) * uKernel[0] + 
                                texture(uSampler, textureCoords + onePixel * vec2(-1,0)) * uKernel[1] + 
                                texture(uSampler, textureCoords + onePixel * vec2(-1,1)) * uKernel[2] + 
                                texture(uSampler, textureCoords + onePixel * vec2(0,-1)) * uKernel[3] + 
                                texture(uSampler, textureCoords + onePixel * vec2(0,0)) * uKernel[4] + 
                                texture(uSampler, textureCoords + onePixel * vec2(0,1)) * uKernel[5] + 
                                texture(uSampler, textureCoords + onePixel * vec2(1,-1)) * uKernel[6] + 
                                texture(uSampler, textureCoords + onePixel * vec2(1,0)) * uKernel[7] + 
                                texture(uSampler, textureCoords + onePixel * vec2(1,1)) * uKernel[8];
                            
                                fColor = soma;
                            
                                fColor.a = 1.0;
                            }`
                          
    });
    
    
    let theta = [0, 0, 0]
    let size = 1;
    let translate_x_y = 0;
    let speed = 25;
    let kernel = [ 0, 0, 0,
        0, 1, 0,
        0, 0, 0];

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case '0':
          kernel = [
            0, 0, 0,
            0, 1, 0,
            0, 0, 0
          ];
          break;
        case '1':
          kernel = [
            1/8, 1/8, 1/8,
            1/8, 0,   1/8,
            1/8, 1/8, 1/8
          ];
          break;
        case '2':
          kernel = [
            -1, -1, -1,
            -1,  8, -1,
            -1, -1, -1
          ];
          break;
        case '3':
          kernel = [
            0,  -1,  0,
            -1,  5, -1,
            0,  -1,  0
          ];
          break;
        default:
      }
    });

    var cameraPosition = { x: 0, y: 0, z: 5 };
    var cameraRotation = { pitch: 0, yaw: 0 }; // Pitch Horizontal X, Yaw Vertical Y
    
    
    document.addEventListener('keydown', function (event) {
        var tSpeed = 0.2; // Velocidade de movimento da câmera
        var rSpeed = 3; // Velocidade de rotação da câmera.
        switch (event.key) {
            case 'w':
                cameraPosition.z -= tSpeed
                break;
            case 'd':
                cameraPosition.x -= tSpeed
                break;
            case 's':
                cameraPosition.z += tSpeed
                break;
            case 'a':
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
            case 'ArrowLeft':
                cameraRotation.yaw += rSpeed
                break;
            case 'ArrowRight':
                cameraRotation.yaw -= rSpeed
                break;
        }
        updateViewMatrix();
    });
    
    
    function updateViewMatrix() {
        var up = vec3.fromValues(0, 1, 0); // Direção 'up' do mundo, geralmente o eixo Y
        var target = vec3.fromValues(
            cameraPosition.x + Math.sin(cameraRotation.yaw * Math.PI / 180),
            cameraPosition.y + Math.sin(cameraRotation.pitch * Math.PI / 180),
            cameraPosition.z - Math.cos(cameraRotation.yaw * Math.PI / 180)
        );
        mat4.lookAt(viewMatrix, [cameraPosition.x, cameraPosition.y, cameraPosition.z], target, up);
       
        utils.linkUniformMatrix({ shaderName: "uViewMatrix", value: viewMatrix, kind: "4fv"});
        utils.linkUniformVariable({ shaderName: "uPitch", value: cameraRotation.pitch, kind: "1f" });
        utils.linkUniformVariable({ shaderName: "uYaw", value: cameraRotation.yaw, kind: "1f" });
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
    
    
    
    
    // Inicializa e ativa cada textura individualmente
    let texture1 = initAndActivateTexture("texturas/Kendrick.jpg", 0); // Textura 0
    let texture2 = initAndActivateTexture("texturas/LikeThat.jpg", 1); // Textura 1
    let texture3 = initAndActivateTexture("texturas/Euphoria.jpg", 2); // Textura 2
    let texture4 = initAndActivateTexture("texturas/6_16inLA.jpg", 3); // Textura 3
    let texture5 = initAndActivateTexture("texturas/MeetTheGrahams.jpg", 4); // Textura 4
    let texture6 = initAndActivateTexture("texturas/NotLikeUs.jpg", 5); // Textura 5
    
    
    utils.initBuffer({ vertices: textureCoordinates });
    utils.linkBuffer({ variable: "texCoords", reading: 2 });
    
    
    render()
    
    
    function render() {
        theta[0] += rotationXCtrl.currValue;
        theta[1] += rotationYCtrl.currValue;
        theta[2] += rotationZCtrl.currValue;
        size += scaleCtrl.currValue;
        translate_x_y += translationCtrl.currValue;
        utils.linkUniformVariable({shaderName: "uKernel", value: kernel, kind: "1fv"})
    
    
        //  Face da Frente: Damn
        drawFace([2, 6, 7, 3], { theta: theta, resize: size, translation: translate_x_y, clear: true, cor: "azul", uSamplerID: 0 });
    
    
        // Face da Esquerda: Like That
        drawFace([0, 1, 2, 3], { theta: theta, resize: size, translation: translate_x_y, clear: false, cor: "branco", uSamplerID: 1 });
    
    
        // Face da Direita: Euphoria
        drawFace([6, 5, 4, 7], { theta: theta, resize: size, translation: translate_x_y, clear: false, cor: "amarelo", uSamplerID: 2 });
    
    
        // Face de Tras: 6:16 in LA
        drawFace([4, 5, 1, 0], { theta: theta, resize: size, translation: translate_x_y, clear: false, cor: "vermelho", uSamplerID: 3 });
    
    
        // Face de Cima: Meet The grahamns
        drawFace([5, 6, 2, 1], { theta: theta, resize: size, translation: translate_x_y, clear: false, cor: "verde", uSamplerID: 4 });
    
    
        // face de Baixo: Not Like Us
        drawFace([3, 7, 4, 0], { theta: theta, resize: size, translation: translate_x_y, clear: false, cor: "preto", uSamplerID: 5 });
    
    
        window.setTimeout(() => render(), speed)
    }
    
    
    function drawFace(vertices_info, { theta = [0, 0, 0], resize = 1, translation = 0, method = "TRIANGLES", clear = false, reading = 3, uSamplerID = 0, cor = "preto" }) {
    
    
        makeFace(...vertices_info, cor);
    
    
        utils.initBuffer({ vertices });
        utils.linkBuffer({ variable: "aPosition", reading: reading });
    
    
        utils.initBuffer({ vertices: colors });
        utils.linkBuffer({ variable: "aColor", reading: 3 });
    
    
        utils.linkUniformVariable({ shaderName: "resize", value: resize, kind: "1f" })
        utils.linkUniformVariable({ shaderName: "theta", value: theta, kind: "3fv" })
        utils.linkUniformVariable({ shaderName: "translate", value: translation, kind: "1f" })
    
    
        utils.linkUniformVariable({ shaderName: "uSampler", value: uSamplerID, kind: "1i" })
        utils.linkUniformVariable({shaderName: "uKernel", value: kernel, kind: "1fv"})
    
    
        utils.drawElements({ method: method, clear })
    }
    
    
    // Funcão que inicializa e ativa uma textura individualmente
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
    
    
    function makeFace(v1, v2, v3, v4, cor) {
        clearVerticesAndColors()
    
    
        let triangulos = [];
    
    
        triangulos.push(v1, v2, v3);
        triangulos.push(v1, v3, v4);
    
    
        triangulos.forEach(vertice => {
            vertices.push(...cubeVertices[vertice]);
            colors.push(...drawColors[cor]);
        })
        console.log(vertices)
    }
    
    
    function clearVerticesAndColors() {
        vertices = []
        colors = []
    }
