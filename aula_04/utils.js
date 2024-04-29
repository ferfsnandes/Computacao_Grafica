"use strict";

class Utils {

    gl = null;
    program = null;

    width = 400;
    height = 400;
    red = 0.1;
    green = .2;
    blue = .3;
    alpha = .4;


    constructor(width, height, red, green, blue, alpha) {
        var canvas = document.getElementById('canvas');

        canvas.width = width;
        canvas.height = height;

        const maxX = canvas.width, maxY = canvas.height;

        this.gl = canvas.getContext('webgl2');

        this.gl.clearColor(red, green, blue, alpha);

        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
    }

    initBuffer(vertices = [-1, -1, 0, 1, 1, -1]) {
        var bufferId = this.gl.createBuffer();

        this.gl.bindBuffer(
            this.gl.ARRAY_BUFFER,
            bufferId
        );

        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array(vertices),
            this.gl.STATIC_DRAW
        );
    }

    initShader(vertexShader, fragmentShader) {

        var vertShdr = this.gl.createShader(this.gl.VERTEX_SHADER);
        var fragShdr = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(vertShdr, vertexShader);
        this.gl.shaderSource(fragShdr, fragmentShader);
        this.gl.compileShader(vertShdr);
        this.gl.compileShader(fragShdr);

        if (!this.gl.getShaderParameter(vertShdr, this.gl.COMPILE_STATUS)) {
            var msg = "Vertex shader failed to compile.  The error log is:"
                + "<pre>" + this.gl.getShaderInfoLog(vertShdr) + "</pre>";
            alert(msg);
        }

        if (!this.gl.getShaderParameter(fragShdr, this.gl.COMPILE_STATUS)) {
            var msg = "Fragment shader failed to compile.  The error log is:"
                + "<pre>" + this.gl.getShaderInfoLog(fragShdr) + "</pre>";
            alert(msg);
        }

        var program = this.gl.createProgram();
        this.gl.attachShader(program, vertShdr);
        this.gl.attachShader(program, fragShdr);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            var msg = "Shader program failed to link.  The error log is:"
                + "<pre>" + this.gl.getProgramInfoLog(program) + "</pre>";
            alert(msg);
        }
        console.log(program);


        this.gl.useProgram(program);

        this.program = program;

        return this.program;
    }

    linkBuffer(variable = "aPosition", reading = 2) {
        var positionLoc = this.gl.getAttribLocation(this.program, variable);
        this.gl.vertexAttribPointer(positionLoc, reading, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(positionLoc);
    }

    drawElements(size, method = "POINTS", start = 0) {
        this.gl.drawArrays(this.gl[method], start, size);
    }

    convertCoords(x, y) {
        return {
            x: 2 * (x / this.width) - 1,
            y: (-2) * (y / this.height) + 1
        }
    }
}