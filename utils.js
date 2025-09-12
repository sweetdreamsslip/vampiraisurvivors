function dist(x1, y1, x2, y2) {
    return Math.sqrt(distSquared(x1, y1, x2, y2));
}

function distSquared(x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return dx * dx + dy * dy;
}

function aabb(x1, y1, w1, h1, x2, y2, w2, h2) {
    return (
        x1 < x2 + w2 &&
        x1 + w1 > x2 &&
        y1 < y2 + h2 &&
        y1 + h1 > y2
    );
}

function aabbCircleCollision(circle1, circle2) {
    return distSquared(circle1.x, circle1.y, circle2.x, circle2.y) <= (circle1.radius + circle2.radius) * (circle1.radius + circle2.radius);
}

function pointInCircle(px, py, circle) {
    const dx = px - circle.x;
    const dy = py - circle.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function randomIntBetween(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

function angleBetweenPoints(x1, y1, x2, y2) {
    var angle = Math.atan2(y2 - y1, x2 - x1);
    if (angle < 0) {
        angle += 2 * Math.PI;
    }
    return angle;
}

function outOfBounds(x, y, maxWidth, maxHeight) {
    return x < 0 || x > maxWidth || y < 0 || y > maxHeight;
}

