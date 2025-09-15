var EnemyObject = function(spriteSheet, x, y, health, max_health){
    const scale = 2.5;
    return {
        x: x,
        y: y,
        health: health,
        max_health: max_health,
        radius: 16 * scale, // Raio de colisão
        base_speed: 0.1,
        base_damage: 10,
        alive: true,

        // Propriedades do Sprite
        sprite: spriteSheet,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,

        // Propriedades da Animação
        animationTimer: 0,
        animationSpeed: 150, // ms por frame
        currentFrame: 0,
        frameCount: 4, // 2x2 grid
        numColumns: 2,

        take_damage: function(damage){
            this.health -= damage;
        },
        render: function(ctx){
            ctx.save();

            // Vira o sprite para encarar o jogador
            ctx.translate(this.x, this.y);
            if (player.x < this.x) {
                ctx.scale(-1, 1);
            }

            // Calcula o frame da animação
            const frameX = (this.currentFrame % this.numColumns) * this.frameWidth;
            const frameY = Math.floor(this.currentFrame / this.numColumns) * this.frameHeight;
            const renderWidth = this.frameWidth * this.scale;
            const renderHeight = this.frameHeight * this.scale;

            // Desenha o sprite
            ctx.drawImage(this.sprite, frameX, frameY, this.frameWidth, this.frameHeight, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
            
            ctx.restore(); // Restaura a transformação (translate/scale)

            // Barra de vida (desenhada separadamente para não ser afetada pela escala/virada do sprite)
            ctx.fillStyle = "red";
            ctx.fillRect(this.x - this.radius, this.y - this.radius - 15, this.radius * 2, 10);
            ctx.fillStyle = "green";
            ctx.fillRect(this.x - this.radius, this.y - this.radius - 15, (this.health / this.max_health) * this.radius * 2, 10);
        },
        update: function(dt){
            // Atualiza a animação
            this.animationTimer += dt;
            if (this.animationTimer > this.animationSpeed) {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                this.animationTimer = 0;
            }

            // Move o inimigo em direção ao jogador
            var moveDist = this.base_speed * dt;
            var angle = angleBetweenPoints(this.x, this.y, player.x, player.y);
            this.x += Math.cos(angle) * moveDist;
            this.y += Math.sin(angle) * moveDist;
            if(this.health <= 0){
                this.alive = false;
            }
        },
        respawn: function(){
            this.x = randomIntBetween(0, WIDTH);
            this.y = randomIntBetween(0, HEIGHT);
            this.health = this.max_health;
        }
    }
};