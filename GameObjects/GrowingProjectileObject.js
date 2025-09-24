var GrowingProjectileObject = function(sprite, x, y, angle, damage) {
    const initialScale = 0.2;
    const maxScale = 1.5;
    const growthRate = 0.002; // Aumento da escala por milissegundo
    const baseRadius = 16; // Raio base para colisão, assumindo sprite 32x32

    return {
        x: x,
        y: y,
        radius: baseRadius * initialScale,
        speed: player_status.projectile_speed || 0.5, // Usa a velocidade do status do jogador ou um padrão
        angle: angle,
        damage: damage || player_status.damage,
        exists: true,
        sprite: sprite,
        piercing_strength: 1,
        current_pierce_strength: this.piercing_strength,
        // Propriedades de crescimento
        currentScale: initialScale,

        update: function(dt){
            // Aumenta a escala do projétil ao longo do tempo
            if (this.currentScale < maxScale) {
                this.currentScale += growthRate * dt;
                if (this.currentScale > maxScale) {
                    this.currentScale = maxScale;
                }
            }

            // Atualiza o raio de colisão com base na escala atual
            this.radius = baseRadius * this.currentScale;

            // Movimento do projétil
            var move_dist = this.speed * dt;
            this.x += Math.cos(this.angle) * move_dist;
            this.y += Math.sin(this.angle) * move_dist;

            // Verificação de limites do cenário
            if(this.x < 0 || this.x > scenario.width || this.y < 0 || this.y > scenario.height){
                this.exists = false;
            }
        },

        hit: function(){
            this.current_pierce_strength--;
            if(this.current_pierce_strength < 0){
                this.exists = false;
            }
        },
        render: function(ctx, camera){
            if(!this.exists) return;
            
            ctx.save();
            ctx.translate(this.x - camera.x, this.y - camera.y);
            // Rotaciona o projétil para que ele aponte na direção do movimento.
            ctx.rotate(this.angle);
            
            const renderWidth = this.sprite.width * this.currentScale;
            const renderHeight = this.sprite.height * this.currentScale;

            ctx.drawImage(this.sprite, -renderWidth / 2, -renderHeight / 2, renderWidth, renderHeight);
            ctx.restore();
        }
    }
};