// FastEnemy - Inimigo rápido e ágil
// Desenvolvido para trabalho em equipe

var FastEnemyObject = function(sprite, x, y, health, damage) {
    const scale = 1.2; // Ligeiramente maior que inimigo normal
    return {
        x: x,
        y: y,
        radius: 12 * scale,
        health: health,
        max_health: health,
        base_damage: damage,
        speed: 2.5, // Muito mais rápido que inimigo normal
        alive: true,
        sprite: sprite,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,
        invincibility_time: 0,
        isBoss: false,
        enemyType: 'fast', // Identificador do tipo
        
        // Propriedades específicas do FastEnemy
        dash_timer: 0,
        dash_cooldown: 3000, // 3 segundos entre dashes
        dash_speed: 5.0, // Velocidade durante o dash
        is_dashing: false,
        dash_duration: 500, // Duração do dash em ms
        dash_direction: { x: 0, y: 0 },
        
        render: function(ctx) {
            if (!this.alive) return;
            
            ctx.save();
            
            // Efeito visual do dash
            if (this.is_dashing) {
                ctx.globalAlpha = 0.7;
                ctx.fillStyle = '#00FFFF';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Sprite do inimigo
            if (this.sprite && this.sprite.complete) {
                ctx.drawImage(
                    this.sprite,
                    0, 0, this.frameWidth, this.frameHeight,
                    this.x - this.radius, this.y - this.radius,
                    this.radius * 2, this.radius * 2
                );
            } else {
                // Fallback: círculo azul claro
                ctx.fillStyle = this.is_dashing ? '#00FFFF' : '#87CEEB';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Barra de vida
            if (this.health < this.max_health) {
                var barWidth = this.radius * 2;
                var barHeight = 4;
                var barY = this.y - this.radius - 8;
                
                // Fundo da barra
                ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.fillRect(this.x - barWidth/2, barY, barWidth, barHeight);
                
                // Vida atual
                var healthPercent = this.health / this.max_health;
                ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
                ctx.fillRect(this.x - barWidth/2, barY, barWidth * healthPercent, barHeight);
            }
            
            ctx.restore();
        },
        
        update: function(dt) {
            if (!this.alive) return;
            
            // Atualizar timer de invencibilidade
            if (this.invincibility_time > 0) {
                this.invincibility_time -= dt;
            }
            
            // Atualizar timer de dash
            this.dash_timer += dt;
            
            // Lógica do dash
            if (this.dash_timer >= this.dash_cooldown && !this.is_dashing) {
                this.startDash();
            }
            
            if (this.is_dashing) {
                this.updateDash(dt);
            } else {
                this.updateNormalMovement(dt);
            }
        },
        
        startDash: function() {
            this.is_dashing = true;
            this.dash_timer = 0;
            
            // Calcular direção do dash (em direção ao jogador)
            if (player) {
                var dx = player.x - this.x;
                var dy = player.y - this.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    this.dash_direction.x = dx / distance;
                    this.dash_direction.y = dy / distance;
                }
            }
        },
        
        updateDash: function(dt) {
            // Mover durante o dash
            this.x += this.dash_direction.x * this.dash_speed * (dt / 16.67);
            this.y += this.dash_direction.y * this.dash_speed * (dt / 16.67);
            
            // Verificar se o dash terminou
            if (this.dash_timer >= this.dash_duration) {
                this.is_dashing = false;
            }
            
            // Manter dentro dos limites da tela
            this.x = Math.max(this.radius, Math.min(WIDTH - this.radius, this.x));
            this.y = Math.max(this.radius, Math.min(HEIGHT - this.radius, this.y));
        },
        
        updateNormalMovement: function(dt) {
            // Movimento normal em direção ao jogador
            if (player) {
                var dx = player.x - this.x;
                var dy = player.y - this.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    var moveX = (dx / distance) * this.speed * (dt / 16.67);
                    var moveY = (dy / distance) * this.speed * (dt / 16.67);
                    
                    this.x += moveX;
                    this.y += moveY;
                }
            }
            
            // Manter dentro dos limites da tela
            this.x = Math.max(this.radius, Math.min(WIDTH - this.radius, this.x));
            this.y = Math.max(this.radius, Math.min(HEIGHT - this.radius, this.y));
        },
        
        take_damage: function(amount) {
            if (this.invincibility_time > 0) return;
            
            this.health -= amount;
            this.invincibility_time = 200; // 200ms de invencibilidade
            
            // Efeito visual de dano
            if (this.health <= 0) {
                this.alive = false;
                // Criar partículas de morte
                createParticleExplosion(this.x, this.y, "#00FFFF", 15);
                
                // Dropar XP
                var xpOrb = new ExperienceOrbObject(xpSprite, this.x, this.y, 15);
                experience_orbs_list.push(xpOrb);
            } else {
                // Efeito visual de dano
                createParticleExplosion(this.x, this.y, "#FF0000", 8);
            }
        }
    };
};

// Função para spawnar FastEnemy
function spawnFastEnemy() {
    if (!player || !game_running) return;
    
    // Spawnar nas bordas da tela
    var side = Math.floor(Math.random() * 4);
    var x, y;
    
    switch(side) {
        case 0: // Topo
            x = Math.random() * WIDTH;
            y = -50;
            break;
        case 1: // Direita
            x = WIDTH + 50;
            y = Math.random() * HEIGHT;
            break;
        case 2: // Baixo
            x = Math.random() * WIDTH;
            y = HEIGHT + 50;
            break;
        case 3: // Esquerda
            x = -50;
            y = Math.random() * HEIGHT;
            break;
    }
    
    // Calcular stats baseado na dificuldade
    var difficulty = current_difficulty || 'normal';
    var health = 15 * (difficulty_modes[difficulty]?.enemy_health_multiplier || 1);
    var damage = 8 * (difficulty_modes[difficulty]?.enemy_damage_multiplier || 1);
    
    var fastEnemy = new FastEnemyObject(enemySprite, x, y, health, damage);
    enemies_list.push(fastEnemy);
}

console.log('FastEnemy carregado!');
