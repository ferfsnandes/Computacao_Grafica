const VERTEX_SHADER = `#version 300 es
precision mediump float;
in vec2 aPosition;
void main()
{
    gl_PointSize = 10.0;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}`