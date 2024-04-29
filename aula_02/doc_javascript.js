const canvas = window.document.querySelector("#canvas");
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const maxX = canvas.width, maxY = canvas.height;

const gl = initGL(canvas)

clear(gl)

plotPoints(circulo(100, 800), gl)

function convertCoord(x, y) {
    const newX = ((x / maxX) * 2) - 1
    const newY = ((y / maxY) * 2) - 1

    return [newX, newY]
}

function bresenham(x1, y1, x2, y2) {
    let vertices = []

    let Length;

    if (Math.abs(x2 - x1) >= Math.abs(y2 - y1)) {
        Length = Math.abs(x2 - x1)
    } else {
        Length = Math.abs(y2 - y1)
    }

    let x = x1 + .5, y = y1 + .5;
    
    let deltaX = Math.abs(x2 - x1) / Length, deltaY = Math.abs(y2 - y1) / Length;

    let i = 1;

    while(i <= Length) {
        vertices.push(...convertCoord(Math.floor(x), Math.floor(y)))
        x += deltaX;
        y += deltaY;
        i++;
    }
    
    return vertices
}

function circulo(Yc, R) {
    let pts = []
    
    let xi = 0;
    let yi = Yc + R;
    
    let delta_i = 2 * (1 - R)
    let limit = Yc;
    
    let aux = undefined;
    
    while(yi >= limit) {
        pts.push(convertCoord(xi, yi))
        if (delta_i < 0) {
            aux = (2 * delta_i) + (2 * yi) - 1
            if (aux <= 0) {
                let {newX, newY, new_delta_i} = mh(xi, yi, delta_i)
                xi = newX
                yi = newY
                delta_i = new_delta_i 
            } else {
                let {newX, newY, new_delta_i} = md(xi, yi, delta_i)
                xi = newX
                yi = newY
                delta_i = new_delta_i
            }
        } else if (delta_i > 0) {
            aux = (2 * delta_i) - (2 * xi) - 1
            if (aux <= 0) {
                let {newX, newY, new_delta_i} = md(xi, yi, delta_i)
                xi = newX
                yi = newY
                delta_i = new_delta_i
            } else {
                let {newX, newY, new_delta_i} = mv(xi, yi, delta_i)
                xi = newX
                yi = newY
                delta_i = new_delta_i
            }
        } else {
            let {newX, newY, new_delta_i} = md(xi, yi, delta_i)
            xi = newX
            yi = newY
            delta_i = new_delta_i
        }
    }
    return pts
}

function mh(xi, yi, delta_i) {
    let newX = ++xi;
    let newY = yi;
    let new_delta_i = delta_i + (2 * xi) + 1;
    return {newX, newY, new_delta_i}
}

function md(xi, yi, delta_i) {
    let newX = ++xi;
    let newY = --yi;
    let new_delta_i = delta_i + ((2 * xi) - (2 * yi)) + 2;
    return {newX, newY, new_delta_i}
}

function mv(xi, yi, delta_i) {
    let newX = xi;
    let newY = --yi;
    let new_delta_i = delta_i - (2 * yi) + 1;
    return {newX, newY, new_delta_i}
}