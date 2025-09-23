//var EnemyObject = function(spriteSheet, x, y, max_health, base_speed, base_damage);
const ENEMY_DEFAULT_SCALE = 2.0;

function NormalBook(x, y){
    let book = new EnemyObject(
        enemySprite, // spriteSheet
        x, // x
        y, // y
        enemy_status.base_health, // max_health
        enemy_status.base_speed, // base_speed
        enemy_status.base_damage // base_damage
    );
    book.enemyType = "normal";

    // Adiciona propriedades de animação
    book.frameWidth = 32;
    book.frameHeight = 32;
    book.numColumns = 2;
    book.frameCount = 4;
    book.animationSpeed = 200; // ms por frame
    book.animationTimer = 0;
    book.currentFrame = 0;
    book.scale = ENEMY_DEFAULT_SCALE;

    // Guarda a função de update original para poder chamá-la
    const baseUpdate = book.update;

    // Sobrescreve o update para adicionar a lógica de animação
    book.update = function(dt) {
        // Chama a lógica original de movimento e comportamento do inimigo
        baseUpdate.call(this, dt);

        // Atualiza o frame da animação
        this.animationTimer += dt;
        if (this.animationTimer > this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.animationTimer = 0;
        }
    };

    // Sobrescreve o render para desenhar o frame correto da spritesheet
    book.render = function(ctx, camera) {
        if (!this.alive) return;

        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        ctx.save();
        ctx.translate(this.x, this.y);
        // Vira o sprite para encarar o jogador
        if (player.x < this.x) {
            ctx.scale(-1, 1);
        }

        // Desenha o frame atual da animação
        if (this.sprite && this.sprite.complete) {
            const frameX = (this.currentFrame % this.numColumns) * this.frameWidth;
            const frameY = Math.floor(this.currentFrame / this.numColumns) * this.frameHeight;
            const renderWidth = this.frameWidth * this.scale;
            const renderHeight = this.frameHeight * this.scale;

            ctx.drawImage(
                this.sprite,
                frameX, frameY, this.frameWidth, this.frameHeight,
                -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight
            );
        }
        ctx.restore();

        // Desenha a barra de vida (lógica similar a outros inimigos)
        if (this.health < this.max_health) {
            var barWidth = this.radius * 2;
            var barHeight = 6;
            var barX = this.x - this.radius;
            var barY = this.y - this.radius - 12;
            ctx.fillStyle = "red";
            ctx.fillRect(barX, barY, barWidth, barHeight);
            ctx.fillStyle = "green";
            ctx.fillRect(barX, barY, (this.health / this.max_health) * barWidth, barHeight);
        }

        ctx.restore();
    };

    return book;
}

function FastBook(x, y){
    let book = new EnemyObject(
        enemySprite, // spriteSheet
        x, // x
        y, // y
        enemy_status.base_health * 0.75, // max_health
        enemy_status.base_speed * 1.5, // base_speed
        enemy_status.base_damage * 0.75 // base_damage
    );
    book.enemyType = "fast";
    return book;
}

var DashEnemy = function(x, y){
    let enemy = new DashEnemyObject(
        dashEnemySprite, 
        x, 
        y, 
        enemy_status.base_health * 0.75, 
        enemy_status.base_speed * 2, 
        enemy_status.base_damage * 0.75,
    );
    return enemy;
}

var FlyingEnemy = function(x, y){
    let enemy = new FlyingEnemyObject(
        flyingEnemySprite, 
        x, 
        y, 
        enemy_status.base_health, 
        enemy_status.base_speed, 
        enemy_status.base_damage,
    );
    // Define as propriedades da spritesheet para animação
    enemy.frameWidth = 32;
    enemy.frameHeight = 32;
    enemy.numColumns = 2;
    enemy.frameCount = 4;
    enemy.animationSpeed = 195; // Velocidade da animação (ms por frame) - 30% mais lento
    enemy.animationTimer = 0;   // Garante que o timer da animação inicie zerado
    enemy.currentFrame = 0;     // Garante que a animação comece do primeiro frame
    return enemy;
}

var TankEnemy = function(x, y){
    let enemy = new TankEnemyObject(
        tankSprite, 
        x, 
        y, 
        enemy_status.base_health, 
        enemy_status.base_speed, 
        enemy_status.base_damage,
    );
    return enemy;
}