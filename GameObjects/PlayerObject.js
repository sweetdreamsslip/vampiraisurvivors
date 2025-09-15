var PlayerObject = function(spriteSheet){
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
    sprite: spriteSheet,
    frameWidth: 32,
    frameHeight: 32,
    scale: scale,
    
    // Propriedades da Animação
    animationTimer: 0,
    animationSpeed: 200, // milissegundos por frame
    currentFrame: 0,
    frameCount: 2, // 2 colunas para a animação
    isMoving: false,
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

        // Calcula qual frame desenhar (usando a primeira linha do spritesheet)
        let frameX = this.currentFrame * this.frameWidth;
        let frameY = 0;

        const renderWidth = this.frameWidth * this.scale;
        const renderHeight = this.frameHeight * this.scale;

        ctx.drawImage(
            this.sprite,
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

        // Atualização da animação
        if (this.isMoving) {
            this.animationTimer += dt;
            if (this.animationTimer > this.animationSpeed) {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                this.animationTimer = 0;
            }
        } else {
            this.currentFrame = 0; // Frame de repouso
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
