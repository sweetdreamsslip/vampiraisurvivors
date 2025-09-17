var EnemyProjectileObject = function(x, y, angle, projectileSpeed, damage, radius) {
    // Set properties
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = projectileSpeed;
    this.damage = damage;
    this.radius = radius;
    this.exists = true;
};

EnemyProjectileObject.prototype.render = function(ctx, camera) {
    if (!this.exists) return;
    
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    
    // Draw orange circle representing the projectile
    ctx.fillStyle = '#FF8C00'; // Orange color
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Optional: Add a border for better visibility
    ctx.strokeStyle = '#FF6B00'; // Darker orange
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
};

EnemyProjectileObject.prototype.update = function(dt) {
    if (!this.exists) return;
    
    // Move projectile in the specified direction
    this.x += Math.cos(this.angle) * this.speed * dt;
    this.y += Math.sin(this.angle) * this.speed * dt;
    
    // Check if projectile is out of bounds
    if (outOfBounds(this.x, this.y, scenario.width, scenario.height)) {
        this.exists = false;
    }
};
