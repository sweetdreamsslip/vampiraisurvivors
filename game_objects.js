var PlayerObject = function(idleWalkSpriteSheet, shootingSpriteSheet, shootingAndMovingSpriteSheet){
    const scale = 3;
    return {
    x: 400,
    y: 400,
    radius: 16 * scale, // Raio de colisão, ajustado pela escala
    invincibility_time: 0,
    health: player_status.max_health,
    experience: 0,
    level: 1,

    // Propriedades do Sprite
    sprite: idleWalkSpriteSheet,
    frameWidth: 32,
    frameHeight: 32,
    scale: scale,
    
    // Propriedades da Animação
    animationTimer: 0,
    animationSpeed: 200, // milissegundos por frame
    currentFrame: 0,
    frameCount: 2, // 2 colunas para a animação
    isMoving: false,
    currentState: 'idle', // 'idle', 'moving', 'shooting', 'shooting_moving'

    // Propriedades da Animação de Tiro
    shootingSprite: shootingSpriteSheet,
    isShooting: false,
    shootingFrameCount: 6, // 2 colunas, 3 linhas
    shootingNumColumns: 2,
    shootingAnimationSpeed: 50, // ms por frame
    shootingStateTimer: 0,
    shootingStateDuration: 300, // 6 frames * 50ms

    // Propriedades da Animação de Tiro e Corrida
    shootingAndMovingSprite: shootingAndMovingSpriteSheet,
    shootingAndMovingFrameCount: 10,
    shootingAndMovingNumColumns: 3,
    shootingAndMovingAnimationSpeed: 60,

    take_damage: function(damage){
        if(this.invincibility_time <= 0){
            this.health -= damage;
            if(this.health <= 0){
                this.health = 0;
            }
            this.invincibility_time = player_status.invincibility_time;
        }
    },
    gain_experience: function(experience){
        this.experience += experience;
        this.checkLevelUp();
    },
    checkLevelUp: function(){
        var expNeeded = this.level * 100; // Experiência necessária para subir de nível
        if(this.experience >= expNeeded){
            this.level++;
            this.experience -= expNeeded;
            this.levelUp();
        }
    },
    levelUp: function(){
        // Melhorias básicas automáticas ao subir de nível
        player_status.max_health += 20;
        this.health = player_status.max_health; // Cura completamente
        
        // Criar efeito visual de level up
        createParticleExplosion(this.x, this.y, "#FFD700", 30);
        
        // Mostrar notificação de level up
        console.log("Level Up! Agora você está no nível " + this.level);
        
        // Mostrar tela de upgrade com quiz
        triggerUpgradeScreen();
    },
    triggerShootingAnimation: function() {
        this.isShooting = true;
        this.shootingStateTimer = this.shootingStateDuration;
    },
    render: function(ctx){
        ctx.save();
        // Efeito de piscar quando invencível
        if(this.invincibility_time > 0){
            if (Math.floor(this.invincibility_time / 100) % 2 === 0) {
                ctx.globalAlpha = 0.5;
            }
        }

        ctx.translate(this.x, this.y);
        // Vira o sprite com base na direção da mira
        if (angle_between_player_and_mouse < Math.PI / 2 || angle_between_player_and_mouse > 3 * Math.PI / 2) {
            ctx.scale(-1, 1);
        }

        let spriteToUse, frameX, frameY;

        if (this.currentState === 'shooting_moving') {
            spriteToUse = this.shootingAndMovingSprite;
            frameX = (this.currentFrame % this.shootingAndMovingNumColumns) * this.frameWidth;
            frameY = Math.floor(this.currentFrame / this.shootingAndMovingNumColumns) * this.frameHeight;
        } else if (this.currentState === 'shooting') {
            spriteToUse = this.shootingSprite;
            frameX = (this.currentFrame % this.shootingNumColumns) * this.frameWidth;
            frameY = Math.floor(this.currentFrame / this.shootingNumColumns) * this.frameHeight;
        } else {
            spriteToUse = this.sprite; // 'moving' ou 'idle'
            frameX = this.currentFrame * this.frameWidth;
            frameY = 0;
        }

        const renderWidth = this.frameWidth * this.scale;
        const renderHeight = this.frameHeight * this.scale;

        ctx.drawImage(
            spriteToUse,
            frameX, frameY, // origem x, y
            this.frameWidth, this.frameHeight, // origem largura, altura
            -renderWidth / 2, -renderHeight / 2, // destino x, y (centralizado na origem)
            renderWidth, renderHeight // destino largura, altura
        );

        ctx.restore();
    },
    update: function(dt, moveVector = {x: 0, y: 0}){
        //movement
        let oldX = this.x;
        let oldY = this.y;

        if(this.invincibility_time > 0){
            this.invincibility_time -= dt;
        }

        // Prioriza o movimento pelo controle se ele estiver sendo usado
        if (moveVector.x !== 0 || moveVector.y !== 0) {
            this.x += moveVector.x * player_status.speed * dt;
            this.y += moveVector.y * player_status.speed * dt;
        } else { // Caso contrário, usa o teclado
            if(keys_down.includes("w")){
                this.y -= player_status.speed * dt;
            }
            if(keys_down.includes("s")){
                this.y += player_status.speed * dt;
            }
            if(keys_down.includes("a")){
                this.x -= player_status.speed * dt;
            }
            if(keys_down.includes("d")){
                this.x += player_status.speed * dt;
            }
        }

        this.isMoving = (this.x !== oldX || this.y !== oldY);

        // Atualiza o temporizador de estado de tiro
        if (this.isShooting) {
            this.shootingStateTimer -= dt;
            if (this.shootingStateTimer <= 0) {
                this.isShooting = false;
            }
        }

        // Determina o novo estado
        let newState;
        if (this.isShooting && this.isMoving) {
            newState = 'shooting_moving';
        } else if (this.isShooting) {
            newState = 'shooting';
        } else if (this.isMoving) {
            newState = 'moving';
        } else {
            newState = 'idle';
        }

        // Se o estado mudou, reseta a animação
        if (newState !== this.currentState) {
            this.currentState = newState;
            this.currentFrame = 0;
            this.animationTimer = 0;
        }

        // Atualiza a animação com base no estado atual
        this.animationTimer += dt;
        switch (this.currentState) {
            case 'shooting_moving':
                if (this.animationTimer > this.shootingAndMovingAnimationSpeed) {
                    this.currentFrame = (this.currentFrame + 1) % this.shootingAndMovingFrameCount;
                    this.animationTimer = 0;
                }
                break;
            case 'shooting':
                if (this.animationTimer > this.shootingAnimationSpeed) {
                    this.currentFrame = (this.currentFrame + 1) % this.shootingFrameCount;
                    this.animationTimer = 0;
                }
                break;
            case 'moving':
                if (this.animationTimer > this.animationSpeed) {
                    this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                    this.animationTimer = 0;
                }
                break;
            case 'idle':
                this.currentFrame = 0;
                break;
        }

        //boundary check (so player doesn't go off the screen)
        if(this.x < 0){
            this.x = 0;
        }
        if(this.x > WIDTH){
            this.x = WIDTH;
        }
        if(this.y < 0){
            this.y = 0;
        }
        if(this.y > HEIGHT){
            this.y = HEIGHT;
        }
    }
}
};

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

// projectile object
var ProjectileObject = function(spriteSheet, x, y, initial_angle) {
    const scale = 2.3;
    return {
        x: x,
        y: y,
        radius: 16 * scale, 
        initial_angle: initial_angle,
        exists: true,

        // Propriedades do Sprite
        sprite: spriteSheet,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,

        render: function(ctx){
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.initial_angle + Math.PI);

            const renderWidth = this.frameWidth * this.scale;
            const renderHeight = this.frameHeight * this.scale;

            ctx.drawImage(
                this.sprite,
                -renderWidth / 2, -renderHeight / 2, // Centraliza o sprite no destino
                renderWidth, renderHeight
            );
            ctx.restore();
        },
        update: function(dt){
            this.x += Math.cos(this.initial_angle) * player_status.projectile_speed * dt;
            this.y += Math.sin(this.initial_angle) * player_status.projectile_speed * dt;
            if(outOfBounds(this.x, this.y, WIDTH, HEIGHT)){
                this.exists = false;
            }
        },
    }
};

// particle object
var ParticleObject = function(x, y, color, speed, angle, lifespan) {
    return {
        x: x,
        y: y,
        color: color,
        radius: randomIntBetween(1, 3),
        initial_lifespan: lifespan,
        lifespan: lifespan, // in milliseconds
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        update: function(dt) {
            this.x += this.vx * dt;
            this.y += this.vy * dt;
            this.lifespan -= dt;
            // add some friction/drag
            this.vx *= 0.98;
            this.vy *= 0.98;
        },
        render: function(ctx) {
            if (this.lifespan <= 0) return;
            ctx.save();
            // Fade out effect
            ctx.globalAlpha = Math.max(0, this.lifespan / this.initial_lifespan);
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
        }
    };
};

var ExperienceOrbObject = function(spriteSheet, x, y, experience_value) {
    const scale = 1.5;
    return {
        x: x,
        y: y,
        max_speed: 1,
        radius: 16 * scale, // 32/2 * scale
        experience_value: experience_value,
        exists: true,

        // Sprite properties
        sprite: spriteSheet,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,

        render: function(ctx){
            ctx.save();
            ctx.translate(this.x, this.y);

            const renderWidth = this.frameWidth * this.scale;
            const renderHeight = this.frameHeight * this.scale;

            ctx.drawImage(
                this.sprite,
                0, 0, // source x, y
                this.frameWidth, this.frameHeight, // source width, height
                -renderWidth / 2, -renderHeight / 2, // destination x, y (centered)
                renderWidth, renderHeight // destination width, height
            );
            ctx.restore();
        },
        update: function(dt, destination_x, destination_y){
            let dist2 = distSquared(this.x, this.y, destination_x, destination_y);
            let distance_ratio = dist2 / (player_status.magnet_max_distance * player_status.magnet_max_distance);
            if(dist2 <= player_status.magnet_max_distance * player_status.magnet_max_distance){
                let direction = angleBetweenPoints(this.x, this.y, destination_x, destination_y);
                this.x += Math.cos(direction) * this.max_speed * dt * (1-distance_ratio);
                this.y += Math.sin(direction) * this.max_speed * dt * (1-distance_ratio);
            }
        }
    }
};

var GunDroneObject = function(x, y, distance_to_player) {
    return {
        x: x,
        y: y,
        distance_to_player: distance_to_player,
        exists: true,
    }
};