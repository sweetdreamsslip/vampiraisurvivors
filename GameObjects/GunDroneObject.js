var GunDroneObject = function(x, y, distance_to_player) {
    const scale = 2.0;
    return {
        x: x,
        y: y,
        exists: true,
        time_since_last_projectile: 0,

        // Propriedades do Sprite
        sprite: gunDroneSprite, // Usando a variável global do sprite do drone
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,

        // Propriedades da Animação
        animationTimer: 0,
        animationSpeed: 150, // ms por frame
        currentFrame: 0,
        frameCount: 5, // 5 frames no total
        numColumns: 3, // 3 colunas na spritesheet

        update: function(dt){
            // Define a posição do drone para ser fixa em relação ao jogador,
            // próximo aos seus "pés".
            const offsetX = 40; // Distância horizontal do centro do jogador
            const offsetY = 25; // Distância vertical (abaixo do centro do jogador)

            // Posiciona o drone no lado oposto da mira para não obstruir a visão.
            // Se o jogador mira para a direita, o drone fica à esquerda, e vice-versa.
            // A condição `angle < PI/2 || angle > 3*PI/2` checa se a mira está na metade direita da tela.
            if (angle_between_player_and_mouse < Math.PI / 2 || angle_between_player_and_mouse > 3 * Math.PI / 2) { // Mira para a direita
                this.x = player.x - offsetX;
            } else { // Mira para a esquerda
                this.x = player.x + offsetX;
            }
            this.y = player.y + offsetY;

            this.time_since_last_projectile += dt;
            if(this.time_since_last_projectile >= player_status.time_between_gun_drone_projectiles){
                // O drone atira na direção da mira do jogador, não na sua própria direção orbital
                projectiles_list.push(new ProjectileObject(projectileSprite, this.x, this.y, angle_between_player_and_mouse, player_status.gun_drone_damage));
                this.time_since_last_projectile = 0;
            }

            // Atualiza a animação
            this.animationTimer += dt;
            if (this.animationTimer > this.animationSpeed) {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                this.animationTimer = 0;
            }
        },
        render: function(ctx, camera){
            ctx.save();
            ctx.translate(-camera.x, -camera.y);
            ctx.translate(this.x, this.y);

            // Vira o sprite para que ele "olhe" na direção da mira.
            // O sprite original (Dogpet.png) olha para a DIREITA por padrão.
            // Por isso, só precisamos inverter o sprite horizontalmente quando a mira está para a ESQUERDA.
            if (angle_between_player_and_mouse > Math.PI / 2 && angle_between_player_and_mouse < 3 * Math.PI / 2) { // Mira para a esquerda
                ctx.scale(-1, 1);
            }

            const frameX = (this.currentFrame % this.numColumns) * this.frameWidth;
            const frameY = Math.floor(this.currentFrame / this.numColumns) * this.frameHeight;
            const renderWidth = this.frameWidth * this.scale;
            const renderHeight = this.frameHeight * this.scale;

            ctx.drawImage(this.sprite, frameX, frameY, this.frameWidth, this.frameHeight, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
            ctx.restore();
        }
    }
};