var ProjectileObject = function(spriteSheet, x, y, initial_angle, damage) {
    const scale = 2.3;
    return {
        x: x,
        y: y,
        radius: 16 * scale, 
        initial_angle: initial_angle,
        exists: true,
        damage: damage,
        piercing_strength: player_status.piercing_strength,
        current_pierce_strength: player_status.piercing_strength,
        attackSound_source: new Audio(sound_configuration.attack_sound),
        hitted_enemies: [],
        
        /*
            Projéteis especiais
        */
        freezing_effect: player_status.freezing_effect,
        explosive: false,
        is_boomerang: player_status.has_boomerang_shot,
        is_returning: false,
        origin_x: x,
        origin_y: y,
        max_distance: player_status.boomerang_max_distance,

        // Propriedades do Sprite
        sprite: spriteSheet,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,

        playSound: function() {
            let s = new Audio(sound_configuration.attack_sound);
            s.play();
        },
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
            if(this.is_boomerang){
                this.boomerang_move(dt);
            } else {
                this.normal_move(dt);
                if(outOfBounds(this.x, this.y, scenario.width, scenario.height)){
                    this.exists = false;
                }
            }
            if(this.current_pierce_strength < this.piercing_strength){
                this.playSound();
                this.exists = false;
            }
        },
        normal_move: function(dt){
            this.x += Math.cos(this.initial_angle) * player_status.projectile_speed * dt;
            this.y += Math.sin(this.initial_angle) * player_status.projectile_speed * dt;
        },
        boomerang_move: function(dt){
            if (!this.is_returning) {
                this.normal_move(dt); // Movimento normal de ida
                
                // Verifica se atingiu a distância máxima
                const distance_from_origin_squared = distSquared(this.x, this.y, this.origin_x, this.origin_y);
                // Quando atinge a distância máxima, começa a retornar
                if (distance_from_origin_squared >= this.max_distance * this.max_distance) {
                    this.is_returning = true;
                }
            } else if (this.is_returning) {
                // Move de volta para o jogador
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const distance_to_player_squared = dx * dx + dy * dy;
    
                if (distance_to_player_squared < this.radius*this.radius + player.radius*player.radius) {
                    this.exists = false; // Desaparece ao tocar no jogador
                } else {
                    const move_dist = player_status.projectile_speed * dt;
                    this.x += (dx / Math.sqrt(distance_to_player_squared)) * move_dist;
                    this.y += (dy / Math.sqrt(distance_to_player_squared)) * move_dist;
                }
            }
        },
        hit: function(){
            this.current_pierce_strength--;
            if(this.current_pierce_strength < 0){
                this.exists = false;
            }
        }
    }
};