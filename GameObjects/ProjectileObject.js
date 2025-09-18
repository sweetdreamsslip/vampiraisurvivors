var ProjectileObject = function(spriteSheet, x, y, initial_angle, damage) {
    const scale = 2.3;
    return {
        x: x,
        y: y,
        radius: 16 * scale, 
        initial_angle: initial_angle,
        exists: true,
        damage: damage,
        piercing_strength: 0,
        current_pierce_strength: 0,
        freezing_effect: 0,

        // Propriedades do Sprite
        sprite: spriteSheet,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,

        render: function(ctx, camera){
            ctx.save();
            ctx.translate(-camera.x, -camera.y);
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
            if(outOfBounds(this.x, this.y, scenario.width, scenario.height)){
                this.exists = false;
            }else if(this.current_pierce_strength < this.piercing_strength){
                this.exists = false;
            }
        },
    }
};