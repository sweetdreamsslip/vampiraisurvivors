var EnemyObject = function(spriteSheet, x, y, max_health, move_speed, base_damage){
    const scale = 2.5;
    
    // Set properties on this object
    this.x = x;
    this.y = y;
    this.health = max_health;
    this.max_health = max_health;
    this.radius = 10* scale; // Raio de colisão
    this.speed = move_speed;
    this.base_damage = base_damage;
    this.alive = true;
    this.isBoss = false;
    this.enemyType = 'normal';
    this.freeze_timer = 0;
    // Propriedades do Sprite
    this.sprite = spriteSheet;
    this.frameWidth = 32;
    this.frameHeight = 32;
    this.scale = scale;

    // Propriedades da Animação
    this.animationTimer = 0;
    this.animationSpeed = 150; // ms por frame
    this.currentFrame = 0;
    this.frameCount = 4; // 2x2 grid
    this.numColumns = 2;
};

EnemyObject.prototype.take_damage = function(damage){
    this.health -= damage;
};

EnemyObject.prototype.distanceToPoint = function(x, y){
    return dist(this.x, this.y, x, y);
};

EnemyObject.prototype.render = function(ctx, camera){
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    // Vira o sprite para encarar o jogador
    ctx.translate(this.x, this.y);
    if (player.x < this.x) {
        ctx.scale(-1, 1);
    }

    ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();



    // Calcula o frame da animação
    const frameX = (this.currentFrame % this.numColumns) * this.frameWidth;
    const frameY = Math.floor(this.currentFrame / this.numColumns) * this.frameHeight;
    const renderWidth = this.frameWidth * this.scale;
    const renderHeight = this.frameHeight * this.scale;

    // Desenha o sprite
    ctx.drawImage(this.sprite, frameX, frameY, this.frameWidth, this.frameHeight, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
    ctx.restore(); // Restaura a transformação (translate/scale)
    
    ctx.save();
    ctx.translate(-camera.x, -camera.y);
    // Barra de vida (desenhada separadamente para não ser afetada pela escala/virada do sprite)
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - this.radius, this.y - this.radius - 15, this.radius * 2, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x - this.radius, this.y - this.radius - 15, (this.health / this.max_health) * this.radius * 2, 10);
    ctx.restore();
};

EnemyObject.prototype.update = function(dt){
    if(this.health <= 0){
        this.alive = false;
        return;
    }

    if (this.freeze_timer > 0) {
        this.freeze_timer -= dt;
        if (this.freeze_timer <= 0) {
            this.freeze_timer = 0;
        }
        return; // Pula o resto da atualização se estiver congelado
    }
    // Atualiza a animação
    this.animationTimer += dt;
    if (this.animationTimer > this.animationSpeed) {
        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        this.animationTimer = 0;
    }

    this.moveTowardsPlayer(dt, this.speed);

};

EnemyObject.prototype.moveTowardsPlayer = function(dt, speed){
    var moveDist = speed * dt;
    var angle = angleBetweenPoints(this.x, this.y, player.x, player.y);
    this.x += Math.cos(angle) * moveDist;
    this.y += Math.sin(angle) * moveDist;
};

EnemyObject.prototype.moveTowardsPoint = function(dt, speed, x, y){
    var moveDist = speed * dt;
    var angle = angleBetweenPoints(this.x, this.y, x, y);
    this.x += Math.cos(angle) * moveDist;
    this.y += Math.sin(angle) * moveDist;
};