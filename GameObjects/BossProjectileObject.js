function BossProjectileObject(x, y, velocityX, velocityY, damage) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.damage = damage;
    this.radius = 8;
    this.exists = true;
    this.lifespan = 5000; // 5 segundos
    this.age = 0;
    this.color = '#FF0000';
}

BossProjectileObject.prototype.update = function(dt) {
    this.x += this.velocityX * dt;
    this.y += this.velocityY * dt;
    this.age += dt;
    
    // Verificar se saiu da tela
    if (this.x < -50 || this.x > WIDTH + 50 || this.y < -50 || this.y > HEIGHT + 50) {
        this.exists = false;
    }
    
    // Verificar se expirou
    if (this.age >= this.lifespan) {
        this.exists = false;
    }
};

BossProjectileObject.prototype.render = function(ctx, camera) {
    if (!this.exists) return;
    
    var screenX = this.x - camera.x;
    var screenY = this.y - camera.y;
    
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(screenX, screenY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Efeito de brilho
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
};