var PlayerObject = function(idleWalkSpriteSheet, shootingSpriteSheet, shootingAndMovingSpriteSheet){
    const scale = 3;
    return {
    x: 400,
    y: 400,
    radius: 12 * scale, // Raio de colisão, ajustado pela escala
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

    attack: function(angle = 0){
        let proj = new ProjectileObject(projectileSprite, this.x, this.y, angle, player_status.damage);
        let s = new Audio(sound_configuration.shoot_sound);
        s.play();

        // Adiciona propriedades de upgrades ao projétil
        if (player_status.freezing_effect > 0 && player_status.freezing_chance > 0) {
            if (Math.random() <= player_status.freezing_chance / 100) {
                proj.freezing_effect = player_status.freezing_effect;
            }
        }

        if (player_status.has_boomerang_shot) {
            proj.is_boomerang = true;
            proj.origin_x = this.x;
            proj.origin_y = this.y;
            proj.max_distance = 300; // Distância máxima do bumerangue
            proj.state = 'outgoing'; // 'outgoing' ou 'returning'
            proj.piercing_shot = true; // Bumerangues sempre perfuram
        }

        projectiles_list.push(proj);
        this.triggerShootingAnimation();
    },





    renderHitbox(ctx, x, y, radius){
        // Desenha o círculo de colisão do player
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.globalAlpha = 0.2;
        ctx.fill();
        ctx.globalAlpha = 1;
    },



    render: function(ctx, camera){
        ctx.save();

        // Efeito de piscar quando invencível
        if(this.invincibility_time > 0){
            if (Math.floor(this.invincibility_time / 100) % 2 === 0) {
                ctx.globalAlpha = 0.5;
            }
        }

        // Aplicar offset da câmera (mesmo padrão dos outros objetos)
        ctx.translate(-camera.x, -camera.y);

        this.renderHitbox(ctx, this.x, this.y, this.radius);
        
        // Vira o sprite com base na direção da mira
        ctx.translate(this.x, this.y);
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


        // Desenha o sprite do player centralizado
        ctx.drawImage(
            spriteToUse,
            frameX, frameY, // origem x, y
            this.frameWidth, this.frameHeight, // origem largura, altura
            -renderWidth / 2, // desenha centralizado
            -renderHeight / 2,
            renderWidth, renderHeight
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

        // Colisão com o chefe para evitar que o jogador entre nele
        for (let i = 0; i < enemies_list.length; i++) {
            const enemy = enemies_list[i];
            // Verifica se é o chefe e se há colisão
            if (enemy.isBoss && aabbCircleCollision(this, enemy)) {
                // Calcula o ângulo do centro do chefe para o centro do jogador
                const angle = angleBetweenPoints(enemy.x, enemy.y, this.x, this.y);
                // Calcula a sobreposição dos raios
                const overlap = (this.radius + enemy.radius) - dist(this.x, this.y, enemy.x, enemy.y);
                
                // Empurra o jogador para fora da hitbox do chefe na direção do ângulo de colisão
                // Adiciona um pequeno buffer (1 pixel) para evitar que fiquem "presos"
                this.x += Math.cos(angle) * (overlap + 1);
                this.y += Math.sin(angle) * (overlap + 1);
            }
        }

        this.isMoving = (this.x !== oldX || this.y !== oldY);

        // Atualização da animação
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
        if(this.x > scenario.width){
            this.x = scenario.width;
        }
        if(this.y < 0){
            this.y = 0;
        }
        if(this.y > scenario.height){
            this.y = scenario.height;
        }
    }
}
};
