const initGL = (canvas) => {
    return canvas.getContext('webgl2');
}

const clear = (gl) => {
    gl.clearColor(.4, .4, .4, 1)

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
}

const plotPoints = (points, gl) => {
    let bufferId = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points.flat()), gl.STATIC_DRAW)


    let vertShdr = gl.createShader(gl.VERTEX_SHADER);
    let fragShdr = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertShdr, VERTEX_SHADER);
    gl.shaderSource(fragShdr, FRAGMENT_SHADER);
    gl.compileShader(vertShdr);
    gl.compileShader(fragShdr);

    if (!gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS)) {
        var msg = "Vertex shader failed to compile. The error log is: "
    + "<pre>" + gl.getShaderInfoLog(vertShdr) + "</pre>";
        alert(msg);
    }
    if (!gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS)) {
        var msg = "Fragment shader failed to compile. The error log is: "
    + "<pre>" + gl.getShaderInfoLog(fragShdr) + "</pre>";
        alert(msg);
    }

    var program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );
    gl.useProgram(program);
    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var msg = "Shader program failed to link. The error log is:"
+ "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
        alert( msg );
    }

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    gl.drawArrays(gl.POINTS, 0, points.length)
    
}