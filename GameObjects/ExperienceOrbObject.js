var ExperienceOrbObject = function(sprite, x, y, experience_value) {
    // Fase inicial aleatória para a animação de flutuação, para que os orbes não se movam em sincronia
    let floatPhase = Math.random() * Math.PI * 2;
    const floatSpeed = 0.004;
    const floatAmplitude = 4; // A distância que o orbe se moverá para cima e para baixo

    return {
        x: x,
        y: y,
        baseY: y, // A posição Y central em torno da qual o orbe flutua
        radius: 32,
        experience_value: experience_value,
        exists: true,
        sprite: sprite,
        speed: 0.2, // Velocidade de movimento em direção ao jogador
        attraction_radius: 150, // A distância em que o jogador começa a atrair o orbe
        attraction_speed_multiplier: 1,

        update: function(dt, playerX, playerY) {
            if (!this.exists) return;

            let dx = playerX - this.x;
            let dy = playerY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Verifica se o jogador está dentro do raio de atração
            if (distance < this.attraction_radius) {
                // O jogador está perto, então o orbe se move em direção a ele.
                // A velocidade aumenta à medida que o jogador se aproxima.
                this.attraction_speed_multiplier = 1 + (1 - distance / this.attraction_radius) * 5;
                let move_dist = this.speed * this.attraction_speed_multiplier * dt;
                
                this.x += (dx / distance) * move_dist;
                this.y += (dy / distance) * move_dist;
                
                // Atualiza a posição base de flutuação para a posição Y atual.
                // Se o jogador se afastar, o orbe começará a flutuar a partir deste novo ponto.
                this.baseY = this.y;

            } else {
                // O jogador está longe, então o orbe flutua no lugar.
                this.attraction_speed_multiplier = 1;
                floatPhase += floatSpeed * dt; // Avança a animação de flutuação
                
                // Calcula a nova posição Y usando uma onda senoidal para um movimento suave.
                this.y = this.baseY + Math.sin(floatPhase) * floatAmplitude;
            }
        },

        render: function(ctx, camera) {
            if (!this.exists) return;
            
            const renderX = this.x - camera.x;
            const renderY = this.y - camera.y;
            
            // Efeito de sombra projetada para baixo
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            // A sombra é desenhada como uma elipse abaixo do orbe.
            // A posição Y da sombra é deslocada para baixo pelo raio do orbe.
            ctx.ellipse(renderX, renderY + this.radius, this.radius * 0.45, this.radius * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Desenha o sprite do orbe na sua posição atualizada
            if (this.sprite && this.sprite.complete) {
                ctx.drawImage(
                    this.sprite, 
                    renderX - this.radius, 
                    renderY - this.radius, 
                    this.radius * 2, 
                    this.radius * 2
                );
            }
        }
    };
};