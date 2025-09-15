// ShootingEnemy - Inimigo que atira projéteis
// Desenvolvido para trabalho em equipe

var ShootingEnemyObject = function(sprite, x, y, health, damage) {
    const scale = 1.5; // Maior que inimigo normal
    return {
        x: x,
        y: y,
        radius: 15 * scale,
        health: health,
        max_health: health,
        base_damage: damage,
        speed: 0.8, // Mais lento que inimigo normal
        alive: true,
        sprite: sprite,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,
        invincibility_time: 0,
        isBoss: false,
        enemyType: 'shooting', // Identificador do tipo
        
        // Propriedades específicas do ShootingEnemy
        shoot_timer: 0,
        shoot_interval: 2000, // Atira a cada 2 segundos
        projectile_speed: 3.0,
        projectile_damage: 12,
        projectile_radius: 4,
        max_range: 300, // Distância máxima para atirar
        min_range: 80, // Distância mínima para atirar
        
        render: function(ctx) {
            if (!this.alive) return;
            
            ctx.save();
            
            // Efeito visual de carregamento
            if (this.shoot_timer > this.shoot_interval * 0.8) {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#FF4500';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
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
                // Fallback: círculo laranja
                ctx.fillStyle = '#FF4500';
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
            
            // Atualizar timer de tiro
            this.shoot_timer += dt;
            
            if (player) {
                var dx = player.x - this.x;
                var dy = player.y - this.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                // Se está na distância de tiro, atirar
                if (distance <= this.max_range && distance >= this.min_range && this.shoot_timer >= this.shoot_interval) {
                    this.shoot();
                }
                
                // Movimento: manter distância ideal
                if (distance > this.max_range) {
                    // Mover para perto do jogador
                    this.moveTowardsPlayer(dt, dx, dy, distance);
                } else if (distance < this.min_range) {
                    // Mover para longe do jogador
                    this.moveAwayFromPlayer(dt, dx, dy, distance);
                }
            }
        },
        
        moveTowardsPlayer: function(dt, dx, dy, distance) {
            var moveX = (dx / distance) * this.speed * (dt / 16.67);
            var moveY = (dy / distance) * this.speed * (dt / 16.67);
            
            this.x += moveX;
            this.y += moveY;
            
            // Manter dentro dos limites da tela
            this.x = Math.max(this.radius, Math.min(WIDTH - this.radius, this.x));
            this.y = Math.max(this.radius, Math.min(HEIGHT - this.radius, this.y));
        },
        
        moveAwayFromPlayer: function(dt, dx, dy, distance) {
            var moveX = -(dx / distance) * this.speed * (dt / 16.67);
            var moveY = -(dy / distance) * this.speed * (dt / 16.67);
            
            this.x += moveX;
            this.y += moveY;
            
            // Manter dentro dos limites da tela
            this.x = Math.max(this.radius, Math.min(WIDTH - this.radius, this.x));
            this.y = Math.max(this.radius, Math.min(HEIGHT - this.radius, this.y));
        },
        
        shoot: function() {
            if (!player) return;
            
            this.shoot_timer = 0;
            
            // Calcular direção do tiro
            var dx = player.x - this.x;
            var dy = player.y - this.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                var angle = Math.atan2(dy, dx);
                
                // Criar projétil do inimigo
                var projectile = new EnemyProjectileObject(
                    this.x, this.y, 
                    Math.cos(angle) * this.projectile_speed,
                    Math.sin(angle) * this.projectile_speed,
                    this.projectile_damage,
                    this.projectile_radius
                );
                
                enemy_projectiles_list.push(projectile);
                
                // Efeito visual do tiro
                createParticleExplosion(this.x, this.y, "#FF4500", 5);
            }
        },
        
        take_damage: function(amount) {
            if (this.invincibility_time > 0) return;
            
            this.health -= amount;
            this.invincibility_time = 200; // 200ms de invencibilidade
            
            // Efeito visual de dano
            if (this.health <= 0) {
                this.alive = false;
                // Criar partículas de morte
                createParticleExplosion(this.x, this.y, "#FF4500", 20);
                
                // Dropar XP
                var xpOrb = new ExperienceOrbObject(xpSprite, this.x, this.y, 20);
                experience_orbs_list.push(xpOrb);
            } else {
                // Efeito visual de dano
                createParticleExplosion(this.x, this.y, "#FF0000", 8);
            }
        }
    };
};

// Classe para projéteis do inimigo
var EnemyProjectileObject = function(x, y, vx, vy, damage, radius) {
    return {
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        damage: damage,
        radius: radius,
        alive: true,
        
        render: function(ctx) {
            if (!this.alive) return;
            
            ctx.save();
            ctx.fillStyle = '#FF4500';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Efeito de rastro
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#FF6347';
            ctx.beginPath();
            ctx.arc(this.x - this.vx * 2, this.y - this.vy * 2, this.radius * 0.7, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.restore();
        },
        
        update: function(dt) {
            if (!this.alive) return;
            
            this.x += this.vx * (dt / 16.67);
            this.y += this.vy * (dt / 16.67);
            
            // Remover se sair da tela
            if (this.x < -50 || this.x > WIDTH + 50 || this.y < -50 || this.y > HEIGHT + 50) {
                this.alive = false;
            }
        }
    };
};

// Função para spawnar ShootingEnemy
function spawnShootingEnemy() {
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
    var health = 25 * (difficulty_modes[difficulty]?.enemy_health_multiplier || 1);
    var damage = 5 * (difficulty_modes[difficulty]?.enemy_damage_multiplier || 1);
    
    var shootingEnemy = new ShootingEnemyObject(enemySprite, x, y, health, damage);
    enemies_list.push(shootingEnemy);
}

console.log('ShootingEnemy carregado!');
