// FlyingEnemy - Inimigo voador com movimento irregular
// Desenvolvido para trabalho em equipe
var FlyingEnemyObject = function(sprite, x, y, health, damage) {
    const scale = 1.3; // Tamanho médio
    return {
        x: x,
        y: y,
        radius: 14 * scale,
        health: health,
        max_health: health,
        base_damage: damage,
        speed: 1.2, // Velocidade média
        alive: true,
        sprite: sprite,
        frameWidth: 32,
        frameHeight: 32,
        scale: scale,
        
        // Propriedades de animação
        animationTimer: 0,
        animationSpeed: 150, // ms por frame
        currentFrame: 0,
        frameCount: 4,
        numColumns: 2,
        invincibility_time: 0,
        isBoss: false,
        enemyType: 'flying', // Identificador do tipo
        
        frozen: false,
        freeze_timer: 0,
        // Propriedades específicas do FlyingEnemy
        flight_pattern: 'circle', // 'circle', 'zigzag', 'dive'
        pattern_timer: 0,
        pattern_duration: 3000, // 3 segundos por padrão
        base_y: y, // Altura base para voo
        amplitude: 50, // Amplitude do movimento vertical
        frequency: 0.002, // Frequência do movimento
        dive_timer: 0,
        dive_cooldown: 4000, // 4 segundos entre mergulhos
        is_diving: false,
        dive_speed: 3.0,
        dive_direction: { x: 0, y: 0 },
        wing_animation: 0, // Para animação das asas
        
        render: function(ctx, camera) {
            if (!this.alive) return;
            
            ctx.save();
            ctx.translate(-camera.x, -camera.y);

            // Efeito visual de congelamento
            if (this.frozen) {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#ADD8E6'; // Azul claro
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }

            // Efeito de sombra no chão
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.ellipse(this.x, this.y + this.radius + 10, this.radius * 0.8, this.radius * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.globalAlpha = 1.0;
            
            // Efeito visual do mergulho
            if (this.is_diving) {
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#FF8C00';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius + 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Animação das asas
            this.wing_animation += 0.3;
            var wingOffset = Math.sin(this.wing_animation) * 3;
            
            // Sprite do inimigo
            if (this.sprite && this.sprite.complete) {
                const frameX = (this.currentFrame % this.numColumns) * this.frameWidth;
                const frameY = Math.floor(this.currentFrame / this.numColumns) * this.frameHeight;

                ctx.drawImage(
                    this.sprite,
                    frameX, frameY, this.frameWidth, this.frameHeight,
                    this.x - this.radius, this.y - this.radius + wingOffset,
                    this.radius * 2, this.radius * 2
                );
            } else {
                // Fallback: círculo laranja com asas
                ctx.fillStyle = this.is_diving ? '#FF8C00' : '#FFA500';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Desenhar asas
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.ellipse(this.x - this.radius * 0.7, this.y + wingOffset, this.radius * 0.6, this.radius * 0.3, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(this.x + this.radius * 0.7, this.y + wingOffset, this.radius * 0.6, this.radius * 0.3, 0, 0, Math.PI * 2);
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
            
            // Lógica de congelamento
            if (this.frozen) {
                this.freeze_timer -= dt;
                if (this.freeze_timer <= 0) {
                    this.frozen = false;
                }
                return; // Pula o resto da atualização se estiver congelado
            }

            // Atualiza a animação
            this.animationTimer += dt;
            if (this.animationTimer > this.animationSpeed) {
                this.currentFrame = (this.currentFrame + 1) % this.frameCount;
                this.animationTimer = 0;
            }

            // Atualizar timer de invencibilidade
            if (this.invincibility_time > 0) {
                this.invincibility_time -= dt;
            }
            
            // Atualizar timers
            this.pattern_timer += dt;
            this.dive_timer += dt;
            
            // Lógica do mergulho
            if (this.dive_timer >= this.dive_cooldown && !this.is_diving) {
                this.startDive();
            }
            
            if (this.is_diving) {
                this.updateDive(dt);
            } else {
                this.updateFlight(dt);
            }
        },
        
        startDive: function() {
            this.is_diving = true;
            this.dive_timer = 0;
            
            // Calcular direção do mergulho (em direção ao jogador)
            if (player) {
                var dx = player.x - this.x;
                var dy = player.y - this.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    this.dive_direction.x = dx / distance;
                    this.dive_direction.y = dy / distance;
                }
            }
        },
        
        updateDive: function(dt) {
            // Mover durante o mergulho
            this.x += this.dive_direction.x * this.dive_speed * (dt / 16.67);
            this.y += this.dive_direction.y * this.dive_speed * (dt / 16.67);
            
            // Verificar se o mergulho terminou (quando atinge o chão ou tempo limite)
            if (this.y >= this.base_y || this.dive_timer >= 2000) {
                this.is_diving = false;
                this.y = Math.min(this.y, this.base_y);
            }
        },
        
        updateFlight: function(dt) {
            // Trocar padrão de voo periodicamente
            if (this.pattern_timer >= this.pattern_duration) {
                this.pattern_timer = 0;
                var patterns = ['circle', 'zigzag', 'hover'];
                this.flight_pattern = patterns[Math.floor(Math.random() * patterns.length)];
            }
            
            // Aplicar padrão de voo
            switch(this.flight_pattern) {
                case 'circle':
                    this.updateCircleFlight(dt);
                    break;
                case 'zigzag':
                    this.updateZigzagFlight(dt);
                    break;
                case 'hover':
                    this.updateHoverFlight(dt);
                    break;
            }
        },
        
        updateCircleFlight: function(dt) {
            // Movimento circular
            var centerX = WIDTH / 2;
            var centerY = HEIGHT / 2;
            var radius = 100;
            var angle = this.pattern_timer * this.frequency;
            
            this.x = centerX + Math.cos(angle) * radius;
            this.y = centerY + Math.sin(angle) * radius;
        },
        
        updateZigzagFlight: function(dt) {
            // Movimento em zigue-zague
            var targetX = player ? player.x : WIDTH / 2;
            var targetY = player ? player.y : HEIGHT / 2;
            
            var dx = targetX - this.x;
            var dy = targetY - this.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                // Adicionar componente vertical senoidal
                var zigzagY = Math.sin(this.pattern_timer * this.frequency * 2) * this.amplitude;
                
                var moveX = (dx / distance) * this.speed * (dt / 16.67);
                var moveY = (dy / distance) * this.speed * (dt / 16.67) + zigzagY * 0.1;
                
                this.x += moveX;
                this.y += moveY;
            }
        },
        
        updateHoverFlight: function(dt) {
            // Ficar pairando sobre o jogador
            if (player) {
                var targetX = player.x;
                var targetY = player.y - 80; // 80 pixels acima do jogador
                
                var dx = targetX - this.x;
                var dy = targetY - this.y;
                var distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    var moveX = (dx / distance) * this.speed * 0.5 * (dt / 16.67);
                    var moveY = (dy / distance) * this.speed * 0.5 * (dt / 16.67);
                    
                    this.x += moveX;
                    this.y += moveY;
                }
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
                createParticleExplosion(this.x, this.y, "#FFA500", 18);
                
                // Dropar XP
                var xpOrb = new ExperienceOrbObject(xpSprite, this.x, this.y, 18);
                experience_orbs_list.push(xpOrb);
            } else {
                // Efeito visual de dano
                createParticleExplosion(this.x, this.y, "#FF0000", 6);
            }
        }
    };
};

// Função para spawnar FlyingEnemy
function spawnFlyingEnemy() {
    if (!player || !game_running) return;
    
    // Spawnar nas bordas da tela, mas no ar
    var side = Math.floor(Math.random() * 4);
    var x, y;
    
    switch(side) {
        case 0: // Topo
            x = Math.random() * WIDTH;
            y = -30;
            break;
        case 1: // Direita
            x = WIDTH + 30;
            y = Math.random() * HEIGHT * 0.7; // Só na parte superior
            break;
        case 2: // Baixo
            x = Math.random() * WIDTH;
            y = HEIGHT * 0.3; // Só na parte superior
            break;
        case 3: // Esquerda
            x = -30;
            y = Math.random() * HEIGHT * 0.7; // Só na parte superior
            break;
    }
    
    // Calcular stats baseado na dificuldade
    var difficulty = current_difficulty || 'normal';
    var health = 20 * (difficulty_modes[difficulty]?.enemy_health_multiplier || 1);
    var damage = 10 * (difficulty_modes[difficulty]?.enemy_damage_multiplier || 1);
    
    var flyingEnemy = new FlyingEnemyObject(enemySprite, x, y, health, damage);
    flyingEnemy.base_y = y; // Definir altura base
    enemies_list.push(flyingEnemy);
}

console.log('FlyingEnemy carregado!');
