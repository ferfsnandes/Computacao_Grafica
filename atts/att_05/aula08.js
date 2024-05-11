var sceneSize = 200;
let utils = new Utils({ width: sceneSize * 3, height: sceneSize * 3 });

let vertices = [];
let colors = [];

let drawColors = {
    red: [1, 0, 0],
    white: [1, 1, 1],
    blue: [0, 0, 1],
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

let redStripeHeight = 0.4;
let whiteStripeHeight = 0.1;
let blueStripeHeight = 0.4;

render();

function render() {
    drawStripe("red", 0.5 - redStripeHeight - whiteStripeHeight, redStripeHeight); // Red stripe at the top
    drawStripe("white", 0.5 - whiteStripeHeight, whiteStripeHeight); // White stripe in the middle
    drawStripe("blue", 0.5, blueStripeHeight); // Blue stripe at the bottom

    // window.setTimeout(() => render(), speed)
}

function drawStripe(color, yOffset, stripeHeight) {
    makeRectangle(-0.5, yOffset, 1, stripeHeight, color);
    
    utils.initBuffer({ vertices });
    utils.linkBuffer({ variable: "aPosition", reading: 2 });

    utils.initBuffer({ vertices: colors });
    utils.linkBuffer({ variable: "aColor", reading: 3 });

    utils.linkUniformVariable({shaderName: "resize", value: 1, kind: "1f"}); // No resizing
    utils.linkUniformVariable({shaderName: "theta", value: [0, 0, 0], kind: "3fv"}); // No rotation

    utils.drawElements({ method: "TRIANGLE_STRIP", clear: false });
}

function makeRectangle(x, y, width, height, color) {
    clearVerticesAndColors();
    
    let verticesInfo = [
        [x, y],         // Vertex 1
        [x, y + height],// Vertex 2
        [x + width, y],// Vertex 3
        [x + width, y + height] // Vertex 4
    ];

    verticesInfo.forEach(vertice => {
        vertices.push(...vertice);
        colors.push(...drawColors[color]);
    });
}

function clearVerticesAndColors () {
    vertices = [];
    colors = [];
}